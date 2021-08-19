
import {SoulSelector} from "/src/libraries/soul_selector.js";
import {utility} from "/src/libraries/utility.js";
import {SetCosmeticsForCardData, SetDeckSkin} from "/src/libraries/card_cosmetics_manager.js";

var DECK_STORAGE_PREFIX = "underscript.deck." + window.selfId + ".";

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@910cbf162a7f6dd7f8913baa987d9c9754c502b9/css/SavedDeckList.css");

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
			var image_key = "prettycards.deck." + selfId + "." + rest_sliced[0] + "." + rest_sliced[1] + ".image";
			var skin = window.localStorage[image_key];
			if (skin) {
				skin = JSON.parse(skin);
			} else {
				skin = dummy_skin;
			}
			console.log(skin);
			
			var deck = {
				soul : rest_sliced[0],
				id : Number(rest_sliced[1]),
				name : (window.localStorage[key + ".name"] || ("Unnamed " + rest_sliced[0] + " Deck")),
				cards : parsedDeck.cards,
				artifacts : parsedDeck.artifacts,
				image : skin
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
		this.deckSouls = {};
		this.decks = [];
	}
	
	GetHTML(decks) {
		var container = document.createElement("DIV");
		
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
		
		this.deckSouls = {};
		for (var soul in decks) {
			var $deck = $('<div><div class="PrettyCards_DeckHeader ' + soul + '">' + soul + '</div></div>');
			
			for (var i=0; i < decks[soul].length; i++) {
				const deck = decks[soul][i];
				var card = window.appendCard(window.allCards[0], $deck);
				var cardNameDiv$ = card.find(".cardName div");
				card.find(".cardName").css("width", "160px");
				cardNameDiv$.html(deck.name);
				cardNameDiv$.addClass(soul);
				card.find(".cardDesc div").html('<span class="' + soul + '">' + deck.name + '</span>');
				card.find(".cardFrame").css("background-image", "url(https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/frame_deck.png)");
				
				SetDeckSkin(card, deck.image);
				
				cardNameDiv$.css('font-size', '');
				
				var nameSize = window.getResizedFontSize(cardNameDiv$, 25);
				cardNameDiv$.css('font-size', (nameSize + "px"));
				
				card.click(function() {
					this.callback(deck);
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