import { PrettyCards_plugin } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var lastAppendedCard;
var friendshipData;

PrettyCards_plugin.events.on("appendCard()", function(data) {
    lastAppendedCard = data.element;
})

const PLACEHOLDER_FRIENDSHIP_RANK = 222222222; // Really big number that is beyond what the leaderboard position can be.

PrettyCards_plugin.events.on("appendCardDeck() appendCardCraft()", function(data) {
    var card = data.card;
    var element = data.element;
    PrettyCards_plugin.events.on("PrettyCards:friendshipFetched", function(data) {
        PrettyCards_plugin.events.on("PrettyCards:selfFriendshipLeaderboardFetched", function(lbData) {
            var xp = 0;
            var pos = PLACEHOLDER_FRIENDSHIP_RANK; 
            if (Array.isArray(data)) {
                data = data[0]; // IDK what TF this is about, but here we are.
            }
            var friendshipItems = JSON.parse(data.friendshipItems);
            var item = utility.binarySearch(friendshipItems, card.id, (ele) => ele.idCard);
            if (!item || item.xp <= 0) {
                return;
            }
            xp = item.xp;
            //console.log(item, lbData);
            lbData = lbData[0];
            if (lbData) {
                var rankItem = utility.binarySearch(lbData.scores, card.id, (ele) => ele.cardId);
                if (rankItem) {
                    pos = rankItem.rank;
                }
            }
            var icon = document.createElement("IMG");
            icon.src = "/images/friendship.png";
            element.find(".PrettyCards_CardBottomLeftInfo").append(icon);

            var level = window.getLevel(xp);
            var xp_left = xp - utility.getXpForLevel(level - 1);
            var xp_to_next = window.distanceNextLevel(level);
            window.tippy(icon, {
                content: `
                    <span>Level: ${level}</span><br>
                    <span>XP: ${xp_left}/${xp_to_next}</span>
                    ${pos < PLACEHOLDER_FRIENDSHIP_RANK ? `<br><span>Rank: ${pos}</span>` : ""}`,
                allowHTML: true,
                arrow: true,
                inertia: true,
                placement: "top",
                appendTo: window.document.body,
                boundary: 'window',
                getReferenceClientRect: window.document.body.getBoundingClientRect
            });
        });
    });
})

function overrideWithEvent() {
    var oldFunc = window.appendCardDeck;
    window.appendCardDeck = function(card) {
        var ret = oldFunc(card);
        PrettyCards_plugin.events.emit("appendCardDeck()", {card: card, element: lastAppendedCard});
        return ret; // Just in case Onu changes the function.
    }
    var oldFuncCraft = window.appendCardCraft;
    window.appendCardCraft = function(card) {
        var ret = oldFuncCraft(card);
        PrettyCards_plugin.events.emit("appendCardCraft()", {card: card, element: lastAppendedCard});
        return ret; // Just in case Onu changes the function.
    }
}

if (window.appendCardDeck) {
    overrideWithEvent();
} else {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        overrideWithEvent();
    })
}

$.getJSON("/FriendshipConfig", {}, function(data) {
    friendshipData = data;
    PrettyCards_plugin.events.emit.singleton("PrettyCards:friendshipFetched", friendshipData);
})

PrettyCards_plugin.events.on("Chat:Connected", function() {
    utility.getFriendshipInfo(window.selfId, function(data) {
        // Success
        //console.log(data);
        data.scores = data.scores.sort((a, b) => (a.cardId - b.cardId));
        PrettyCards_plugin.events.emit.singleton("PrettyCards:selfFriendshipLeaderboardFetched", data);
	}).fail(function() {
		// Fail
        PrettyCards_plugin.events.emit.singleton("PrettyCards:selfFriendshipLeaderboardFetched", null);
	});
})
