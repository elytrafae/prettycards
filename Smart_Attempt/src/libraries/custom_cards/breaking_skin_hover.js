
// This library makes it so when you hover over a breaking skin card, the text goes over the skin (onto z-index 7).

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

settings.breaking_skin_fix = PrettyCards_plugin.settings().add({
	'key': 'breaking_skin_fix',
	'name': 'Breaking Skin Fix', // Name in settings page
	'note': 'Whenever you hover over a breaking skin card, the name, description, cost, ATK and HP will go over the skin.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
});


if (settings.breaking_skin_fix.value()) {

	$("head").append(`<style>
		.card.breaking-skin:hover .cardName {
			z-index: 7;
		}
		
		.card.breaking-skin:hover .cardCost {
			z-index: 7;
		}
		
		.card.breaking-skin:hover .cardDesc {
			z-index: 7;
		}
		
		.card.breaking-skin:hover .cardATK {
			z-index: 7;
		}
		
		.card.breaking-skin:hover .cardHP {
			z-index: 7;
		}
	</style>`);
}

export {};