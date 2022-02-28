import { PrettyCards_plugin } from "../libraries/underscript_checker";

function GetXpForLevel(level) {
    return window.U0*level + (level*(level-1))/2*window.R;
}

function InitFriendship() {
    

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
        var sortFunction = function (a, b) {
            return compare(window.friendshipItems[b.fixedId].notClaimed, window.friendshipItems[a.fixedId].notClaimed) || compare(b.xp, a.xp);
        }
        var value = window.$("#PrettyCards_FriendshipSort").val();
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
            var nextUCPRewardXP = GetXpForLevel(Math.ceil((card.level+1)/25)*25);
            card.xpUntilNextUcpReward = nextUCPRewardXP - card.xp;
        }
    })

}

export {InitFriendship};