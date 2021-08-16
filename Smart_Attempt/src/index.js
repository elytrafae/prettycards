
import {} from "./libraries/jquery_additions.js";

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {} from "/src/libraries/updater.js";

import {} from "./libraries/chat/user_info.js";
import {} from "./libraries/private_games/private_game_host.js";
import {} from "./libraries/private_games/private_game_recipient.js";

import {} from "/src/libraries/card_modifyers/custom_cards.js";
import {} from "/src/libraries/card_modifyers/breaking_skin_hover.js";
import {} from "/src/libraries/card_modifyers/theme_song_viewer.js";
import {} from "/src/libraries/card_modifyers/card_flavor.js";

import {} from "./libraries/main_menu.js";

import {InitPacks} from "./page_specific/packs.js";


if (settings.packs.value() && underscript.onPage('Packs')) {
	//console.log("Packs page!", InitPacks);
	InitPacks();
}

/*
PrettyCards_plugin.events.on("GameEvent", function (data) {
	if (data.action === "getPlaySound") {
		console.log("Sound played!", data.sound);
	}
})
*/