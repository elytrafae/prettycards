import { PrettyCards_plugin, settings } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var hd_card_skins = [];

settings.hd_card_skins = PrettyCards_plugin.settings().add({
	'key': 'hd_card_skins',
	'name': 'HD Card Skins', // Name in settings page
    'note': 'Enables HD Card Skins. Only applies to registered card skins.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

if (settings.hd_card_skins.value()) {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        $.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/baseThemeSongData.json", {}, function(data) {
            hd_card_skins = data;
            PrettyCards_plugin.events.emit.singleton("PrettyCards:hdSkinsFetched", data);
        })
    });

    PrettyCards_plugin.events.on("appendCard()", function(data) {
        var card = data.card;
        var element = data.element;
        console.log(hd_card_skins);
        PrettyCards_plugin.events.on("PrettyCards:hdSkinsFetched", function() { // Race conditions bad
            if (hd_card_skins.includes(card.image)) {
                element.find(".cardImage").css("background-image", `https://raw.githubusercontent.com/CMD-God/prettycards/master/img/HDCardSkins/${card.image}.png`);
            }
        })
    })
    
}
