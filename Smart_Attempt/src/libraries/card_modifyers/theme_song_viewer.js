
// This library adds a button onto cards outside of games so you can listen to their theme songs.

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new.js";
import { prettycards } from "../underscript_checker";

settings.theme_song_preview = PrettyCards_plugin.settings().add({
	'key': 'theme_song_preview',
	'name': 'Card Theme Song Preview', // Name in settings page
	'note': "Outside of games, if this is on, a button will appear on cards<br>if they are hovered in the top-left corner of the card image.<br>Pressing it will play that card's theme song (if it has one)!",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
});

var cardExceptions = {
	358 : "/sounds/load.wav",
	351 : "/sounds/gasterBlaster.wav"
}

const audio = new Audio();
//console.log("Audio", audio);

window.prettycards.playThemeSongPreviewEvent = function(SRC, e) {
	// console.log("Button clicked!", e);
	audio.src = SRC;
	audio.play();
	e.stopPropagation();
}

if (settings.theme_song_preview.value() && !underscript.onPage("Game")) {

	PrettyCards_plugin.events.on("appendCard() PC_appendCard", function(data) {
		var html$ = data.element;
		var card = data.card;
		var doesCardHaveTheme = card.rarity === "LEGENDARY" || card.rarity === "DETERMINATION";
		if (card.id in cardExceptions) { // Load and Gaster Blaster respectively.
			//console.log(card, "This is a Gaster Blaster or a Load!");
			doesCardHaveTheme = true;
		} else if ("hasThemeSong" in card) {
			doesCardHaveTheme = card.hasThemeSong;
		}
		
		if (doesCardHaveTheme) {
			var collection = card.collection;
			if (typeof(collection) == "number") {
				collection = collections[collection];
				card.collection = collection;
			}
			var _SRC = "";
			if (collection) {
				_SRC = collection.cardSongPrefix + card.name.split(' ').join('_') + '.ogg';
				//console.log(card, card.id, $.i18n('card-name-' + card.id, 1), _SRC);
			} else {
				if (card.id in cardExceptions) {
					_SRC = cardExceptions[card.id];
				} else {
					_SRC = "/musics/cards/" + card.name.split(' ').join('_') + ".ogg";
				}
			}
			const SRC = _SRC;
			var button = $('<span class="glyphicon glyphicon-volume-up PrettyCards_CardThemeSongPlayer" onclick="prettycards.playThemeSongPreviewEvent(\'' + SRC + '\', event)"></span>');
			
			html$.append(button);
		}
	});
	
}

export {};