

import {} from "./libraries/jquery_additions.js";

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {} from "/src/libraries/custom_page_base.js";
//import {} from "/src/libraries/updater.js";

// The Event ensurer MUST be required AFTER underscript stuff, but BEFORE anything else that might require it!
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {} from "/src/libraries/ajax_event_hooker.js";
import {} from "/src/libraries/card_modifyers/basic_universal_card_additions.js"; // This has to be loaded before any major modifications are done to cards.

// This is here to make sure the background settings are above the Miscallenious ones.
import {} from "/src/libraries/background/background_manager.js";

import {} from "/src/libraries/kromer_test.js";

import {} from "./libraries/mobile/navigation.js";

import {} from "./libraries/chat/user_info.js";
// import {} from "./libraries/chat/embed_media.js";
import {} from "./libraries/private_games/private_game_host.js";
import {} from "./libraries/private_games/private_game_recipient.js";

// import {} from "/src/libraries/card_modifyers/custom_cards.js";
import {} from "/src/libraries/card_modifyers/breaking_skin_hover.js";
import {} from "/src/libraries/card_modifyers/theme_song_viewer.js";
// import {} from "/src/libraries/card_modifyers/card_flavor.js";
import {} from "/src/libraries/card_modifyers/card_description_corrections.js";
import {} from "/src/libraries/card_modifyers/rarity_text_changer.js";
import {} from "/src/libraries/card_modifyers/switch_highlight.js";
// import {} from "/src/libraries/card_modifyers/card_helper_hover.js";
import {} from "/src/libraries/card_modifyers/za_filter.js";
import {} from "/src/libraries/card_modifyers/card_theme_song_manager.js";
import {} from "/src/libraries/card_modifyers/hd_card_skins.js";
import {} from "/src/libraries/card_modifyers/hd_game_animations.js";
import {} from "/src/libraries/card_modifyers/friendship_info_on_cards.js";

import {} from "/src/libraries/translation/translation_manager.js";

// import {} from "/src/libraries/persona_overlay.js";

import {FancyDisplay} from "/src/libraries/fancy_helper.js";
import {} from "/src/libraries/fancy_card_select.js";
import {} from "/src/libraries/emote_sound_manager.js";

// import {} from "/src/libraries/cosmetic_wishlist.js"; // Temporarily Removed!

import {} from "./libraries/main_menu.js";

import {} from "/src/libraries/footer_remover.js";

// import {} from "/src/libraries/external_api_integration/youtube_player.js";

import {InitPacks} from "./page_specific/packs.js";
import {InitDecks} from "/src/page_specific/decks.js";
import {InitPlay} from "/src/page_specific/play.js";
import {InitGameList} from "/src/page_specific/game_list.js";
import {InitHub} from "/src/page_specific/hub.js";
import {InitCrafting} from "/src/page_specific/crafting.js";
// import {InitGame} from "/src/page_specific/game.js";
import {InitCustomCardSkins} from "/src/page_specific/custom_card_skins.js";
import {InitCustomCards} from "/src/page_specific/custom_cards.js";
import {InitFriendship} from "/src/page_specific/friendship.js";
import {InitSmashOrPass} from "/src/page_specific/smash_or_pass.js";
import {InitCustomTranslations} from "/src/page_specific/custom_translations.js";

//import {} from "/src/libraries/april_fools_downloader.js"; // Keeping this here for next year!

if (settings.packs_page.value() && underscript.onPage('Packs')) {
	//console.log("Packs page!", InitPacks);
	InitPacks();
} else if (underscript.onPage("Hub")) {
	InitHub();
} else if (underscript.onPage("Crafting")) {
	InitCrafting();
} else if (underscript.onPage("CustomCardSkins")) {
	InitCustomCardSkins();
} else if (underscript.onPage("CustomCards")) {
	InitCustomCards();
} else if (underscript.onPage("Friendship")) {
	InitFriendship();
} else if (underscript.onPage("SmashOrPass")) {
	InitSmashOrPass();
} else if (underscript.onPage("CustomTranslations")) {
	InitCustomTranslations();
}

if (settings.override_decks.value()) {
	if (underscript.onPage("Decks")) {
		InitDecks();
	} else if (underscript.onPage("Play")) {
		InitPlay();
	} else if (underscript.onPage("GamesList")) {
		InitGameList();
	}
}

/*
var trans_array = [];
for (var key in settings) {
	console.log(settings[key]);
}
*/

// ! Deck and Play Page modifications are disabled for now !

/*
PrettyCards_plugin.events.on("GameEvent", function (data) {
	if (data.action === "getPlaySound") {
		console.log("Sound played!", data.sound);
	}
})
*/