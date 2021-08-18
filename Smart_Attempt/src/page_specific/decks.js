
import {CardSkinSelector} from "/src/libraries/card_skin_selector.js";
import {SavedDeckSelector} from "/src/libraries/deck_selector.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

function InitDecks() {
	PrettyCards_plugin.events.on("SoulSelector:decksLoaded", function(data) {
		var deckSelector = new SavedDeckSelector();
		deckSelector.OpenDialogue();
	});
}

export {InitDecks};