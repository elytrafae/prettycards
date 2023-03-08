import { PrettyCards_plugin, addSetting } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";


var ucoBadgeSetting = addSetting({
	'key': 'uco_badge',
	'name': 'Display UC:O Badge on Cards', // Name in settings page
	'note': "When on, an icon will appear on the bottom-left corner of a card's image, indicating that it is an Undercards Original card. Clicking on it will let you read more about it.",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "card"
});

if (ucoBadgeSetting.value()) {
    $.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/ucoCardIds.json", {}, function(data) {
        var set = new Set(data);
        PrettyCards_plugin.events.emit.singleton("PrettyCards:ucoCardListFetched", set);
    }).fail(function(err) {
        console.error("ERROR FETCHING UCO CARD LIST! ", err);
        PrettyCards_plugin.events.emit.singleton("PrettyCards:ucoCardListFetched", new Set());
    })
    
    PrettyCards_plugin.events.on("appendCard()", function(data) {
        var card = data.card;
        var ele = data.element;
        PrettyCards_plugin.events.on("PrettyCards:ucoCardListFetched", function(idList) {
            console.log(data, idList);
            if (idList.has(card.fixedId || card.id)) {
                PrettyCards_plugin.events.on("PrettyCards:TranslationExtReady", function() {
                    utility.addCustomSimpleTextIconToCard2(ele, 
                        "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardPowers/uco.png",
                        window.$.i18n("pc-cardbadge-uco-short"), 
                        window.$.i18n("pc-cardbadge-uco-desc"),
                        window.$.i18n("pc-cardbadge-uco-title")
                    );
                });
            }
        })
    })
}

