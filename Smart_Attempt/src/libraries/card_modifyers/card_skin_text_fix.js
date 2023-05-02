
// Fixes the text size for Card Skin displays

import { PrettyCards_plugin, addSetting } from "../underscript_checker";

var setting = addSetting({
	'key': 'card_skin_text_fix',
	'name': 'Card Skin Preview Text Fix', // Name in settings page
	'note': "Viewing card skins now always resizes text based on the skin's name's length instead of the original card's description!",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "card"
});

if (setting.value()) {
    PrettyCards_plugin.events.on("func:appendCardCardSkinShop func:appendCardCardSkinProfile", (card, element) => {
        var cardDescDiv$ = element.find('.cardDesc div');
        cardDescDiv$.css('font-size', '');
        var descSize = window.getResizedFontSize(cardDescDiv$, 81);
        cardDescDiv$.css('font-size', (descSize + "px"));
    })
}
