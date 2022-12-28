
// This library makes it so when you hover over a breaking skin card, the text goes over the skin (onto z-index 7).

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";

ExecuteWhen("PrettyCards:onPageLoad", function () {
	if (settings.breaking_skin_fix.value()) {
		window.$("head").append(`<style>
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

		if (settings.breaking_skin_stats_fix.value()) {
			window.$("head").append(`
				.card.breaking-skin .cardStatus {
					z-index: 5;
				}

				.card.breaking-skin .cardTribes {
					z-index: 5;
				}

				.card.breaking-skin:hover .cardStatus {
					z-index: 8;
				}

				.card.breaking-skin:hover .cardTribes {
					z-index: 8;
				}
			`);
		}
		
	}
	
	// Let's be real. This just improves things.
	window.$("head").append(`<style>
		.card .cardImage {
			background-size: contain;
		}
	</style>`);
})

export {};