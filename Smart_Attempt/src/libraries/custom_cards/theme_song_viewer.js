
// This library adds a button onto cards outside of games so you can listen to their theme songs.

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

import {CustomCardsDictionary} from "/src/libraries/custom_cards/custom_cards_dictionary.js";

settings.theme_song_preview = PrettyCards_plugin.settings().add({
	'key': 'theme_song_preview',
	'name': 'Card Theme Song Preview', // Name in settings page
	'note': "Outside of games, if this is on, a button will appear on cards if they are hovered in the top-left corner of the card image.<br>Pressing it will play that card's theme song (if it has one)!<br>NOTE: Does not work on Gaster Blasters and Loads.",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
});

const audio = new Audio();
console.log("Audio", audio);

if (settings.theme_song_preview.value() && !underscript.onPage("Game")) {

	PrettyCards_plugin.events.on("appendCard()", function(data) {
		var html$ = data.element;
		var card = data.card;
		var doesCardHaveTheme = card.rarity === "LEGENDARY" || card.rarity === "DETERMINATION";
		if ("hasThemeSong" in card) {
			doesCardHaveTheme = card.hasThemeSong;
		}
		
		if (doesCardHaveTheme) {
			var customExtension = null;
			for (var i=0; i < CustomCardsDictionary.customExtensions.length; i++) {
				var extension = CustomCardsDictionary.customExtensions[i];
				if (extension.id === card.extension) {
					customExtension = extension;
				}
			}
			var _SRC = "";
			if (customExtension != null) {
				_SRC = customExtension.themeSongFolder + $.i18n('card-name-' + card.id, 1).split(' ').join('_') + '.ogg';
				console.log(card, card.id, $.i18n('card-name-' + card.id, 1), _SRC);
			} else {
				_SRC = "/musics/cards/" + $.i18n('card-name-' + card.id, 1).split(' ').join('_') + ".ogg";
			}
			const SRC = _SRC;
			var button = $('<span class="glyphicon glyphicon-volume-up PrettyCards_CardThemeSongPlayer"></span>');
			button.click(function(e) {
				audio.src = SRC;
				audio.play();
				e.stopPropagation();
			});
			
			html$.append(button);
		}
	});
	
}

export {};