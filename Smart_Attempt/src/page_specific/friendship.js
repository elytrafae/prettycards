import { prettycards, PrettyCards_plugin, settings , addSetting} from "../libraries/underscript_checker";
import { utility } from "../libraries/utility";

var friendship_sort_setting = addSetting({
    'key': 'friendship_sort',
    'name': 'Enable Friendship Sorting', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});

/** @type {Object<number, number>} */
var cardRanks = {};

function InitFriendshipSort() {
    var oldApplyFilters = window.applyFilters;

    var filterTable = window.$("table").first();

    filterTable.find("td:nth-child(2)").css("width", "300px");
    filterTable.find("td:nth-child(2)").after('<td><select id="PrettyCards_FriendshipSort" class="form-control" style="color:white;" onchange="applyFilters();showPage(0);"><option value="0">Waiting . . .</option></select></td>');

    PrettyCards_plugin.events.on("PrettyCards:TranslationExtReady", function () {
        var optionList = [window.$.i18n("pc-friendship-sort-xp"), window.$.i18n("pc-friendship-sort-rank"), window.$.i18n("pc-friendship-sort-levelup"), window.$.i18n("pc-friendship-sort-reward", window.$.i18n("reward-shiny-pack"))];
        
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
                var arank = cardRanks[a.id] || 1000;
                var brank = cardRanks[b.id] || 1000;
                if (arank >= 1000 && brank >= 1000) {
                    return b.xp - a.xp;
                }
                return arank - brank;
            }
        } else if (value == 2) {
            sortFunction = function (a, b) {
                return a.xpUntilNextLevel - b.xpUntilNextLevel;
            }
        } else if (value == 3) {
            sortFunction = function (a, b) {
                if (a.level >= 200 && b.level < 200) {
                    return true;
                }
                if (a.level < 200 && b.level >= 200) {
                    return false;
                }
                return a.xpUntilNextUcpReward - b.xpUntilNextUcpReward;
            }
        }
        pages.sort(sortFunction);
    }

    // TODO: Make this use my friendship DB instead of underscript cache. Underscript cache does not contain all cards, only cards that got viewed
    PrettyCards_plugin.events.on("Chat:Connected", () => {
        utility.getFriendshipInfo(window.selfId, function(data) {
            /** @type {Array<Object<string,number>>} */
            var scores = data.scores;
            scores.forEach((score) => {
                cardRanks[score.cardId] = score.rank;
            });
            PrettyCards_plugin.events.on("Friendship:loaded", function (data) {
                var lb = JSON.parse(localStorage["underscript.cache.friendship"]);
                // Test code //
                /*
                PrettyCards_plugin.events.emit("PrettyCards:customCards");
                //console.log("COLLECTION: ", prettycards.ddlc_collection);
                var id1 = prettycards.ddlc_collection.cards[16].fixedId;
                prettycards.ddlc_collection.cards[16].xp = utility.getXpForLevel(219)-1;
                friendshipItems[id1] = {claim: 5, idCard: id1, notClaimed: true, user: {}, xp: utility.getXpForLevel(224)-1};
                window.collection.push(prettycards.ddlc_collection.cards[16]);
                var id2 = prettycards.ddlc_collection.cards[12].fixedId;
                prettycards.ddlc_collection.cards[12].xp = utility.getXpForLevel(219)-2;
                friendshipItems[id2] = {claim: 5, idCard: id2, notClaimed: false, user: {}, xp: utility.getXpForLevel(224)-2};
                window.collection.push(prettycards.ddlc_collection.cards[12]);
                */
                //////////////
                for (var i=0; i < window.collection.length; i++) {
                    var card = window.collection[i];
                    card.level = window.getLevel(card.xp);
                    card.xpUntilNextLevel = window.xpUntilNextLevel(card.level, card.xp);
                    var nextUCPRewardXP = utility.getXpForLevel(Math.ceil((card.level+1)/25)*25);
                    card.xpUntilNextUcpReward = nextUCPRewardXP - card.xp;
                }
            })
        }).fail(function() {
            // Fail
            // Do nothing, I guess . . . ?
        });
    });
    
}

function InitFriendship() {
    if (friendship_sort_setting.value()) {
        InitFriendshipSort();
    }

}

export {InitFriendship};