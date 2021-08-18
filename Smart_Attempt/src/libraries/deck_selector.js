
import {SoulSelector} from "/src/libraries/soul_selector.js";

var DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";

function GetAllDecks() {
	var decks = [];
	DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";
	for (var i = 0; i < window.localStorage.length; i++){
		var key = window.localStorage.key(i);
		if (key.includes(DECK_STORAGE_PREFIX)) {
			var val = window.localStorage.getItem(key);
			
			var rest = key.substring(DECK_STORAGE_PREFIX.length, key.length);
			var rest_sliced = rest.split(".");
			
			if (rest_sliced[2] === "name") {continue;}
			
			var parsedDeck = JSON.parse(val);
			
			var deck = {
				soul : rest_sliced[0],
				id : Number(rest_sliced[1]),
				name : (window.localStorage[key + ".name"] || ("Unnamed " + rest_sliced[0] + " Deck")),
				cards : parsedDeck.cards,
				artifacts : parsedDeck.artifacts,
			}
			decks.push(deck);
		}
	}
	return decks;
}


function GetAllDecksOrganized() {
	var decks = GetAllDecks();
	var orderedDecks = {};
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

class SavedDeckSelector {
	
	constructor() {
		this.callback = function() {};
		this.closable = false;
	}
	
	GetHTML(decks) {
		var container = document.createElement("DIV");
		
		var soulContainer = document.createElement("DIV");
		soulContainer.className = "PrettyCards_DecklistSoulsContainer";
		container.appendChild(soulContainer);
		
		this.soulSelector = new SoulSelector();
		this.soulSelector.changeSoulCallback = function(clickedSoul) {
			//element.scrollIntoView({ behavior: 'smooth', block: 'center'});
		}
		this.soulSelector.highlightSelectedSoul = false;
		this.soulSelector.soulsToDisplay = [];
		for (var soul in decks) {
			this.soulSelector.soulsToDisplay.push(soul);
		}
		soulContainer.innerHTML = this.soulSelector.SetUp("PrettyCards_SavedDeckSelectSoul_", "Normal");
		
		var decksContainer = document.createElement("DIV");
		decksContainer.className = "PrettyCards_DeckListContainer";
		container.appendChild(decksContainer);
		
		for (var soul in decks) {
			var $deck = $('<div><div class="PrettyCards_DeckHeader ' + soul + '">' + soul + '</div></div>');
			
			$(decksContainer).append($deck);
		}
		
		return container;
	}
	
	OpenDialogue() {
		var decks = GetAllDecksOrganized();
		
		BootstrapDialog.show({
			title: "Select a deck!",
			size: BootstrapDialog.SIZE_WIDE,
			message: this.GetHTML(decks),
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
	}
	
}

export {SavedDeckSelector};