
import {SoulSelector} from "/src/libraries/soul_selector.js";
import {utility} from "/src/libraries/utility.js";
import {SetCosmeticsForCardData, SetDeckSkin} from "/src/libraries/card_cosmetics_manager.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import {DeckEditor} from "/src/libraries/decks/deck_editor.js";
import { settings } from "../underscript_checker";

import { loadCSS } from "../../libraries/css_loader";
import css from "../../css/SavedDeckList.css";
loadCSS(css);

var DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";

var demonEasterEgg = Math.random() <= 0.022;

const dummy_skin = {
	active: true,
	authorName: "",
	cardId: 1,
	cardName: "Dummy",
	id: -1,
	image: "Dummy",
	name: "Default",
	owned: true,
	typeSkin: 0,
	ucpCost: 0,
	unavailable: false
}

const onu_skin = {
	active: true,
	authorName: "",
	cardId: -1,
	cardName: "Onutrem",
	id: -1,
	image: "Onutrem",
	name: "Default",
	owned: true,
	typeSkin: 0,
	ucpCost: 0,
	unavailable: false
}

const PLACEHOLDER_CARD_DATA = {
    "id": -22,
    "fixedId": -22,
    "typeCard": 1,
    "name": "PLACEHOLDER",
    "image": "Big_Mine",
    "baseImage": "Big_Mine",
    "cost": 0,
    "rarity": "TOKEN",
    "originalCost": 0,
    "shiny": false,
    "quantity": 1,
    "extension": "BASE",
    "tribes": [],
    "selectCards": [],
    "typeSkin": 0,
    "playedTurn": 0,
    "ownerId": 0,
    "loop": 0,
    "program": 0
}

function GetAllDecks() {
	var decks = [];
	DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";
	//console.log("Weird debug #1", window.localStorage.length);
	for (var i = 0; i < window.localStorage.length; i++){
		var key = window.localStorage.key(i);
		if (key.includes(DECK_STORAGE_PREFIX)) {
			var val = window.localStorage.getItem(key);
			
			var rest = key.substring(DECK_STORAGE_PREFIX.length, key.length);
			var rest_sliced = rest.split(".");
			
			if (rest_sliced[2] === "name") {continue;}
			
			//console.log("PROCESSING: ", key);
			var parsedDeck = JSON.parse(val);
			var image_key = "prettycards.deck." + selfId + "." + rest_sliced[0] + "." + rest_sliced[1] + ".image";
			var desc_key = "prettycards.deck." + selfId + "." + rest_sliced[0] + "." + rest_sliced[1] + ".description";
			var skin = window.localStorage[image_key];
			if (skin) {
				skin = JSON.parse(skin);
			} else {
				skin = demonEasterEgg ? onu_skin : dummy_skin;
			}
			//console.log(skin);
			//console.log("Key: ", key);
			var soul = rest_sliced[0];
			var deck = {
				soul : soul,
				id : Number(rest_sliced[1]),
				name : (window.localStorage[key + ".name"] || window.$.i18n("pc-decks-unnamed", window.$.i18n("soul-" + soul.toLowerCase())) ),
				cards : parsedDeck.cards,
				artifacts : parsedDeck.artifacts,
				image : skin,
				description: (window.localStorage[desc_key] || ""),
				key: key
			}
			//console.log("deck.key", deck.key);
			decks.push(deck);
		}
	}
	return decks;
}

function CompareDecks(baseDeck, saveDeck) {
	if (baseDeck.cards.length != saveDeck.cards.length || baseDeck.artifacts.length != saveDeck.artifacts.length) {
		return false;
	}
	
	for (var i=0; i < baseDeck.artifacts.length; i++) {
		if (!saveDeck.artifacts.includes(baseDeck.artifacts[i].id)) {
			return false;
		}
	}
	
	var baseDeckCards = [...baseDeck.cards]; // Shallow copy of array, to allow sorting without changing the order
	var saveDeckCards = [...saveDeck.cards]; // Shallow copy, avoid memory overheads and excess object creation
	baseDeckCards.sort((a, b) => a.id - b.id || a.shiny - b.shiny);
	saveDeckCards.sort(({id: aID, shiny: aShiny = false}, {id: bID, shiny: bShiny = false}) => aID - bID || aShiny - bShiny);
	for (var i=0; i < baseDeckCards.length; i++) {
		var card = baseDeckCards[i];
		var { id, shiny = false } = saveDeckCards[i];
		if (card.id !== id || card.shiny !== shiny) {
			return false;
		}
	}
	
	return true;
}

function ProcessBaseDecks(organizedDecks) {
	var baseDecks = SoulSelector.GetDecks();
	//console.log("baseDecks", baseDecks);
	for (var soul in baseDecks) {
		//console.log("Processing ", soul);
		var found = false;
		var baseDeck = baseDecks[soul];
		if (!organizedDecks[soul] || baseDeck.cards.length <= 0) {
			continue;
		}
		for (var i=0; i < organizedDecks[soul].length; i++) {
			var saveDeck = organizedDecks[soul][i];
			saveDeck.isBase = CompareDecks(baseDeck, saveDeck);
			if (saveDeck.isBase) {
				found = true;
				//console.log("Deck found!", saveDeck);
			}
		}
		if ((!found) && settings.override_decks_autogen.value()) {
			var id = GetFirstAvailableId(organizedDecks, soul);
			var cards = [];
			var artifacts = [];
			var key = DECK_STORAGE_PREFIX + soul + "." + id;
			var name = window.$.i18n("pc-decks-autogen", window.$.i18n("soul-" + soul.toLowerCase()));
			for (var i=0; i < baseDeck.cards.length; i++) {
				var card = {id: baseDeck.cards[i].id};
				if (baseDeck.cards[i].shiny) {
					card.shiny = true;
				}
				cards.push(card);
			}
			for (var i=0; i < baseDeck.artifacts.length; i++) {
				artifacts.push(baseDeck.artifacts[i].id);
			}
			window.localStorage[key] = JSON.stringify({cards: cards, artifacts: artifacts});
			window.localStorage[key + ".name"] = name;
			organizedDecks[soul].push({
				image: demonEasterEgg ? onu_skin : dummy_skin,
				soul: soul,
				name: name,
				cards: cards,
				artifacts: artifacts,
				id: id,
				key: key,
				isBase: true
			})
			
			//console.log("Autogen ", organizedDecks[soul], soul);
		}
	}
}

function GetAllDecksOrganized() {
	var decks = GetAllDecks();
	var orderedDecks = {
		DETERMINATION: [],
		BRAVERY: [],
		JUSTICE: [],
		KINDNESS: [],
		PATIENCE: [],
		INTEGRITY: [],
		PERSEVERANCE: [],
		//SWITCH: [],
		//MONSTER: [],
		//FEAR: [],
		//HATE: []
	};
	if (utility.onTestServer()) {
		orderedDecks["MONSTER"] = [];
	}
	for (var i=0; i < decks.length; i++) {
		var deck = decks[i];
		if (!orderedDecks[deck.soul]) {
			// orderedDecks[deck.soul] = []; // No more waiting for Onu to add new souls!
			console.warn("NEW DECK TYPE DISCOVERED ON CLIENT! " + deck.soul);
			continue;
		}
		orderedDecks[deck.soul].push(deck);
	}
	
	for (var soul in orderedDecks) {
		orderedDecks[soul].sort(function(a,b){
			return a.id - b.id;
		});
	}
	
	return orderedDecks;
}

function GetFirstAvailableId(decks, soul) { // MUST BE ORDERED DECK LIST!
	var decksForSoul = decks[soul];
	var i = 0;
	//var id = 0;
	while (i < decksForSoul.length && i == decksForSoul[i].id) {
		i++;
		//id++;
	}
	return i;
}

class SavedDeckSelector {
	
	constructor() {
		this.callback = function() {};
		this.closeCallback = function() {};
		this.closable = false;
		this.deckSouls = {};
		this.decks = [];
		this.canEditDecks = false;
		this.hideInvalidDecks = true;
	}
	
	IsValidDeck(deck) { // ONLY DO IT AFTER THE ARTIFACTS HAVE BEEN LOADED!
		if (deck.cards.length != 25) {
			return false;
		}
		if (deck.artifacts.length == 0 || deck.artifacts.length >= 3) {
			return false;
		}
		var art1 = artifactDisplay.GetArtifactById(deck.artifacts[0]);
		if (!art1) {
			console.log("ARTIFACT WITH ID" + deck.artifacts[0] + " NOT FOUND!");
			return false;
		}
		if (deck.artifacts.length == 1) {
			return art1.legendary;
		}
		var art2 = artifactDisplay.GetArtifactById(deck.artifacts[1]);
		if (!art2) {
			console.log("ARTIFACT WITH ID" + deck.artifacts[1] + " NOT FOUND!");
			return false;
		}
		return !art1.legendary && !art2.legendary;
	}

	SetUpButtons(buttonContainer) {
		//buttonContainer.innerHTML = "<h1>MORE BUTTONS HERE!</h1>"

		var purgeAutogenButton = document.createElement("BUTTON");
		purgeAutogenButton.className = "btn btn-danger PrettyCards_DeckListHeaderButton";
		purgeAutogenButton.innerHTML = "Purge Autogens";
		buttonContainer.appendChild(purgeAutogenButton);
		
	}
	
	GetHTML(decks) {
		var container = document.createElement("DIV");
		container.className = "PrettyCards_ChooseDeckScreenContainer";
		
		var header = document.createElement("DIV");
		header.className = "PrettyCards_DeckListHeader";
		container.appendChild(header);

		/* // Removed until . . . probably forever.
		var soulSelectToggle;
		if (this.canEditDecks) {
			soulSelectToggle = document.createElement("DIV");
			soulSelectToggle.className = "PrettyCards_SoulSelect_Soul";
			soulSelectToggle.style = "background-image: url('https://github.com/CMD-God/prettycards/raw/master/img/Souls/SOUL_SELECT.png')";
			soulSelectToggle.innerHTML = `<div class="PrettyCards_SoulSelect_Rainbow"></div>`;
			header.appendChild(soulSelectToggle);
			//PrettyCards_SoulSelect_Rainbow
		}
		*/

		var soulContainer = document.createElement("DIV");
		soulContainer.className = "PrettyCards_DecklistSoulsContainer"; //PrettyCards_DeckHeader_Active";
		header.appendChild(soulContainer);


		/* // Removed until . . . probably forever.
		if (this.canEditDecks) {
			var buttonContainer = document.createElement("DIV");
			buttonContainer.className = "PrettyCards_DecklistButtonContainer PrettyCards_Hidden"; //PrettyCards_DeckHeader_Inactive";
			header.appendChild(buttonContainer);

			this.SetUpButtons(buttonContainer);

			soulSelectToggle.onclick = function() {
				window.$(soulContainer).toggleClass("PrettyCards_Hidden");
				window.$(buttonContainer).toggleClass("PrettyCards_Hidden");
			}
			
		}
		*/
		this.soulSelector = new SoulSelector();
		this.soulSelector.changeSoulCallback = function(clickedSoul) {
			this.deckSouls[clickedSoul][0].scrollIntoView({ behavior: 'smooth', block: 'start'});
		}.bind(this);
		this.soulSelector.highlightSelectedSoul = false;
		this.soulSelector.soulsToDisplay = [];
		for (var soul in decks) {
			this.soulSelector.soulsToDisplay.push(soul);
		}
		soulContainer.innerHTML = this.soulSelector.SetUp("PrettyCards_SavedDeckSelectSoul_", "Normal");
		
		var decksContainer = document.createElement("DIV");
		decksContainer.className = "PrettyCards_DeckListContainer";
		container.appendChild(decksContainer);
		
		if (this.closable) {
			var closeButtonContainer = document.createElement("DIV");
			var closeButton = document.createElement("BUTTON");
			closeButton.className = "btn btn-primary PrettyCards_DeckListHeaderButton";
			closeButton.innerHTML = demonEasterEgg ? "<span class='red'>" + window.$.i18n("pc-navigate-later") + "</span>" : window.$.i18n("pc-navigate-nevermind");
			closeButton.onclick = this.closeCallback;
			closeButtonContainer.appendChild(closeButton);
			header.appendChild(closeButtonContainer);
		}
		
		this.deckSouls = {};
		for (var soul in decks) {
			var $deck = $('<div><div class="PrettyCards_DeckHeader ' + soul + '">' + window.$.i18n("soul-" + soul.toLowerCase()) + '</div></div>');
			
			for (var i=0; i < decks[soul].length; i++) {
				const deck = decks[soul][i];
				//console.log("DECK HIDING: ", deck, !this.IsValidDeck(deck));
				if (!this.hideInvalidDecks || this.IsValidDeck(deck)) {
					var card = this.appendCardDeck($deck, deck);
									
					if (this.canEditDecks) {
						card.append('<div class="PrettyCards_DeckCardErase">' + (demonEasterEgg ? window.$.i18n("pc-decks-delete-mystery") : window.$.i18n("pc-decks-delete")) + '</div>');
						card.find(".PrettyCards_DeckCardErase").click(function(e) {
							this.DeleteDeckDialogue(deck);
							e.stopPropagation();
						}.bind(this));
						card.find(".cardFooter").css("display", "none");
					}
					
					card.click(function() {
						this.callback(deck);
					}.bind(this));
				}
			}
			
			if (this.canEditDecks) {
				var id = GetFirstAvailableId(decks, soul);
				const newCardDeck = {
					image: demonEasterEgg ? onu_skin : dummy_skin,
					soul: soul,
					name: window.$.i18n("pc-decks-new", window.$.i18n("soul-" + soul.toLowerCase())),
					description: "",
					cards: [],
					artifacts: [],
					id: id,
					key: DECK_STORAGE_PREFIX + soul + "." + id
				}
				var newDeckCard = this.appendCardDeck($deck, newCardDeck);
				newDeckCard.click(function() {
					this.callback(newCardDeck);
				}.bind(this));
			}
			
			this.deckSouls[soul] = $deck;
			$(decksContainer).append($deck);
		}
		
		return container;
	}
	
	AppendTo(ele) {
		this.decks = GetAllDecksOrganized();
		ProcessBaseDecks(this.decks);
		var html = this.GetHTML(this.decks)
		ele.appendChild(html);
		this.parent = ele;
		return html;
	}
	
	Reload() {
		this.parent.innerHTML = "";
		this.AppendTo(this.parent);
	}
	
	DeleteDeckDialogue(deck) {
		var title = demonEasterEgg ? window.$.i18n("pc-decks-askdelete-title-mystery") : window.$.i18n("pc-decks-askdelete-title");
		var text = demonEasterEgg ? `<span class='red'>${window.$.i18n("pc-decks-askdelete-text-mystery")}</span>` : window.$.i18n("pc-decks-askdelete-text");
		var yes_option = demonEasterEgg ? window.$.i18n("pc-decks-askdelete-yes-mystery") : window.$.i18n("pc-decks-askdelete-yes");
		var no_option = demonEasterEgg ? window.$.i18n("pc-decks-askdelete-no-mystery") : window.$.i18n("pc-decks-askdelete-no");
		
		const self = this;
		BootstrapDialog.show({
			title: title,
			message: text,
			buttons: [
				{
					label: no_option,
					cssClass: 'btn-primary us-normal',
					action(dialog) {
						dialog.close();
					}
				},
				{
					label: yes_option,
					cssClass: 'btn-danger us-normal',
					action(dialog) {
						self.DeleteDeck(deck);
						dialog.close();
					}
				}
			]
		});
	}

	DeleteDeck(deck) {
		window.localStorage.removeItem(deck.key);
		window.localStorage.removeItem(deck.key + ".name");
		window.localStorage.removeItem("prettycards.deck." + selfId + "." + deck.soul + "." + deck.id + ".image");
		window.localStorage.removeItem("prettycards.deck." + selfId + "." + deck.soul + "." + deck.id + ".description");
		if (deck.isBase) {
			DeckEditor.RemoveEverything(deck.soul, function () {
				SoulSelector.GetDecks()[deck.soul] = {cards: [], artifacts: []};
				this.Reload();
			}.bind(this));
		} else {
			//cb();
			this.Reload();
		}
	}
	
	appendCardDeck($parent, deck, ignoreBase) {
		var card = window.appendCard(PLACEHOLDER_CARD_DATA, $parent);
		card.addClass("PrettyCards_DeckCard");
		var cardNameDiv$ = card.find(".cardName div");
		card.find(".cardName").css("width", "160px");
		cardNameDiv$.html(deck.name);
		card.find(".cardName").addClass(deck.soul);
		card.find(".cardDesc div").html('<span class="' + deck.soul + '">' + (deck.description || "").replaceAll("\n", "<br>") + '</span>' + ( (!ignoreBase && deck.isBase) ? '<p style="color:grey; margin:0px;">(Loaded)</p>' : '') );
		card.find(".cardFrame").css("background-image", "url(" + ( (!ignoreBase && deck.isBase) ? "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/frame_deck_gold.png" : "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/frame_deck.png") + ")" );
		
		SetDeckSkin(card, deck.image);
		
		cardNameDiv$.css('font-size', '');
		
		var nameSize = window.getResizedFontSize(cardNameDiv$, 25);
		cardNameDiv$.css('font-size', (nameSize + "px"));
		
		if (!ignoreBase && deck.isBase) {
			card.addClass("PrettyCards_BaseDeckCard");
		}
		
		return card;
	}
	
	getDeckBySoulAndId(soul, id) {
		this.decks = GetAllDecksOrganized();
		var soulDecks = this.decks[soul];
		if (!soulDecks) {
			return null;
		}
		for (var i=0; i < soulDecks.length; i++) {
			var deck = soulDecks[i];
			if (deck.id === id) {
				return deck;
			}
		}
		return null;
	} 
	
	/*
	OpenDialogue() {
		this.decks = GetAllDecksOrganized();
		
		this.dial = BootstrapDialog.show({
			title: "Select a deck!",
			size: BootstrapDialog.SIZE_WIDE,
			message: this.GetHTML(this.decks),
			closable: this.closable,
			buttons: [{
					label: "Nevermind!",
					cssClass: 'btn-primary us-normal',
					action(dialog) {
						dialog.close();
					}
				}
			]
		});
		this.dial.enableButtons(this.closable);
	}*/
	
}

export {SavedDeckSelector, dummy_skin, onu_skin, GetAllDecks};
