
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new";

import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_ddlc_v2.js";

function DoStuffWhenAllCardsAreReady() {
	PrettyCards_plugin.events.emit("PrettyCards:customCards");
	console.log(collections);
	var cont = $("#PrettyCards_CustomCardCategories");
	for (var i=0; i < collections.length; i++) {
		var c = collections[i];
		cont.append(`
			<div class="PrettyCards_CardCollection">
				<div class="PrettyCards_CollectionName">${c.name}</div>
				<div class="PrettyCards_CollectionAuthor Artist">${c.author}</div>
				<div class="PrettyCards_CollectionDetails">
					<div>${c.cards.length} ${(c.cards.length == 1) ? "Card" : "Cards"}</div>
				</div>
			</div>`);
	}
}

function InitCustomCards() {
	ExecuteWhen("PrettyCards:onPageLoad PC_Chat:getSelfInfos", function () {
		window.$("title").html("PrettyCards - Custom Cards");
		//utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@3cd3ed92fe302df05ae12aea1b6eee3b04ef5b3e/css/CustomCardSkins.css");
		window.$(".mainContent").html(`
			<div id="PrettyCards_CustomCardCategories"></div>
			<div id="PrettyCards_CustomCardShowcase"></div>
		`);
		
		if (window.allCards && window.allCards.length > 0) {
			DoStuffWhenAllCardsAreReady();
		} else {
			window.document.addEventListener("allCardsReady", function() {
				DoStuffWhenAllCardsAreReady();
			});
		}
	});
}

export {InitCustomCards};