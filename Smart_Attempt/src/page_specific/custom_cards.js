
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {} from "/src/libraries/card_modifyers/custom_cards_new.js";

import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new.js";
import {LoadFont, ListenForWhenAllFontsAreLoaded} from "/src/libraries/font_loader.js";

import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_ddlc_v2.js";

function appendArtifact(artifact, c, $parent) {
	var art = $(`<img class="PrettyCards_Artifact" src="${c.artifactImagePrefix + artifact.image + ".png"}">`);
	art.click(function () {
		window.artifactInfo(artifact.id);
	})
	$parent.append(art);
	return art;
}

function appendSoul(soul, c, $parent) {
	var s = $(`<img class="PrettyCards_Soul" src="${c.soulImagePrefix + soul.image + ".png"}">`);
	s.click(function () {
		window.soulInfo(soul.name);
	})
	$parent.append(s);
	return s;
}

function ViewCollection(c) {
	console.log("VIEW COLLECTION!", c);
	var showcase = $("#PrettyCards_CustomCardShowcase");
	$("#PrettyCards_CustomCardCategories").css("display", "none");
	showcase.css("display", "block").html("");
	
	var header = $(`
		<div class="PrettyCards_CollectionBackButton"><span class="glyphicon glyphicon-arrow-left"></span> Back to Collection Select Screen</div>
		<div class="PrettyCards_BigCollectionName">${c.name}</div>
		<div class="PrettyCards_BigCollectionAuthor Artist">${c.author}</div>
		<div>${c.note}</div>
	`);
	
	header[0].onclick = ViewCollectionSelectScreen;
	
	showcase.append(header);
	
	if (c.souls.length > 0) {
		showcase.append(`<h2>Souls</h2>`);
		var souls = $(`<div id="PrettyCards_SoulsShowcase"></div>`);
		for (var i=0; i < c.souls.length; i++) {
			appendSoul(c.souls[i], c, souls);
		}
		showcase.append(souls);
	}
	
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

function ViewCollectionSelectScreen() {
	$("#PrettyCards_CustomCardCategories").css("display", "block");
	$("#PrettyCards_CustomCardShowcase").css("display", "none");
}

function SetUpCollectionSelectionPage() {
	var cont = $("#PrettyCards_CustomCardCategories");
	cont.html("");
	for (var i=0; i < collections.length; i++) {
		const c = collections[i];
		var collection = $(`
			<div class="PrettyCards_CardCollection">
				<div class="PrettyCards_CollectionName">${c.name}</div>
				<div class="PrettyCards_CollectionAuthor Artist">${c.author}</div>
				<div class="PrettyCards_CollectionDetails">
					<div>${c.souls.length} ${(c.souls.length == 1) ? "Soul" : "Souls"}</div>
					<div>${c.artifacts.length} ${(c.artifacts.length == 1) ? "Artifact" : "Artifacts"}</div>
					<div>${c.cards.length} ${(c.cards.length == 1) ? "Card" : "Cards"}</div>
				</div>
			</div>`);
		collection.click(function() {
			ViewCollection(c);
		})
		cont.append(collection);
	}
}

function DoStuffWhenAllCardsAreReady() {
	$("#PrettyCards_CustomCardCategories").html("Loading Custom Cards . . .");
	PrettyCards_plugin.events.emit("PrettyCards:customCards");
	console.log(collections);
	$("#PrettyCards_CustomCardCategories").html("Loading Custom Fonts . . .");
	ListenForWhenAllFontsAreLoaded(SetUpCollectionSelectionPage);
}

function InitCustomCards() {
	ExecuteWhen("PrettyCards:onPageLoad PC_Chat:getSelfInfos PrettyCards:onArtifacts", function () {
		window.$("title").html("PrettyCards - Custom Cards");
		// utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@cb746b2fbb5d5acf1d837a26dc477abcb7a74e00/css/CustomCards.css"); // Moved to "Fancy Helper" because this needs to be loaded at all times
		window.$(".mainContent").html(`
			<div id="PrettyCards_CustomCardCategories">Loading All Cards . . .</div>
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