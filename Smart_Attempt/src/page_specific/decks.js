
import {CardSkinSelector} from "/src/libraries/card_skin_selector.js";
import {SavedDeckSelector} from "/src/libraries/deck_selector.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {SoulSelector} from "/src/libraries/soul_selector.js";
import {DeckEditor} from "/src/libraries/deck_editor.js";

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import { utility } from "../libraries/utility";

var $ = window.$;

var deckSelector = new SavedDeckSelector();
var skinSelector = new CardSkinSelector();
var deckName = document.createElement("INPUT");
var deckDesc = document.createElement("TEXTAREA");
var editDeckButton = document.createElement("BUTTON");
var changeDeckScreen = document.createElement("DIV");
var col2;
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
	//console.log("Changing deck to", deck);
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
	//console.log(skin);
	//changeDeckImage.style.backgroundImage = "url(/images/cards/" + skin.image + ".png)";
	var key = "prettycards.deck." + selfId + "." + currentDeck.soul + "." + currentDeck.id + ".image";
	currentDeck.image = skin;
	window.localStorage[key] = JSON.stringify(skin);
	
	ReloadDeckEditPreview();
}

function ChangeDeckName() {
	var nameValue = $(deckName).val();
	currentDeck.name = nameValue;
	var key = currentDeck.key + ".name";
	window.localStorage[key] = nameValue;
	
	ReloadDeckEditPreview();
}

function ChangeDeckDescription() {
	var descValue = $(deckDesc).val();
	currentDeck.description = descValue;
	var key = "prettycards.deck." + selfId + "." + currentDeck.soul + "." + currentDeck.id + ".description";
	window.localStorage[key] = descValue;
	
	ReloadDeckEditPreview();
}

function EditDeckScreenHTML() {
	var cont_cont = document.createElement("DIV");
	var cont = document.createElement("DIV");
	cont.style = "min-height: 230px;";
	cont_cont.appendChild(cont);
	
	var col1 = document.createElement("DIV");
	col1.style = "display: inline-block; margin: 0; float:left; min-height:250px; width: 320px;";
	cont.appendChild(col1);
	
	col2 = document.createElement("DIV");
	col2.style = "display: inline-block; margin: 0; width: 235px; display: flex; justify-content: space-evenly;";
	cont.appendChild(col2);
	
	col1.innerHTML = "<span>Deck Name: </span>";
	
	col1.appendChild(deckName);
	deckName.value = currentDeck.name;
	deckName.className = "form-control " + currentDeck.soul;
	deckName.style = "background: rgba(0,0,0,.5);";
	deckName.placeholder = "Deck Name";
	$(deckName).unbind("keyup").keyup(ChangeDeckName.bind(this)); // I dunno why I did this, but it shouldn't be a biggie :3
	
	var deckDescSpan = document.createElement("SPAN");
	deckDescSpan.innerHTML = "<br>Deck Description:<br>";
	col1.appendChild(deckDescSpan);
	
	col1.appendChild(deckDesc);
	deckDesc.className = currentDeck.soul;
	deckDesc.style = "background: rgba(0,0,0,.5); width: 100%; max-width: 320px;"
	deckDesc.value = currentDeck.description;
	$(deckDesc).unbind("keyup").keyup(ChangeDeckDescription.bind(this));
	
	var changeImage = document.createElement("BUTTON");
	changeImage.innerHTML = "Change Deck Image";
	changeImage.className = "btn btn-primary";
	changeImage.style = "display: block; margin-top: 10px;"
	changeImage.onclick = ChangeDeckImageDialogue.bind(this);
	col1.appendChild(changeImage);
	
	var emergencyLoad = document.createElement("BUTTON");
	emergencyLoad.innerHTML = "Emergency Load Deck";
	emergencyLoad.className = "btn btn-danger";
	emergencyLoad.style = "display: block; margin-top: 10px;"
	emergencyLoad.onclick = function () {
		DeckEditor.ImportDeck(currentDeck, function() {})
	};
	col1.appendChild(emergencyLoad);
	
	var note = document.createElement("P");
	note.className = "gray";
	note.style = "margin-top: 15px;";
	note.innerHTML = "NOTE: The Emergency Load Deck immediately uploads the selected deck to the server. It is not an intended feature for my deck system, but one that should be used if the system breaks again.";
	cont_cont.appendChild(note);
	
	ReloadDeckEditPreview();
	
	
	
	return cont_cont;
}

function ReloadDeckEditPreview() {
	//console.log("Reload deck edit preview");
	col2.innerHTML = "";
	deckSelector.appendCardDeck($(col2), currentDeck, true);
}

function EditDeckScreen() {
	BootstrapDialog.show({
		title: "Edit deck!",
		size: BootstrapDialog.SIZE_NORMAL,
		closable: true,
		closeByBackdrop: false,
		message: EditDeckScreenHTML(),
		buttons: [
			{
				label: "Ok!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}
		]
	});
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
	if (!utility.onTestServer() && nrInDeck >= maxDupesPerRarity[card.rarity]) {
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
	if (currentDeck.isBase) {
		DeckEditor.AddCard(idCard, shiny, currentDeck.soul, function() {}); // Please tell me I won't have to do anything more with this in the future . . .
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
	
	SaveDeck();
	if (currentDeck.isBase) {
		DeckEditor.RemoveCard(idCard, shiny, currentDeck.soul, function() {}); // Please tell me I won't have to do anything more with this in the future . . .
	}
}

function addArtifactSilent(idArtifact, dontUpdateDeck, is_importing = false) {
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
	if (currentDeck.isBase && !is_importing) {
		DeckEditor.AddArtifact(idArtifact, currentDeck.soul, function() {}); // Please tell me I won't have to do anything more with this in the future . . .
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
	if (currentDeck.isBase) {
		DeckEditor.RemoveArtifacts(currentDeck.soul, function() {}); // Please tell me I won't have to do anything more with this in the future . . .
	}
}

function removeAllCardsSilent(dontUpdateDeck, is_importing = false) {
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
	if (currentDeck.isBase && !is_importing) {
		DeckEditor.RemoveEverything(currentDeck.soul, function() {}); // Please tell me I won't have to do anything more with this in the future . . .
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
	
	window.showDeckLoad = ModifiedShowDeckLoad;
}

function LoadDeck(deck) {
	if (deck.isBase) {
		DeckEditor.OptimalImportDeck(deck, function() {}); // Please tell me I won't have to do anything more with this in the future . . .
	}
	
	window.soul = deck.soul;
	updateSoul();
	removeAllCardsSilent(true, true);
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
		addArtifactSilent(deck.artifacts[i], true, true);
	}
	
	checkCompletion();
	refreshDeckList();
	
	//deckName.value = deck.name;
	//deckName.className = "form-control " + deck.soul;
	//changeDeckImage.style.backgroundImage = "url(/images/cards/" + deck.image.image + ".png)";
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
	//console.log(currentDeck.key, window.localStorage[currentDeck.key]);
}

var oldShowDeckLoad = window.showDeckLoad;
function ModifiedShowDeckLoad(jsonDeck) {
	var jsonDeckSoul = jsonDeck.classe || jsonDeck.soul;
	if (jsonDeckSoul != currentDeck.soul) {
		BootstrapDialog.show({
			title: "Unable to Import!",
			//size: BootstrapDialog.SIZE_WIDE,
			type: window.BootstrapDialog.TYPE_DANGER,
			message: 'The deck you are trying to import is of a different soul. Please open or create a new <span class="' + jsonDeckSoul + '">' + jsonDeckSoul + '</span> deck to import this deck!',
			buttons: [
				{
					label: $.i18n('dialog-ok'),
					cssClass: 'btn-primary',
					action: function (dialog) {
						dialog.close();
					}
				}
			]
		});
		return;
	}
	oldShowDeckLoad(jsonDeck);
}

function InitDecks() {
	//PrettyCards_plugin.events.on("SoulSelector:decksLoaded", function(data) {
	ExecuteWhen("SoulSelector:decksLoaded Chat:Connected PrettyCards:onArtifacts", function() {
		deckSelector.callback = function(deck) {
			CloseDeckScreen();
			ChangeDeck(deck);
		}
		deckSelector.canEditDecks = true;
		deckSelector.hideInvalidDecks = false;
		deckSelector.AppendTo(changeDeckScreen);
	});
	
	deckEditPage.style.display = "none";
	
	document.querySelectorAll(".mainContent > br").forEach(function (br) {br.remove()});
	
	document.getElementsByClassName("mainContent")[0].appendChild(changeDeckScreen);
	
	SilenceDeckFunctions();
	
	var oldDeckButtons = $(".btn-storage").first().parent(); //document.querySelector(".btn-storage").parentElement;
	oldDeckButtons.css("display", "none");
	document.getElementById("selectSouls").style.display = "none";
	
	var newDeckButtons = $("<div style='margin-bottom: 5px;' class='PrettyCards_DeckButtons'></div>");
	//document.querySelector("#yourCardList").insertBefore(newDeckButtons, oldDeckButtons);
	newDeckButtons.insertBefore(oldDeckButtons);
	
	/*
	newDeckButtons.appendChild(deckName);
	//deckName.style = "text-align: center";
	deckName.value = "Placeholder Deck";
	deckName.className = "form-control";
	//deckName.setAttribute("type", "text");
	deckName.style = "background: rgba(0,0,0,.5);";
	deckName.placeholder = "Deck Name";
	$(deckName).keyup(ChangeDeckName.bind(this));
	*/
	
	var changeDeckButton = document.createElement("BUTTON");
	newDeckButtons.append(changeDeckButton);
	changeDeckButton.style = "width: 50%; margin: 0; text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black;";
	changeDeckButton.className = "btn btn-primary";
	changeDeckButton.innerHTML = "Change<br>Deck";
	changeDeckButton.onclick = ChangeDeckScreen.bind(this);
	
	newDeckButtons.append(editDeckButton);
	//editDeckButton.style = "width: 50%; margin: 0; background-image: url(/images/cards/Dummy.png); background-size: cover; background-position: center; text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black;";
	editDeckButton.style = "width: 50%; margin: 0; text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black;";
	editDeckButton.className = "btn btn-primary";
	editDeckButton.innerHTML = "Edit<br>Deck";
	editDeckButton.onclick = EditDeckScreen.bind(this);
}

export {InitDecks};