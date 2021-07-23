
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

var bonusExtensions = ["DDLC", "LUNA"];
var bonusTribes = ["CHIBI", "DOKI", "CHRSPELL", "MELISSAATTACK"];
var customCardsStart = 2000;



if (settings.easter_egg_cards.value()) {

	PrettyCards_plugin.events.on("appendCard()", function(data) {
		var html$ = data.element;
		var card = data.card;
		if (card.fixedId >= customCardsStart) {
			html$.addClass("ext_" + card.extension);
			html$.find(".cardImage").css('background', "url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/" + card.extension + "/" + card.image + '.' + card.imageExtension + "') no-repeat");
			if ((card.extension !== "BASE") && (card.extension !== "DELTARUNE")) {
				html$.find('.cardRarity').css('background', 'transparent url(\'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/' + card.extension + '/' + card.rarity + '.png\') no-repeat');
			};
			var cardNameDiv$ = html$.find('.cardName div');
			var cardDescDiv$ = html$.find('.cardDesc div');

			//cardNameDiv$.css('font-size', getResizedFontSize(cardNameDiv$, 25));
			//cardDescDiv$.css('font-size', getResizedFontSize(cardDescDiv$, 81));
			var tribe_elements = html$.find(".cardTribes").children();
			for (var i=0; i < card.tribes.length; i++) {
				var tribe = card.tribes[i];
				if (bonusTribes.includes(tribe)) {
					tribe_elements[i].src = "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/" + tribe + ".png";
				}
			}
		}
	});
	
	/*
	PrettyCards_plugin.events.on('Deck:Change', function(data) {
		console.log("It worked!", data);
		for (var i=0; i < _CustomCards.length; i++) {
			window.allCards.push(_CustomCards[i]);
			if (_CustomCards[i].rarity !== "GENERATED") {
				//var shiny = utility.completeCopy(_CustomCards[i]);
				//shiny.shiny = true;
				window.collection.push(_CustomCards[i]);
				//window.collection.push(shiny);
				for (var key in window.deckCollections) {
					window.deckCollections[key].push(_CustomCards[i]);
					//window.deckCollections[key].push(shiny);
				}
			}
		}
		console.log("underscript.onPage('Decks')", underscript.onPage("Decks"));
		if (underscript.onPage("Decks")) {
			for (var key in window.deckCollections) {
			deckCollections[key].sort(function (a, b) {
				return compare(a.cost, b.cost) || $.i18n('card-name-' + a.id, 1).localeCompare($.i18n('card-name-' + b.id, 1)) || (a.shiny - b.shiny);
			 });
			console.log("Deck Collection", key, deckCollections[key]);
			}
			//refreshDeckList();
			console.log("Decks page insertion complete!");
		}
	});
	*/
	console.log("CardsLoad event added!");
}