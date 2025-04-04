
// This library adds a button onto cards outside of games so you can listen to their theme songs.

import {PrettyCards_plugin, settings , addSetting, prettycards} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new.js";
import {getThemeSongSettingByCardId} from "/src/libraries/card_modifyers/card_theme_song_manager.js";

addSetting({
	'key': 'theme_song_preview',
	'name': 'Card Theme Song Preview', // Name in settings page
	'note': "Outside of games, if this is on, a button will appear on cards if they are hovered in the top-left corner of the card image. Pressing it will play that card's theme song (if it has one)!",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
	'category': "card"
});



var cardExceptions = {
	358 : "/sounds/load.wav",
	351 : "/sounds/gasterBlaster.wav"
}

const audio = new Audio();
//console.log("Audio", audio);

prettycards.playThemeSongPreviewEvent = function(SRC, e) {
	// console.log("Button clicked!", e);
	PrettyCards_plugin.events.emit("PrettyCards:pauseBGM");
	audio.src = SRC;
	audio.volume = utility.getUnderscriptVolumeSettingValue("jingle");
	audio.play();
	audio.onended = audio.onerror = function() {
		PrettyCards_plugin.events.emit("PrettyCards:resumeBGM");
	}
	e.stopPropagation();
}

function returnSimpleButtonHTML(SRC) {
	return '<span class="glyphicon glyphicon-volume-up PrettyCards_CardThemeSongPlayer" onclick="prettycards.playThemeSongPreviewEvent(\'' + SRC + '\', event)"></span>';
}

function createSimpleButton(card) {
	var collection = card.collection;
	if (typeof(collection) == "number") {
		collection = collections[collection];
		card.collection = collection;
	}

	var _SRC = "";
	if (card.isCustom) {
		_SRC = collection.cardSongPrefix + card.name.split(' ').join('_') + '.ogg';
		//console.log(card, card.id, $.i18n('card-name-' + card.id, 1), _SRC);
	} else {
		if (card.id in cardExceptions) {
			_SRC = cardExceptions[card.id];
		} else {
			_SRC = utility.getCardJingleLink(card.name);
		}
	}
	const SRC = _SRC;
	var button = $(returnSimpleButtonHTML(SRC));
	return button;
}

function BigPreviewLogic(nr) {
	return nr != 4 && nr < 7;
}

function createComplexButton(settings) {
	if (settings.replacements.length == 0) {
		return "";
	}
	if (settings.replacements.length == 1) {
		return returnSimpleButtonHTML(settings.replacements[0]);
	}
	var options = "";
	settings.replacements.forEach( (url, i) => {
		options = `${options}<button class="btn btn-primary" onclick="prettycards.playThemeSongPreviewEvent('${url}', event)">${i+1}</button>`
	});
	var button = $(`
	<span class="glyphicon glyphicon-volume-up PrettyCards_CardThemeSongPlayer" onclick="event.stopPropagation();">
		<span class="PrettyCards_TransparentText">S</span>
		<span class="PrettyCards_CardThemeSongList${BigPreviewLogic(settings.replacements.length) ? " PrettyCards_CardThemeSongList_Big" : ""}">
			${options}
		</span>
	</span>`);
	return button;
} 
function processCard(card, element) {
	//console.log("func:appendCard event fired on " + card.name);
	PrettyCards_plugin.events.on("PrettyCards:themeSongsReady", function() { // This makes sure these don't get appended before the page loads.
		//console.log("Theme Song Data Ready for " + card.name);
		var themeSongSettings = getThemeSongSettingByCardId(card.fixedId || card.id);
		var doesCardHaveTheme = card.rarity === "LEGENDARY" || card.rarity === "DETERMINATION";
		if (card.id in cardExceptions) { // Load and Gaster Blaster respectively.
			//console.log(card, "This is a Gaster Blaster or a Load!");
			doesCardHaveTheme = true;
		} else if ("hasThemeSong" in card) {
			doesCardHaveTheme = card.hasThemeSong;
		} else if (themeSongSettings) {
			doesCardHaveTheme = true;
		}
		
		if (doesCardHaveTheme) {
			//console.log(card.name + " has theme songs!");
			var button;
			if (themeSongSettings) {
				//console.log(card.name + " has complex buttons!");
				button = createComplexButton(themeSongSettings);
			} else {
				//console.log(card.name + " has a simple button!");
				button = createSimpleButton(card);
			}
			//console.log(card.name + "'s button: " + button);
			element.append(button);
		}
	});
} 


if (settings.theme_song_preview.value() && !underscript.onPage("Game") && !underscript.onPage("Spectate")) {

	//console.log("Theme Song Preview is turned on, and it's not the Game or Spectator page! Attempt 2!");

	PrettyCards_plugin.events.on("func:appendCard PC_appendCard", processCard);
	
}

export {};