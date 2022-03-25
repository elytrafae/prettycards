
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {} from "/src/libraries/card_modifyers/custom_cards_new.js";

import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new.js";
import {LoadFont, ListenForWhenAllFontsAreLoaded} from "/src/libraries/font_loader.js";

import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_ddlc_v2.js";
import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_switch.js";
import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_hate.js";

import {html2canvas} from "/src/third_party/html2canvas.min.js";

function appendArtifact(artifact, c, $parent) {
	var art = $(`<img class="PrettyCards_Artifact PrettyCards_Artifact_${artifact.rarity}" src="${c.artifactImagePrefix + artifact.image + ".png"}">`);
	art.click(function () {
		window.artifactInfo(artifact.id);
	})
	$parent.append(art);
	return art;
}

function appendArtifactNew(artifact, c, $parent) {
	var art = $(`
	<div class="PrettyCards_CollectionNew_Soultifact">
		<img class="PrettyCards_CollectionNew_SoultifactImage PrettyCards_Artifact_${artifact.rarity}" src="${c.artifactImagePrefix + artifact.image + ".png"}">
		<div>
			<div class="${artifact.rarity} PrettyCards_CollectionNew_SoultifactName">${window.$.i18n("artifact-name-" + artifact.id)}</div>
			<div class="${artifact.rarity} PrettyCards_CollectionNew_SoultifactRarity">${window.$.i18n(artifact.rarity)} Artifact</div>
			<div>${window.$.i18n("artifact-" + artifact.id)}</div>
		</div>
	<div>`);
	art.find("PrettyCards_CollectionNew_SoultifactImage").click(function () {
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
	//console.log("VIEW COLLECTION!", c);
	var showcase = $("#PrettyCards_CustomCardShowcase");
	$("#PrettyCards_CustomCardCategories").css("display", "none");
	showcase.css("display", "block").html("");
	
	var header = $(`
		<div id="PrettyCards_CollectionHeaderTop">
			<div class="PrettyCards_CollectionBackButton"><span class="glyphicon glyphicon-arrow-left"></span> Back to Collection Select Screen</div>
			<button id="PrettyCards_CollectionViewButton" class="btn btn-primary">Toggle View</button>
		</div>
		<div class="PrettyCards_BigCollectionName">${c.name}</div>
		<div class="PrettyCards_BigCollectionAuthor Artist">${c.author}</div>
		<div>${c.note}</div>
	`);

	header.find("#PrettyCards_CollectionViewButton").click(function(e) {
		console.log("SWAPPING VIEWS!");
		$("#PrettyCards_SoulsShowcase").toggleClass("PrettyCards_Hidden");
		$("#PrettyCards_NewSoulsShowcase").toggleClass("PrettyCards_Hidden");
		$("#PrettyCards_ArtifactsShowcase").toggleClass("PrettyCards_Hidden");
		$("#PrettyCards_NewArtifactsShowcase").toggleClass("PrettyCards_Hidden");
		e.stopPropagation();
	});
	
	header.find(".PrettyCards_CollectionBackButton").click(ViewCollectionSelectScreen);
	
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
		
		var arts2 = $(`<div id="PrettyCards_NewArtifactsShowcase" class="PrettyCards_Hidden"></div>`);
		for (var i=0; i < c.artifacts.length; i++) {
			appendArtifactNew(c.artifacts[i], c, arts2);
		}
		showcase.append(arts2);
	}
	
	if (c.cards.length > 0) {
		showcase.append(`<h2>Cards</h2>`);
		var cards = $(`<div id="PrettyCards_CardsShowcase"></div>`);
		for (var i=0; i < c.cards.length; i++) {
			window.appendCard(c.cards[i], cards);
		}
		showcase.append(cards);
	}

	if ($('#collectionCustomCSS').length <= 0) {
		$("head").append('<style id="collectionCustomCSS"></style>');
	}
	c.reloadFrames();

	/*
	html2canvas(showcase[0]).then((canvas) => {
		const base64image = canvas.toDataURL("image/png");
		window.location.href = base64image;
	});
	*/
	
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
	console.log("ENTERED THING!");
	PrettyCards_plugin.events.on(":GuestMode", function() {
		console.log("I AM GUEST!");
		window.location.href = "/SignIn";
	});
	ExecuteWhen("PrettyCards:onPageLoad PrettyCards:onArtifacts", function () {
		console.log("SHIT HAPPENED!");
		window.$("title").html("PrettyCards - Custom Cards");
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