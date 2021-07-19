
import {pagegetters} from "/src/libraries/page_getters.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

var decks = {};

function UpdateDecks() {
	if (underscript.onPage("Decks")) {
		var decksData = window.decks;
		decks = {};
		for (var deckName in decksData) {
			decks[deckName] = {};
			decks[deckName].cards = decksData[deckName];
			decks[deckName].artifacts = decksArtifacts[deckName];
		}
		console.log("Decks from decks page: ", decks);
	} else if ($.isEmptyObject(decks)) {
		pagegetters.GetDecks(function (decksData) {
			for (var i=0; i < decksData.length; i++) {
				var deck = decksData[i];
				decks[deck.soul.name] = {};
				decks[deck.soul.name].cards = deck.cardsList;
				decks[deck.soul.name].artifacts = deck.artifacts;
			}
			console.log("Decks from somewhere else: ", decks);
		})
	}
}

if (underscript.onPage("Decks")) {
	PrettyCards_plugin.events.on('Deck:Loaded', function(data) {
		UpdateDecks();
	});
} else {
	UpdateDecks();
}

function GetPlayableDecks() {
	UpdateDecks();
	var playableDecks = {};
	for (var soul in decks) {
		var deck = decks[soul];
		if ( deck.cards.length >= 25 && (deck.artifacts.length >= 2 || deck.artifacts[0].legendary) ) {
			playableDecks[soul] = deck;
		}
	}
	return playableDecks;
}

function GenerateArtifacts(artifacts) {
	var html = "";
	for (var i=0; i < artifacts.length; i++) {
		var artifact = artifacts[i];
		html += `<span class="${artifact.legendary ? 'yellow' : ''}"><img style="height: 16px;" src="images/artifacts/${artifact.image}.png" /> ${artifact.name}</span>`;
	}
	return html;
}

function GenerateCards(cards) {
	var html = "";
	for (var i=0; i < cards.length; i++) {
		var card = cards[i];
		html += `${card.shiny ? '<span style="color: yellow;">S</span> ' : ''}${card.name}<br>`;
	}
	return html;
}

var selectedSoul = "KINDNESS";

function ChangeDeck(deckName) {
	$(document.getElementById("PrettyCards_ChallengeSoul_" + selectedSoul)).removeClass("PrettyCards_SelectedSoul");
	selectedSoul = deckName;
	$(document.getElementById("PrettyCards_ChallengeSoul_" + selectedSoul)).addClass("PrettyCards_SelectedSoul");
}

window.PrettyCards_ChangeDeck = ChangeDeck;

function GetSoulsHTML() {
	var playableDecks = GetPlayableDecks();
	var html = "";
	var firstSoul = ""
	for (var deckName in playableDecks) {
		if (firstSoul === "") {
			firstSoul = deckName;
		}
		html += `<img src="https://github.com/CMD-God/prettycards/raw/master/img/Souls/${deckName}.png" id="PrettyCards_ChallengeSoul_${deckName}" style="margin: 2px" onclick='PrettyCards_ChangeDeck("${deckName}");' class="PrettyCards_Soul_${deckName} PrettyCards_NormalSoul ${deckName === firstSoul ? "PrettyCards_SelectedSoul" : ""}"></img>`;
		console.log(GenerateArtifacts(playableDecks[deckName].artifacts));
		console.log(GenerateCards(playableDecks[deckName].cards));
	}
	selectedSoul = deckName;
	return html;
}

function GetChallengeHTML(user) {
	return `
	<p>Game Name: </p><input id="PrettyCards_PrivateGameName" type="text" class="form-control" value="${"PrettyCardsCustom" + Math.floor(Math.random()*100)}"></input>
	<p>Invitees (separate names with ","): </p><input id="PrettyCards_PrivateGameRecipients" type="text" class="form-control" value="${ (!!user) ? user.username : ""}"></input>
	<label class="form-check-label"><input id="PrettyCards_PrivateGameEveryone" type="checkbox" class="form-check-input" ${(!user) ? "checked" : ""}></input> Challenge Everyone?</label>
	<p>Soul: ${GetSoulsHTML()}</p>
`
}

function ChallengePlayerScreen(user) {
	BootstrapDialog.show({
		title: "Custom Chellenge!",
		message: GetChallengeHTML(user),
		buttons: [{
				label: "Nevermind!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}, {
				label: "Send Challenge!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					var gameName = document.getElementById("PrettyCards_PrivateGameName").value;
					var recipients = document.getElementById("PrettyCards_PrivateGameEveryone").checked ? ["everyone"] : document.getElementById("PrettyCards_PrivateGameRecipients").value.split(",");
					for (var i=0; i < recipients.length; i++) {
						recipients[i] = recipients[i].trim();
					}
					if (recipients.length <= 0) {
						recipients = ["everyone"];
					}
					var soul = "KINDNESS"; // For testing purposes.
					SendChallenge(gameName, recipients, soul);
				}
			}
		]
	});
}

function SendChallenge(gameName, recipients, soul) {
	localStorage.setItem("PrettyCards_PrivateGameIsHost", true);
	localStorage.setItem("PrettyCards_PrivateGameName", gameName);
	localStorage.setItem("PrettyCards_PrivateGameSoul", soul);
	localStorage.setItem("PrettyCards_PrivateGameRecipients", JSON.stringify(recipients));
	window.location = '/GamesList';
}

export {ChallengePlayerScreen};