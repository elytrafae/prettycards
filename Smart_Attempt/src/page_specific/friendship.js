import { PrettyCards_plugin, settings } from "../libraries/underscript_checker";
import { utility } from "../libraries/utility";

settings.friendship_sort = PrettyCards_plugin.settings().add({
    'key': 'friendship_sort',
    'name': 'Enable Friendship Sorting', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});




function InitFriendshipSort() {
    var oldApplyFilters = window.applyFilters;

    var filterTable = window.$("table").first();

    filterTable.find("td:nth-child(2)").css("width", "300px");
    filterTable.find("td:nth-child(2)").after('<td><select id="PrettyCards_FriendshipSort" class="form-control" style="color:white;" onchange="applyFilters();showPage(0);"><option value="0">Waiting . . .</option></select></td>');

    PrettyCards_plugin.events.on("translation:loaded", function () {
        var optionList = ["Highest XP", "Highest Position", "Closest to Level Up", "Closest to " + window.$.i18n("item-ucp") + " Reward"];
        
        var optionsString = "";
        for (var i=0; i < optionList.length; i++) {
            optionsString += `<option value="${i}">${optionList[i]}</option>`;
        }
        window.$("#PrettyCards_FriendshipSort").html(optionsString);
    });

    window.applyFilters = function() {
        oldApplyFilters();
        ApplySorting();
    }

    function ApplySorting() {
        var value = window.$("#PrettyCards_FriendshipSort").val();
        if (value == 0) {return;} // Default sorting. No need to do it again.
        var sortFunction;
        if (value == 1) {
            sortFunction = function (a, b) {
                return a.rank - b.rank;
            }
        } else if (value == 2) {
            sortFunction = function (a, b) {
                return a.xpUntilNextLevel - b.xpUntilNextLevel;
            }
        } else if (value == 3) {
            sortFunction = function (a, b) {
                return a.xpUntilNextUcpReward - b.xpUntilNextUcpReward;
            }
        }
        pages.sort(sortFunction);
    }

    PrettyCards_plugin.events.on("Friendship:loaded", function (data) {
        var lb = JSON.parse(localStorage["underscript.cache.friendship"]);
        for (var i=0; i < window.collection.length; i++) {
            var card = window.collection[i];
            card.level = window.getLevel(card.xp);
            card.xpUntilNextLevel = window.xpUntilNextLevel(card.level, card.xp);
            var rank = lb[card.fixedId + ";" + selfId];
            if (rank != null && rank.rank > 0) {
                card.rank = rank.rank;
            } else {
                card.rank = 1000;
            }
            var nextUCPRewardXP = utility.getXpForLevel(Math.ceil((card.level+1)/25)*25);
            card.xpUntilNextUcpReward = nextUCPRewardXP - card.xp;
        }
    })
}

function InitFriendship() {
    if (settings.friendship_sort.value()) {
        InitFriendshipSort();
    }

}

export {InitFriendship};