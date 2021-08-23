
import {CardSkinSelector} from "/src/libraries/card_skin_selector.js";
import {SavedDeckSelector} from "/src/libraries/deck_selector.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {SoulSelector} from "/src/libraries/soul_selector.js";

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var deckSelector = new SavedDeckSelector();
var skinSelector = new CardSkinSelector();
var deckName = document.createElement("INPUT");
var changeDeckImage = document.createElement("BUTTON");
var changeDeckScreen = document.createElement("DIV");
var currentDeck = null;

var deckEditPage = document.querySelector(".mainContent > table");

function ChangeDeckScreen() {
	deckSelector.callback = function(deck) {
		ChangeDeck(deck);
		CloseDeckScreen();
	}.bind(this);
	deckSelector.closeCallback = CloseDeckScreen.bind(this);
	changeDeckScreen.innerHTML = "";
	deckSelector.closable = true;
	deckSelector.AppendTo(changeDeckScreen);
	//deckSelector.OpenDialogue();
	changeDeckScreen.style.display = "initial";
	deckEditPage.style.display = "none";
}

function ChangeDeck(deck) {
	currentDeck = deck;
	console.log("Changing deck to", deck);
	LoadDeck(deck);
}

function CloseDeckScreen() {
	changeDeckScreen.style.display = "none";
	deckEditPage.style.display = "initial";
}

function ChangeDeckImageDialogue() {
	skinSelector.callback = function(skin) {
		ChangeDeckImage(skin);
		skinSelector.dial.close();
	}
	skinSelector.OpenDialogue();
}

function ChangeDeckImage(skin) {
	console.log(skin);
	changeDeckImage.style.backgroundImage = "url(/images/cards/" + skin.image + ".png)";
	var key = "prettycards.deck." + selfId + "." + currentDeck.soul + "." + currentDeck.id + ".image";
	window.localStorage[key] = JSON.stringify(skin);
}

function ChangeDeckName() {
	var nameValue = $(deckName).val();
	var key = currentDeck.key + ".name";
	window.localStorage[key] = nameValue;
}

const maxDupesPerRarity = {
	BASE: 3,
	COMMON: 3,
	RARE: 3,
	EPIC: 2,
	LEGENDARY: 1,
	DETERMINATION: 1,
	TOKEN: 0
}

function findInCollection(collection, idCard, shiny) {
	for (var i=0; i < collection.length; i++) {
		var _card = collection[i];
		if (_card.id == idCard && _card.shiny == shiny) {
			return _card;
		}
	}
	return null;
}

function canCardBeAdded(card, deck) {
	if (!card || card.quantity <= 0 || deck.length >= 25) {
		return false;
	}
	var nrInDeck = 0;
	for (var i=0; i < deck.length; i++) {
		var _card = deck[i];
		if (card.id == _card.id) {
			nrInDeck++;
		}
	}
	if (nrInDeck >= maxDupesPerRarity[card.rarity]) {
		return false;
	}
	return true;
}

function addCardSilent(idCard, shiny, dontUpdateDeck) {
	var deckSoul = window.soul;
	var card = findInCollection(window.deckCollections[deckSoul], idCard, shiny);
	if (!canCardBeAdded(card, window.decks[window.soul])) {
		return;
	}
	updateQuantity(deckSoul, card, -1);
	addDeckCardSlot(deckSoul, card);
	refreshDeckList();
	applyFilters();
	showPage(currentPage);
	if (!dontUpdateDeck) {
		SaveDeck();
	}
}

function removeCardSilent(idCard, shiny) {
	var card = findInCollection(window.deckCollections[window.soul], idCard, shiny);
	var deckSoul = window.soul;
	updateQuantity(deckSoul, card, 1);
	removeDeckCardSlot(deckSoul, card);
	refreshDeckList();
	applyFilters();
	showPage(currentPage);
	removeCardHover();
	if (!dontUpdateDeck) {
		SaveDeck();
	}
}

function addArtifactSilent(idArtifact, dontUpdateDeck) {
	var artifact = null;
	for (var i=0; i < window.userArtifacts.length; i++) {
		var _artifact = window.userArtifacts[i];
		if (_artifact.id == idArtifact) {
			artifact = _artifact;
		}
	}
	var addedSoul = window.soul;
	decksArtifacts[addedSoul].push(artifact);
	updateArtifactSlots();
	if (lastOpenedDialog !== null) {
		lastOpenedDialog.close();
	}
	checkCompletion();
	if (!dontUpdateDeck) {
		SaveDeck();
	}
}

function clearArtifactsSilent() {
	var clearedSoul = window.soul;
	decksArtifacts[clearedSoul] = [];
	updateArtifactSlots();
	checkCompletion();
	if (!dontUpdateDeck) {
		SaveDeck();
	}
}

function removeAllCardsSilent(dontUpdateDeck) {
	$('#deckCards' + window.soul).empty();
	$('#nbCardDeck' + window.soul).html(0);
	for (var i=0; i < window.decks[window.soul].length; i++) {
		var card = window.decks[window.soul][i];
		updateQuantity(window.soul, card, 1);
	}
	decks[window.soul] = [];
	decksArtifacts[window.soul] = [];
	updateArtifactSlots();
	checkCompletion();
	refreshDeckList();
	applyFilters();
	showPage(currentPage);
	canClearCards = true;
	if (!dontUpdateDeck) {
		SaveDeck();
	}
}

function SilenceDeckFunctions() {
	//var oldAddCard = window.addCard;
	window.addCard = addCardSilent;
	
	//var oldRemoveCard = window.removeCard;
	window.removeCard = removeCardSilent;
	
	window.removeAllCards = removeAllCardsSilent;
	
	window.addArtifact = addArtifactSilent;
	
	window.clearArtifacts = clearArtifactsSilent;
}

function LoadDeck(deck) {
	window.soul = deck.soul;
	updateSoul();
	removeAllCardsSilent(true);
	for (var i=0; i < deck.cards.length; i++) {
		var card = deck.cards[i];
		//addCardSilent(card.id, !(!card.shiny), true);
		var card = findInCollection(window.deckCollections[window.soul], card.id, !(!card.shiny));
		if (canCardBeAdded(card, window.decks[window.soul])) {
			window.decks[window.soul].push(card);
			updateQuantity(window.soul, card, -1);
		}
	}
	for (var i=0; i < deck.artifacts.length; i++) {
		addArtifactSilent(deck.artifacts[i]);
	}
	
	checkCompletion();
	refreshDeckList();
	
	deckName.value = deck.name;
	deckName.className = "form-control " + deck.soul;
	changeDeckImage.style.backgroundImage = "url(/images/cards/" + deck.image.image + ".png)";
}

function SaveDeck() { // This does NOT save deck images and names!
	var deck = {cards: [], artifacts: []}
	for (var i=0; i < window.decks[window.soul].length; i++) {
		var card = window.decks[window.soul][i];
		var _card = {id: card.id};
		if (card.shiny) {
			_card.shiny = true;
		}
		deck.cards.push(_card);
	}
	for (var i=0; i < window.decksArtifacts[window.soul].length; i++) {
		var artifact = window.decksArtifacts[window.soul][i];
		deck.artifacts.push(artifact.id);
	}
	
	window.localStorage[currentDeck.key] = JSON.stringify(deck);
	console.log(currentDeck.key, window.localStorage[currentDeck.key]);
}

function InitDecks() {
	//PrettyCards_plugin.events.on("SoulSelector:decksLoaded", function(data) {
	ExecuteWhen("SoulSelector:decksLoaded Chat:Connected", function() {
		deckSelector.callback = function(deck) {
			CloseDeckScreen();
			ChangeDeck(deck);
		}
		deckSelector.canEditDecks = true;
		deckSelector.AppendTo(changeDeckScreen);
	});
	
	deckEditPage.style.display = "none";
	
	document.querySelectorAll(".mainContent > br").forEach(function (br) {br.remove()});
	
	document.getElementsByClassName("mainContent")[0].appendChild(changeDeckScreen);
	
	SilenceDeckFunctions();
	
	var oldDeckButtons = document.querySelector(".btn-storage").parentElement;
	oldDeckButtons.style = "display: none;";
	document.getElementById("selectSouls").style.display = "none";
	
	var newDeckButtons = document.createElement("DIV");
	newDeckButtons.style = "margin-bottom: 5px;"
	oldDeckButtons.parentElement.insertBefore(newDeckButtons, oldDeckButtons);
	
	newDeckButtons.className = "PrettyCards_DeckButtons";
	
	newDeckButtons.appendChild(deckName);
	//deckName.style = "text-align: center";
	deckName.value = "Placeholder Deck";
	deckName.className = "form-control";
	//deckName.setAttribute("type", "text");
	deckName.style = "background: rgba(0,0,0,.5);";
	deckName.placeholder = "Deck Name";
	$(deckName).keyup(ChangeDeckName.bind(this));
	
	var changeDeckButton = document.createElement("BUTTON");
	newDeckButtons.appendChild(changeDeckButton);
	changeDeckButton.style = "width: 50%; margin: 0; text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black;";
	changeDeckButton.className = "btn btn-primary";
	changeDeckButton.innerHTML = "Change<br>Deck";
	changeDeckButton.onclick = ChangeDeckScreen.bind(this);
	
	newDeckButtons.appendChild(changeDeckImage);
	changeDeckImage.style = "width: 50%; margin: 0; background-image: url(/images/cards/Dummy.png); background-size: cover; background-position: center; text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black;";
	changeDeckImage.className = "btn btn-primary";
	changeDeckImage.innerHTML = "Change<br>Image";
	changeDeckImage.onclick = ChangeDeckImageDialogue.bind(this);
}

export {InitDecks};