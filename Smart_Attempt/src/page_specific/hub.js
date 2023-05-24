
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {DeckEditor} from "/src/libraries/decks/deck_editor.js";
import { translationManager } from "../libraries/translation/translation_manager";

var custom_deck_sys = settings.override_decks.value();

function ReturnNormalAndShinyCards(collection_copy, id) {
	var counts = {};
	for (var i=0; i < collection_copy.length; i++) {
		var card = collection_copy[i];
		if (card.fixedId == id) {
			if (card.shiny) {
				counts.shiny = card;
			} else {
				counts.normal = card;
			}
			if (counts.normal && counts.shiny) {
				return counts;
			}
		}
	}
	return counts;
}

function SaveDeck(deckCode, name, image, username) {
	var jsonDeck = JSON.parse(atob(deckCode));
	//console.log("Save deck: ", jsonDeck, name, image, username);
	var soul = jsonDeck.soul;

	var collection_copy = window.cloneList(window.collection);
	var underscript_deck = {cards: [], artifacts: jsonDeck.artifactIds};
	for (var i=0; i < jsonDeck.cardIds.length; i++) {
		var id = jsonDeck.cardIds[i];
		var cards = ReturnNormalAndShinyCards(collection_copy, id);
		//console.log(cards);
		if (cards.shiny && cards.shiny.quantity > 0) {
			underscript_deck.cards.push({id: id, shiny: true});
			cards.shiny.quantity--;
		} else if (cards.normal && cards.normal.quantity > 0) {
			underscript_deck.cards.push({id: id});
			cards.normal.quantity--;
		}
	}
	
	if (custom_deck_sys) {
		var DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + "." + soul + ".";
		var PC_DECK_STORAGE_PREFIX = "prettycards.deck." + window.selfId + "." + soul + ".";
		var id = 0;
		while (window.localStorage.getItem(DECK_STORAGE_PREFIX + id)) {id++;}
		window.localStorage.setItem(DECK_STORAGE_PREFIX + id, JSON.stringify(underscript_deck));
		window.localStorage.setItem(DECK_STORAGE_PREFIX + id + ".name", name);
		window.localStorage.setItem(PC_DECK_STORAGE_PREFIX + id + ".description", translationManager.getWithFallback("pc-hub-deckby", "by " + username, username));
		window.localStorage.setItem(PC_DECK_STORAGE_PREFIX + id + ".image", JSON.stringify({
			id: -2,
			authorName: "",
			active: false,
			cardId: -2,
			cardName: "IMPORTED_FROM_HUB",
			image: image,
			name: "IMPORTED_FROM_HUB",
			owned: true,
			typeSkin: 0,
			ucpCost: 222,
			unavailable: false
		}));
		//console.log("DECK SAVED!");
	} else { // Custom deck system turned off option comes here!
		DeckEditor.ImportDeck({soul: soul, cards: underscript_deck.cards, artifacts: underscript_deck.artifacts}, function(status, data) {
			if (status == "success") {
				var toast = PrettyCards_plugin.toast(
					{
						title: window.$.i18n("pc-hub-upload-success")
					}
				);
			} else {
				console.log("DeckEditor.ImportDeck error!", data);
				var toast = PrettyCards_plugin.toast(
					{
						title: window.$.i18n("pc-hub-upload-error1"),
						text: window.$.i18n("pc-hub-upload-error2"),
					}
				);
			}
		})
	}
	
}

function InitHub() {
	var oldShowDeckLoadHub = window.showDeckLoadHub;
	window.showDeckLoadHub = function(deckCode, date, name, image, username) {
		oldShowDeckLoadHub(deckCode, date);
		var dial = window.Object.values(window.BootstrapDialog.dialogs)[0]; // Assumes there is only one dialogue open.
		if (!dial) {
			return;
		}
		var footer = dial.$modalFooter.find(".bootstrap-dialog-footer-buttons");
		var button = $(`<button class="btn btn-success">${window.$.i18n("pc-hub-savedeck")}</button>`);
		button.click(function () {
			SaveDeck(deckCode, name, image, username);
			this.setAttribute("disabled", true);
		})
		footer.prepend(button);
	}
	
	var oldAppendHubDeck = window.appendHubDeck;
	window.appendHubDeck = function(container, hubDeck) {
		var $html = oldAppendHubDeck(container, hubDeck);
		PrettyCards_plugin.events.emit("appendHubDeck()", {container: container, deck: hubDeck, element: $html});
		//console.log("HUB DECK: ", hubDeck);
		return $html;
	}
	PrettyCards_plugin.events.on("appendHubDeck()", function(data) {
		var hubDeck = data.deck;
		var element = data.element;
		var func = function() {
			window.showDeckLoadHub(hubDeck.code, hubDeck.date, hubDeck.name, hubDeck.image, hubDeck.owner.username);
		};
		//console.log("FUNCTION: ", func);
		element.find(".hubDeckShow .show-button")[0].onclick = func;
	})
}

export {InitHub}