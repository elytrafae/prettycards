
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {collections} from "/src/libraries/card_modifyers/custom_cards_dictionary_new.js";

function OpenAuthorNote(card) {
	window.BootstrapDialog.show({
		title: "Author's Note",
		message: window.$.i18n(card.note),
		//onshow: this.OnShow
		buttons: [
			{
				label: window.$.i18n("dialog-ok"),
				cssClass: 'btn-primary',
				action: function(dialog) {
					dialog.close();
				}
			}
		]
	});
}

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
			//console.log("appendCard", data);
			var card = data.card;
			var element = data.element;
			if (!card.isCustom) {
				return;
			}
			var collection = card.collection;
			if (typeof(collection) == "number") {
				collection = collections[collection];
				card.collection = collection;
			}
			
			element.addClass("ext_" + card.extension);

			var isAprilFools = utility.getSeasonMonth() == 3 && card.aprilImage;
			var prefix = isAprilFools ? collection.aprilCardImagePrefix : collection.cardImagePrefix;
			var imageName = isAprilFools ? card.aprilImage : card.image;

			var image = utility.constructURL(prefix, imageName, "png", collection.oldPrefixBehavior);
			
			element.find(".cardImage").css("background-image", 'url("' + image + '")');
			element.find(".cardRarity").css("background-image", 'url("' + utility.constructURL(collection.rarityImagePrefix, card.extension + '_' + card.rarity, "png", collection.oldPrefixBehavior) + '")');
			
			var tribes = element.find(".cardTribes .tribe");
			for (var i=0; i < card.tribes.length; i++) {
				var tribe_string = card.tribes[i];
				var tribe = collection.getTribeById(tribe_string);
				if (tribe) {
					//console.log("CUSTOM TRIBE!", tribe, tribes, tribes[i]);
					tribes[i].src = utility.constructURL(collection.tribeImagePrefix, tribe.image, "png", collection.oldPrefixBehavior);
				}
			}
			
			if (card.background) {
				var bg = $('<div class="breakingSkinBackground"></div>');
				var isAprilFools = utility.getSeasonMonth() == 3 && card.aprilBackground;
				var prefix = isAprilFools ? collection.aprilCardImagePrefix : collection.cardImagePrefix;
				var imageName = isAprilFools ? card.aprilBackground : card.background;
				var b_image = utility.constructURL(prefix, imageName, "png", collection.oldPrefixBehavior);
				bg.css('background', "url('" + b_image + "') no-repeat");
				bg.css("background-size", "contain");
				bg.css("background-position", "center");
				element.prepend(bg);
			}
			
			var customFontName = (card.customFont != "") ? card.customFont : collection.universalCustomFont;
			
			if (customFontName != "" && customFontName != "DTM-Mono") {
				//console.log("customFontName", customFontName, card);
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
			
			if (card.note && card.note.length > 0) {
				var noteIcon = window.$('<img src="https://github.com/CMD-God/prettycards/raw/master/img/CardPowers/note.png" class="infoPowers helpPointer" style="top: 66px;right: 138px;"></img>');
				noteIcon.contextmenu(function() {
					OpenAuthorNote(card);
				});
				element.find(".cardStatus").append(noteIcon);
			}
			
			//card.onRender(data); // Removing this system because clones do not mix well with this.
			
		});
	}
});

export {};