

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";
import {CustomCardsDictionary} from "/src/libraries/card_modifyers/custom_cards_dictionary.js";
import {SetUpFilters} from "/src/libraries/card_modifyers/custom_card_filters.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

//import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_ddlc.js";
//import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_ddlc_v2.js";
//import {} from "/src/libraries/card_modifyers/custom_cards/custom_cards_switch.js";

var $ = window.$;

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@812c80b65096d967ff9dd3da22b60e0c828c250a/css/CustomCards.css");

if (settings.easter_egg_cards.value()) {

	PrettyCards_plugin.events.on("appendCard()", function(data) {
		var html$ = data.element;
		var card = data.card;
		if (card.fixedId >= CustomCardsDictionary.customCardsStart) {
			html$.addClass("ext_" + card.extension);
			
			var imageURL = card.imageURL;
			var rarityURL = card.rarityURL;
			var backgroundURL = card.backgroundURL;
			
			html$.find(".cardImage").css('background', "url('" + imageURL + "') no-repeat");
			html$.find('.cardRarity').css('background', "transparent url('" + rarityURL + "') no-repeat");
				
			if (card.background) {
				var bg = $('<div class="breakingSkinBackground"></div>');
				bg.css('background', "url('" + backgroundURL + "') no-repeat");
				bg.css("background-size", "contain");
				bg.css("background-position", "center");
				html$.prepend(bg);
			}
			
			var cardNameDiv$ = html$.find('.cardName div');
			var cardDescDiv$ = html$.find('.cardDesc div');
			
			if (card.extension === "DDLC") {
				cardNameDiv$.css("font-family", "Aller");
				cardDescDiv$.css("font-family", "Aller");
			}
			
			cardNameDiv$.css('font-size', '');
			cardDescDiv$.css('font-size', '');

			//console.log(getResizedFontSize(cardNameDiv$, 25) + "px");
			var nameSize = window.getResizedFontSize(cardNameDiv$, 25);
			cardNameDiv$.css('font-size', (nameSize + "px"));
			
			var descSize = window.getResizedFontSize(cardDescDiv$, 81);
			cardDescDiv$.css('font-size', (descSize + "px"));
			
			var tribe_elements = html$.find(".cardTribes").children();
			for (var i=0; i < card.tribes.length; i++) {
				var tribe = card.tribes[i];
				for (var j=0; j < CustomCardsDictionary.customTribes.length; j++) {
					var tribeData = CustomCardsDictionary.customTribes[j];
					if (tribeData.id === tribe) {
						tribe_elements[i].src = tribeData.icon;
					}
				}
			}
		}
	});
	
	function AddAllCards() {
		for (var i=0; i < CustomCardsDictionary.customCards.length; i++) {
			var card = CustomCardsDictionary.customCards[i];
			window.allCards.push(card);
		}
	}
	
	function AddCollection() {
		
		var isDecks = underscript.onPage("Decks");
		for (var i=0; i < CustomCardsDictionary.customCards.length; i++) {
			var card = CustomCardsDictionary.customCards[i];
			if (card.rarity !== "TOKEN" || !isDecks) {
				//console.log(card);
				var shiny = utility.completeCopy(card);
				shiny.shiny = true;
				window.collection.push(card);
				window.collection.push(shiny);
				if (isDecks) {
					for (var key in window.deckCollections) {
						window.deckCollections[key].push(card);
						window.deckCollections[key].push(shiny);
					}
				}
			}
		}
		
		if (isDecks) {
			for (var key in window.deckCollections) {
				window.deckCollections[key].sort(function (a, b) {
					return compare(a.cost, b.cost) || $.i18n('card-name-' + a.id, 1).localeCompare($.i18n('card-name-' + b.id, 1)) || (a.shiny - b.shiny);
				});
				//console.log("Deck Collection", key, deckCollections[key]);
			}
		}
		
		/*
		window.collection.sort(function (a, b) {
			return compare(a.cost, b.cost) || $.i18n('card-name-' + a.id, 1).localeCompare($.i18n('card-name-' + b.id, 1)) || (a.shiny - b.shiny);
		});*/
		
		setTimeout(applyFilters, 100);
	}
	
	PrettyCards_plugin.events.on('Deck:Loaded Craft:Loaded', function(data) {
		AddCollection();
	});
	
	if (!window.allCards || window.allCards.length == 0) {
		window.document.addEventListener("allCardsReady", function() {
			AddAllCards();
		});
	} else {
		AddAllCards();
	}

	
	if (underscript.onPage("Decks") || underscript.onPage("Crafting")) {
		SetUpFilters();
	}
	
	
	ExecuteWhen("PrettyCards:onLoad", function() {
		var allerLoader = window.$('<span style="font-family: Aller;">Aller Loader!</span>');
		//console.log("Aller Loader!", allerLoader);
		window.$("body").append(allerLoader);
		setTimeout(function() {allerLoader.remove()}, 100);
	});
	
}