import { prettycards, PrettyCards_plugin, settings , addSetting } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var hd_card_skins = [];
var debugList = [];

addSetting({
	'key': 'hd_card_skins',
	'name': 'HD Card Skins', // Name in settings page
    'note': 'Enables HD Card Skins. Only applies to registered card skins.<br>I would recommend turning this off if:<br>- You are using a low resolution device.<br>- You have slow internet access.<br>- You pay for your internet based on consumption (ex. Mobile data).',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
    'category': "controversial"
});

function returnHDImageIfThereIs(image, forceNormal = false) {
    if (hd_card_skins.includes(image)) {
        return `https://raw.githubusercontent.com/CMD-God/prettycards/master/img/HDCardSkins/${image}.png`;
    }
    if (forceNormal) {
        return `/images/cards/${image}.png`;
    }
    return utility.getCardImageLink(image);
}


if (settings.hd_card_skins.value()) {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        $.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/hdCardSkins.json", {}, function(data) {
            //console.log("HD Card Skin Data", data);
            hd_card_skins = data;
            PrettyCards_plugin.events.emit.singleton("PrettyCards:hdSkinsFetched", {skins: data});
        })

        var originalAppendCardCardSkinShop = window.appendCardCardSkinShop;
        window.appendCardCardSkinShop = function(cardSkin, frameName) {
            var appendedCard = originalAppendCardCardSkinShop(cardSkin, frameName);
            PrettyCards_plugin.events.emit("appendCardCardSkinShop()", {cardSkin : cardSkin, frameName : frameName, element: appendedCard});
            return appendedCard;
        }
    });

    PrettyCards_plugin.events.on("appendCard()", function(data) {
        var card = data.card;
        var element = data.element;
        PrettyCards_plugin.events.on("PrettyCards:hdSkinsFetched", function() { // Race conditions bad
            if (hd_card_skins.includes(card.image)) {
                element.find(".cardImage").css("backgroundImage", `url("${returnHDImageIfThereIs(card.image)}")`);
            }
        })
    })

    PrettyCards_plugin.events.on("appendCardCardSkinShop()", function(data) {
        var skin = data.cardSkin;
        var element = data.element;
        var image = skin.image;
        PrettyCards_plugin.events.on("PrettyCards:hdSkinsFetched", function() { // Race conditions bad
            if (hd_card_skins.includes(image)) {
                element.find(".cardImage").css("backgroundImage", `url("${returnHDImageIfThereIs(image)}")`);
            }
        })
    })

    PrettyCards_plugin.events.on("appendHubDeck()", function(data) {
		var deck = data.deck;
		var element = data.element;
        var image = deck.image;
        PrettyCards_plugin.events.on("PrettyCards:hdSkinsFetched", function() { // Race conditions bad
            if (hd_card_skins.includes(image)) {
                element.find(".hubDeckImage img").attr("src", returnHDImageIfThereIs(image));
            }
        })
    });
    
}


export {hd_card_skins, returnHDImageIfThereIs}