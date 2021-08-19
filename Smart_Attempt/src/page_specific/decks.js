
import {CardSkinSelector} from "/src/libraries/card_skin_selector.js";
import {SavedDeckSelector} from "/src/libraries/deck_selector.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

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
		changeDeckScreen.style.display = "none";
	}.bind(this);
	deckSelector.closable = true;
	//deckSelector.OpenDialogue();
	changeDeckScreen.style.display = "initial";
	deckEditPage.style.display = "none";
}

function ChangeDeck(deck) {
	currentDeck = deck;
	console.log("Changing deck to", deck);
	deckName.value = deck.name;
	deckName.className = "form-control " + deck.soul;
	changeDeckImage.style.backgroundImage = "url(/images/cards/" + deck.image.image + ".png)";
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
	localStorage[key] = JSON.stringify(skin);
}

function ChangeDeckName() {
	var nameValue = $(deckName).val();
	var key = "underscript.deck." + selfId + "." + currentDeck.soul + "." + currentDeck.id + ".name";
	localStorage[key] = nameValue;
}

function InitDecks() {
	PrettyCards_plugin.events.on("SoulSelector:decksLoaded", function(data) {
		deckSelector.callback = function(deck) {
			changeDeckScreen.style.display = "none";
			ChangeDeck(deck);
		}
		deckSelector.AppendTo(changeDeckScreen);
	});
	
	deckEditPage.style.display = "none";
	
	document.querySelectorAll(".mainContent > br").forEach(function (br) {br.remove()});
	
	document.getElementsByClassName("mainContent")[0].appendChild(changeDeckScreen);
	
	
	var oldDeckButtons = document.querySelector(".btn-storage").parentElement;
	oldDeckButtons.style = "display: none;";
	document.getElementById("selectSouls").style.display = "none";
	
	var newDeckButtons = document.createElement("DIV");
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