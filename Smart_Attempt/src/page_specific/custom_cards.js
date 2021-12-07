
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {} from "/src/libraries/card_modifyers/custom_cards_new.js";

import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new.js";

import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_ddlc_v2.js";

function appendArtifact(artifact, c, $parent) {
	var art = $(`<img class="PrettyCards_Artifact" src="${c.artifactImagePrefix + artifact.image + ".png"}">`);
	art.click(function () {
		window.artifactInfo(artifact.id);
	})
	$parent.append(art);
	return art;
}

function ViewCollection(c) {
	console.log("VIEW COLLECTION!", c);
	var showcase = $("#PrettyCards_CustomCardShowcase");
	$("#PrettyCards_CustomCardCategories").css("display", "none");
	showcase.css("display", "block").html("");
	
	var header = $(`
		<div class="PrettyCards_BigCollectionName">${c.name}</div>
		<div class="PrettyCards_BigCollectionAuthor Artist">${c.author}</div>
	`);
	
	showcase.append(header);
	
	// Insert Soul Section Here!
	
	if (c.artifacts.length > 0) {
		showcase.append(`<h2>Artifacts</h2>`);
		var arts = $(`<div id="PrettyCards_ArtifactsShowcase"></div>`);
		for (var i=0; i < c.artifacts.length; i++) {
			appendArtifact(c.artifacts[i], c, arts);
		}
		showcase.append(arts);
	}
	
	if (c.cards.length > 0) {
		showcase.append(`<h2>Cards</h2>`);
		var cards = $(`<div id="PrettyCards_CardsShowcase"></div>`);
		for (var i=0; i < c.cards.length; i++) {
			window.appendCard(c.cards[i], cards);
		}
		showcase.append(cards);
	}
	
}

function DoStuffWhenAllCardsAreReady() {
	PrettyCards_plugin.events.emit("PrettyCards:customCards");
	console.log(collections);
	var cont = $("#PrettyCards_CustomCardCategories");
	for (var i=0; i < collections.length; i++) {
		const c = collections[i];
		var collection = $(`
			<div class="PrettyCards_CardCollection">
				<div class="PrettyCards_CollectionName">${c.name}</div>
				<div class="PrettyCards_CollectionAuthor Artist">${c.author}</div>
				<div class="PrettyCards_CollectionDetails">
					<div>${c.cards.length} ${(c.cards.length == 1) ? "Card" : "Cards"}</div>
				</div>
			</div>`);
		collection.click(function() {
			ViewCollection(c);
		})
		cont.append(collection);
	}
}

function InitCustomCards() {
	ExecuteWhen("PrettyCards:onPageLoad PC_Chat:getSelfInfos", function () {
		window.$("title").html("PrettyCards - Custom Cards");
		utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@fb85f11759aca506ceea21d7e4168fec82a054f9/css/CustomCards.css");
		window.$(".mainContent").html(`
			<div id="PrettyCards_CustomCardCategories"></div>
			<div id="PrettyCards_CustomCardShowcase"></div>
		`);
		
		$("#PrettyCards_CustomCardShowcase").css("display", "none");
		
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