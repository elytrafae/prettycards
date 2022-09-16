import { PrettyCards_plugin } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var lastAppendedCard;
var friendshipData;

PrettyCards_plugin.events.on("appendCard()", function(data) {
    lastAppendedCard = data.element;
})

PrettyCards_plugin.events.on("appendCardDeck()", function(data) {

})

function overrideWithEvent() {
    var oldFunc = window.appendCardDeck;
    window.appendCardDeck = function(card) {
        var ret = oldFunc(card);
        PrettyCards_plugin.events.emit("appendCardDeck()", {card: card, element: lastAppendedCard});
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

	}).fail(function() {
		// Fail
	});
})
