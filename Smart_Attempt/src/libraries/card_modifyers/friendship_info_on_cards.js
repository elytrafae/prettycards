import { addSetting, PrettyCards_plugin, settings } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var friendshipData;

PrettyCards_plugin.events.on("func:appendCardDeck func:appendCardCraft", function(card, element) {
    //console.log("Feild's events work!", data1, data2);
    //var card = data.card;
    //var element = data.element;
    PrettyCards_plugin.events.on("PrettyCards:friendshipFetched", function(data) {
        PrettyCards_plugin.events.on("PrettyCards:selfFriendshipLeaderboardFetched", function(lbData) {
            //console.log("My events work!");
            var xp = 0;
            var pos = -1; 
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

            var level = window.getLevel(xp);
            var xp_left = xp - utility.getXpForLevel(level - 1);
            var xp_to_next = window.distanceNextLevel(level);

            utility.addCustomSimpleTextIconToCard(
                element, 
                "/images/friendship.png", 
                `<span>Level: ${level}</span><br><span>XP: ${xp_left}/${xp_to_next}</span>${pos != -1 ? `<br><span>Rank: ${pos}</span>` : ""}`
            );
        });
    });
})

addSetting({
	'key': 'friendship_info_on_cards',
	'name': 'Display Friendship Info on Cards', // Name in settings page
	'note': "When on, a heart will appear on the bottom-left corner of a card's image. Hovering over it will display information about your friendship status for that card.",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "card"
});

if (settings.friendship_info_on_cards.value() && (window.underscript.onPage("Decks") || window.underscript.onPage("Crafting"))) {
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
}

