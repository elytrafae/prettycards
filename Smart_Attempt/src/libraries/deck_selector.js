
import {SoulSelector} from "/src/libraries/soul_selector.js";
import {utility} from "/src/libraries/utility.js";
import {SetCosmeticsForCardData, SetDeckSkin} from "/src/libraries/card_cosmetics_manager.js";

var DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@075d5c355590cec634d029e0f58956a26b463c16/css/SavedDeckList.css");

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

function GetAllDecks() {
	var decks = [];
	DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";
	console.log("Weird debug #1", window.localStorage.length);
	for (var i = 0; i < window.localStorage.length; i++){
		var key = window.localStorage.key(i);
		if (key.includes(DECK_STORAGE_PREFIX)) {
			var val = window.localStorage.getItem(key);
			
			var rest = key.substring(DECK_STORAGE_PREFIX.length, key.length);
			var rest_sliced = rest.split(".");
			
			if (rest_sliced[2] === "name") {continue;}
			
			var parsedDeck = JSON.parse(val);
			var image_key = "prettycards.deck." + selfId + "." + rest_sliced[0] + "." + rest_sliced[1] + ".image";
			var skin = window.localStorage[image_key];
			if (skin) {
				skin = JSON.parse(skin);
			} else {
				skin = demonEasterEgg ? onu_skin : dummy_skin;
			}
			//console.log(skin);
			console.log("Key: ", key);
			var deck = {
				soul : rest_sliced[0],
				id : Number(rest_sliced[1]),
				name : (window.localStorage[key + ".name"] || ("Unnamed " + rest_sliced[0] + " Deck")),
				cards : parsedDeck.cards,
				artifacts : parsedDeck.artifacts,
				image : skin,
				key: key
			}
			console.log("deck.key", deck.key);
			decks.push(deck);
		}
	}
	return decks;
}

function appendCardDeck($parent, deck) {
	var card = window.appendCard(window.allCards[0], $parent);
	var cardNameDiv$ = card.find(".cardName div");
	card.find(".cardName").css("width", "160px");
	cardNameDiv$.html(deck.name);
	card.find(".cardName").addClass(deck.soul);
	card.find(".cardDesc div").html('<span class="' + deck.soul + '">' + deck.name + '</span>');
	card.find(".cardFrame").css("background-image", "url(https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/frame_deck.png)");
	
	SetDeckSkin(card, deck.image);
	
	cardNameDiv$.css('font-size', '');
	
	var nameSize = window.getResizedFontSize(cardNameDiv$, 25);
	cardNameDiv$.css('font-size', (nameSize + "px"));
	return card;
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
		//SWITCH: []
	};
	for (var i=0; i < decks.length; i++) {
		var deck = decks[i];
		if (!orderedDecks[deck.soul]) {
			orderedDecks[deck.soul] = [];
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
	}
	
	GetHTML(decks) {
		var container = document.createElement("DIV");
		container.className = "PrettyCards_ChooseDeckScreenContainer";
		
		var soulContainer = document.createElement("DIV");
		soulContainer.className = "PrettyCards_DecklistSoulsContainer";
		container.appendChild(soulContainer);
		
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
			var closeButton = document.createElement("BUTTON");
			closeButton.className = "btn btn-primary PrettyCards_DeckListCloseButton";
			closeButton.innerHTML = demonEasterEgg ? "LATER" : "Nevermind";
			closeButton.onclick = this.closeCallback;
			container.appendChild(closeButton);
		}
		
		this.deckSouls = {};
		for (var soul in decks) {
			var $deck = $('<div><div class="PrettyCards_DeckHeader ' + soul + '">' + soul + '</div></div>');
			
			for (var i=0; i < decks[soul].length; i++) {
				const deck = decks[soul][i];
				var card = appendCardDeck($deck, deck);
								
				if (this.canEditDecks) {
					card.append('<div class="PrettyCards_DeckCardErase">' + (demonEasterEgg ? "ERASE" : "DELETE") + '</div>');
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
			
			if (this.canEditDecks) {
				var id = GetFirstAvailableId(decks, soul);
				const newCardDeck = {
					image: demonEasterEgg ? onu_skin : dummy_skin,
					soul: soul,
					name: ("New " + soul + " Deck"),
					cards: [],
					artifacts: [],
					id: id,
					key: DECK_STORAGE_PREFIX + soul + "." + id
				}
				var newDeckCard = appendCardDeck($deck, newCardDeck);
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
		ele.appendChild(this.GetHTML(this.decks));
		this.parent = ele;
	}
	
	Reload() {
		this.parent.innerHTML = "";
		this.AppendTo(this.parent);
	}
	
	DeleteDeckDialogue(deck) {
		var title = demonEasterEgg ? "ERASE deck?" : "Delete deck?";
		var text = demonEasterEgg ? "<span class='red'>Shall we erase this pointless deck?</span>" : "Are you sure you want to delete this deck?";
		var yes_option = demonEasterEgg ? "ERASE" : "Delete";
		var no_option = demonEasterEgg ? "DO NOT." : "Cancel";
		
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
						self.Reload();
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

export {SavedDeckSelector};