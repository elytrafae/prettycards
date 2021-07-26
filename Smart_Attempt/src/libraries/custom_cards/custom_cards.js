

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";
import {CustomCardsDictionary} from "/src/libraries/custom_cards/custom_cards_dictionary.js";
import {SetUpFilters} from "/src/libraries/custom_cards/custom_card_filters.js"

import {} from "/src/libraries/custom_cards/custom_cards_ddlc.js"

var bonusExtensions = ["DDLC", "LUNA"];
var bonusTribes = ["CHIBI", "DOKI", "CHRSPELL", "MELISSAATTACK"];

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@a1ff9abe8c10f03bb1530d8a1076bee0eadeb3d5/css/CustomCards.css");

function test_getResizedFontSize(container, maxHeight) {
	console.log("Start: ", container);
    var fontSize = 12;
    var max = 10;
    var i = 0;
    var $clonedContainer = container.parent().clone();
    $clonedContainer.appendTo('body');
    $clonedContainer.css('font-size', fontSize + 'px');
    var $clonedContainerDiv = $clonedContainer.find('div');
	console.log("Before While: ", fontSize, i, $clonedContainerDiv.outerHeight());
    while ($clonedContainerDiv.outerHeight() >= maxHeight && i < max) {
        fontSize = fontSize - 0.5;
        $clonedContainer.css('font-size', fontSize + 'px');
        i++;
		console.log("While: ", fontSize, i, $clonedContainerDiv.outerHeight());
    }
    $clonedContainer.remove();
	console.log("Return", fontSize);
    return fontSize;
}

if (settings.easter_egg_cards.value()) {

	PrettyCards_plugin.events.on("appendCard()", function(data) {
		var html$ = data.element;
		var card = data.card;
		if (card.fixedId >= CustomCardsDictionary.customCardsStart) {
			html$.addClass("ext_" + card.extension);
			//if (card.extension == "DDLC") {
			//	html$.find().css("font-family", "Aller");
			//}
			
			html$.find(".cardImage").css('background', "url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/" + card.extension + "/" + card.image + ".png') no-repeat");
			if ((card.extension !== "BASE") && (card.extension !== "DELTARUNE")) {
				html$.find('.cardRarity').css('background', 'transparent url(\'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/' + card.extension + '/' + card.rarity + '.png\') no-repeat');
			};
			
			if (card.background) {
				var bg = $('<div class="breakingSkinBackground"></div>');
				bg.css("background", "url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/" + card.extension + "/" + card.background + ".png') no-repeat");
				bg.css("background-size", "contain");
				bg.css("background-position", "center");
				html$.prepend(bg);
			}
			
			/*
			var cardNameDiv$ = html$.find('.cardName div');
			var cardDescDiv$ = html$.find('.cardDesc div');
			
			cardNameDiv$.css("font-family", "Aller");
			cardDescDiv$.css("font-family", "Aller");

			//console.log(getResizedFontSize(cardNameDiv$, 25) + "px");
			console.log("Name Resize Start ", card.name);
			var nameSize = test_getResizedFontSize(cardNameDiv$, 25);
			cardNameDiv$.css('font-size', (nameSize + "px"));
			console.log("cardNameDiv font-size", nameSize + "px");
			
			console.log("Description Resize Start ", card.name);
			var descSize = test_getResizedFontSize(cardDescDiv$, 81);
			cardDescDiv$.css('font-size', (descSize + "px"));
			console.log("cardDescDiv font-size", descSize + "px");
			*/
			var tribe_elements = html$.find(".cardTribes").children();
			for (var i=0; i < card.tribes.length; i++) {
				var tribe = card.tribes[i];
				if (bonusTribes.includes(tribe)) {
					tribe_elements[i].src = "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/" + tribe + ".png";
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
				console.log(card);
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
		
		window.collection.sort(function (a, b) {
			return compare(a.cost, b.cost) || $.i18n('card-name-' + a.id, 1).localeCompare($.i18n('card-name-' + b.id, 1)) || (a.shiny - b.shiny);
		});
		
		setTimeout(applyFilters, 100);
	}
	
	PrettyCards_plugin.events.on('Deck:Loaded Craft:Loaded', function(data) {
		AddCollection();
	});
	
	window.document.addEventListener("allCardsReady", function() {
		AddAllCards();
	});
	
	if (underscript.onPage("Decks") || underscript.onPage("Crafting")) {
		SetUpFilters();
	}
	
	var allerLoader = window.$('<span style="font-family: Aller;">Aller Loader!</span>');
	console.log("Aller Loader!", allerLoader);
	window.$("body").append(allerLoader); 
	
}