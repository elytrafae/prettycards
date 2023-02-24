
// This library makes it so when you hover over a breaking skin card, the text goes over the skin (onto z-index 7).

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";

ExecuteWhen("PrettyCards:onPageLoad", function () {
	if (settings.breaking_skin_fix.value()) {
		window.$("head").append(`<style>
			.card.breaking-skin:hover .cardImage {
				z-index: 4;
			}
		</style>`);
	}

	if (settings.breaking_skin_stats_fix.value()) {
		window.$("head").append(`
			<style>
				.card.breaking-skin .cardStatus {
					z-index: 5;
				}

				.card.breaking-skin .cardTribes {
					z-index: 5;
				}

				.card.breaking-skin .PrettyCards_CardBottomLeftInfo {
					z-index: 5;
				}
			</style>
		`);
	}
	
	// Let's be real. This just improves things.
	window.$("head").append(`<style>
		.card .cardImage {
			background-size: contain;
		}
	</style>`);
})

export {};