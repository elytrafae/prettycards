
import {utility} from "/src/libraries/utility.js";
import {pagegetters} from "/src/libraries/page_getters.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {SoulSelector} from "/src/libraries/soul_selector.js";
import {SavedDeckSelector, dummy_skin, onu_skin} from "/src/libraries/deck_selector.js";
import {DeckEditor} from "/src/libraries/deck_editor.js";

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@e42698ff17778d9145c81a88d817089fe31927b9/css/Souls.css");

var custom_deck_sys = settings.override_decks.value();

var shouldGoToGameList = false;
var soulSelector = new SoulSelector();
var deckSelector = new SavedDeckSelector();
var selectedDeck;
var playLocked = false;

function OpenDeckSelector() {
	$("#PrettyCards_PrivateGameChallengeForm").attr("hidden", true);
	$("#PrettyCards_PrivateGameChallengeDeckSelector").attr("hidden", false);
	latest_dial.$modalDialog.addClass("modal-lg");
	playLocked = true;
}

function CloseDeckSelector() {
	$("#PrettyCards_PrivateGameChallengeForm").attr("hidden", false);
	$("#PrettyCards_PrivateGameChallengeDeckSelector").attr("hidden", true);
	latest_dial.$modalDialog.removeClass("modal-lg");
	playLocked = false
}

function DeckSelectorCallback(deck) {
	SetSelectedDeck(deck);
	CloseDeckSelector();
}

function SetInitialDeck() {
	var deckId = Number(window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckId"]);
	var deckSoul = window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckSoul"];
	if (typeof(deckId) == "number" && typeof(deckSoul) == "string") {
		var deck = deckSelector.getDeckBySoulAndId(deckSoul, deckId);
		if (deck == null) {
			var error_deck = {
				soul : "DETERMINATION",
				id : -1,
				name : "ERROR!",
				cards : [],
				artifacts : [],
				image : onu_skin,
				description: "Selected deck not found! It must have been deleted!<br>Please choose another!"
			}
			SetSelectedDeck(error_deck);
			playLocked = true;
		} else {
			SetSelectedDeck(deck);
		}
	} else {
		var error_deck = {
			soul : "UNIVERSAL",
			id : -1,
			name : "ERROR!",
			cards : [],
			artifacts : [],
			image : dummy_skin,
			description: "No deck selected!"
		}
		SetSelectedDeck(error_deck);
		playLocked = true;
	}
}

function SetSelectedDeck(deck) {
	selectedDeck = deck;
	window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckId"] = deck.id;
	window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckSoul"] = deck.soul;
	playLocked = false;
	
	var deck_cont = $("#PrettyCards_PrivateGameChallengeDeckCard");
	deck_cont.html("");
	deckSelector.appendCardDeck(deck_cont, deck, false);
}

function GetChallengeJQueryObject(user) {
	var html = $(`
		<div id="PrettyCards_PrivateGameChallengeForm">
			<p>Game Name: </p><input id="PrettyCards_PrivateGameName" type="text" class="form-control" value="${"PrettyCardsCustom" + Math.floor(Math.random()*100)}"></input>
			<p>Invitees (separate names with ","): </p><input id="PrettyCards_PrivateGameRecipients" type="text" class="form-control" value="${ (!!user) ? user.username : ""}"></input>
			<br>
			<label class="form-check-label"><input id="PrettyCards_PrivateGameEveryone" type="checkbox" class="form-check-input" ${(!user) ? "checked" : ""}></input> Challenge Everyone?</label>
			<p ${custom_deck_sys ? "hidden" : ""}>Soul: ${soulSelector.SetUp("PrettyCards_ChallengeSoul_", "Normal")}</p>
			<div id="PrettyCards_PrivateGameChallengeDeckCard"></div>
		</div>
		<div id="PrettyCards_PrivateGameChallengeDeckSelector" hidden></div>
	`)
	if (custom_deck_sys) {		
		html.find("#PrettyCards_PrivateGameChallengeDeckCard").click(OpenDeckSelector);
	}
	return html;
}

function OnShow(dialog) {
	console.log("Dialogue", latest_dial);
	if (custom_deck_sys) {
		SetInitialDeck();
		deckSelector.closable = true;
		deckSelector.closeCallback = CloseDeckSelector;
		deckSelector.callback = DeckSelectorCallback;
		
		deckSelector.AppendTo($("#PrettyCards_PrivateGameChallengeDeckSelector")[0]);
	} else {
		soulSelector.AddDeckTooltips();
	} 
}

var messageInfos = {};
var latest_dial;

function SetUpDeckOnServer(callback) {
	var toast = PrettyCards_plugin.toast(
		{
			title: "Please wait!",
			text: "Setting up the deck on the server . . .",
		}
	);
	playLocked = true;
	DeckEditor.OptimalImportDeck(selectedDeck, function(status) {
		playLocked = false;
		if (toast.exists()) {
			toast.close();
		}
		if (status == "success") {
			//console.log("success");
			callback();
		} else {
			console.log("DeckEditor.ImportDeck error!");
		}
	})
}

function ChallengePlayerScreen(user, infos) {
	messageInfos = infos;
	latest_dial = BootstrapDialog.show({
		title: "Custom Challenge!",
		message: GetChallengeJQueryObject(user),
		onshown: OnShow.bind(this),
		buttons: [{
				label: "Cancel Challenge!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}, {
				label: "Send Challenge!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					if (playLocked) {
						return;
					}
					var gameName = document.getElementById("PrettyCards_PrivateGameName").value;
					var recipients = document.getElementById("PrettyCards_PrivateGameEveryone").checked ? ["everyone"] : document.getElementById("PrettyCards_PrivateGameRecipients").value.split(",");
					for (var i=0; i < recipients.length; i++) {
						recipients[i] = recipients[i].trim();
					}
					if (recipients.length <= 0) {
						recipients = ["everyone"];
					}
					var soul = custom_deck_sys ? selectedDeck.soul : soulSelector.selectedSoul; // For testing purposes. Not ANYMORE!
					if (!custom_deck_sys) {
						SendChallenge(gameName, recipients, soul);
					} else {
						SetUpDeckOnServer(function() {
							SendChallenge(gameName, recipients, soul);
						})
					}
				}
			}
		]
	});
	
}

function SendChallenge(gameName, recipients, soul) {
	console.log("Sending challenge!", gameName, recipients, soul);
	sessionStorage.setItem("PrettyCards_PrivateGameIsHost", true);
	sessionStorage.setItem("PrettyCards_PrivateGameName", gameName);
	sessionStorage.setItem("PrettyCards_PrivateGameSoul", soul);
	sessionStorage.setItem("PrettyCards_PrivateGameRecipients", JSON.stringify(recipients));
	var message = "I challenge " + recipients.join(", ") + " to a CUSTOM game! via PrettyCards";
	if (messageInfos.idRoom > 0) {
		console.log("Public message: ", message, String(messageInfos.idRoom));
		window.sendMessage(message, String(messageInfos.idRoom));
	} else {
		console.log("Private message: ", message, String(messageInfos.user.id));
		window.sendPrivateMessage(message, String(messageInfos.user.id));
	}
	shouldGoToGameList = true;
}

function CheckToGoToGameList(data) {
	if (shouldGoToGameList && JSON.parse(data.chatMessage).user.id === window.selfId) {
		window.location = '/GamesList';
	}
}

PrettyCards_plugin.events.on("Chat:getPrivateMessage", CheckToGoToGameList);
PrettyCards_plugin.events.on("Chat:getMessage", CheckToGoToGameList);

export {ChallengePlayerScreen};