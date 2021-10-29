
import {} from "./libraries/jquery_additions.js";

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {} from "/src/libraries/updater.js";

// The Event ensurer MUST be required AFTER underscript stuff, but BEFORE anything else that might require it!
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

import {} from "./libraries/mobile/navigation.js";

import {} from "./libraries/chat/user_info.js";
import {} from "./libraries/private_games/private_game_host.js";
import {} from "./libraries/private_games/private_game_recipient.js";

import {} from "/src/libraries/card_modifyers/custom_cards.js";
import {} from "/src/libraries/card_modifyers/breaking_skin_hover.js";
import {} from "/src/libraries/card_modifyers/theme_song_viewer.js";
import {} from "/src/libraries/card_modifyers/card_flavor.js";
import {} from "/src/libraries/card_modifyers/card_description_corrections.js";

import {} from "./libraries/main_menu.js";

import {InitPacks} from "./page_specific/packs.js";
import {InitDecks} from "/src/page_specific/decks.js";
import {InitPlay} from "/src/page_specific/play.js";
import {InitGameList} from "/src/page_specific/game_list.js";
import {InitHub} from "/src/page_specific/hub.js";

if (settings.packs.value() && underscript.onPage('Packs')) {
	//console.log("Packs page!", InitPacks);
	InitPacks();
} else if (settings.override_decks.value()) {
	if (underscript.onPage("Decks")) {
		InitDecks();
	} else if (underscript.onPage("Play")) {
		InitPlay();
	} else if (underscript.onPage("GamesList")) {
		InitGameList();
	}
}

if (underscript.onPage("Hub")) {
	InitHub();
}

// ! Deck and Play Page modifications are disabled for now !

/*
PrettyCards_plugin.events.on("GameEvent", function (data) {
	if (data.action === "getPlaySound") {
		console.log("Sound played!", data.sound);
	}
})
*/