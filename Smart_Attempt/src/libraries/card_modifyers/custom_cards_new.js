
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

ExecuteWhen("PrettyCards:onPageLoad", function() {
	if (underscript.onPage("CustomCards")) {
		var oldAppendCard = window.appendCard;
		window.appendCard = function(card, container) {
			var element = oldAppendCard(card, container);
			PrettyCards_plugin.events.emit("PC_appendCard", {card: card, element: element});
			return element;
		}
		
		// PrettyCards_plugin.events.on("appendCard()", function(data) { // Cannot use this because Underscript is in zombie mode on custom pages.
		PrettyCards_plugin.events.on("PC_appendCard", function(data) {
			console.log("appendCard", data);
			var card = data.card;
			var element = data.element;
			if (!card.isCustom) {
				return;
			}
			var collection = card.collection;
			
			element.addClass("ext_" + card.extension);
			
			element.find(".cardImage").css("background-image", 'url("' + collection.cardImagePrefix + card.image + '.png")');
			element.find(".cardRarity").css("background-image", 'url("' + collection.rarityImagePrefix + card.extension + '_' + card.rarity + '.png")');
			
			var tribes = element.find(".cardTribes .tribe");
			for (var i=0; i < card.tribes.length; i++) {
				var tribe_string = card.tribes[i];
				var tribe = collection.getTribeById(tribe_string);
				if (tribe) {
					//console.log("CUSTOM TRIBE!", tribe, tribes, tribes[i]);
					tribes[i].src = collection.tribeImagePrefix + tribe.image + '.png';
				}
			}
			
			if (card.background) {
				var bg = $('<div class="breakingSkinBackground"></div>');
				bg.css('background', "url('" + collection.cardImagePrefix + card.background + "') no-repeat");
				bg.css("background-size", "contain");
				bg.css("background-position", "center");
				element.prepend(bg);
			}
			
			var customFontName = (card.customFont != "") ? card.customFont : collection.universalCustomFont;
			
			if (customFontName != "") {
				console.log("customFontName", customFontName, card);
				var cardNameDiv$ = element.find('.cardName div');
				var cardDescDiv$ = element.find('.cardDesc div');
				
				cardNameDiv$.css("font-family", customFontName);
				cardDescDiv$.css("font-family", customFontName);
				
				cardNameDiv$.css('font-size', '');
				cardDescDiv$.css('font-size', '');

				//console.log(getResizedFontSize(cardNameDiv$, 25) + "px");
				var nameSize = window.getResizedFontSize(cardNameDiv$, 25);
				cardNameDiv$.css('font-size', (nameSize + "px"));
				
				var descSize = window.getResizedFontSize(cardDescDiv$, 81);
				cardDescDiv$.css('font-size', (descSize + "px"));
			}
			
		});
	}
});

export {};