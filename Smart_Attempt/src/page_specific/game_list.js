
// Otherwise known as "Customs"

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {SavedDeckSelector, dummy_skin, onu_skin} from "/src/libraries/decks/deck_selector.js";
import {DeckEditor} from "/src/libraries/decks/deck_editor.js";
import {utility} from "/src/libraries/utility.js";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/Play.css";
loadCSS(css);

var playLocked = true;
var deckSelectLocked = true;
var selectedDeck = {};
var deckSelector = new SavedDeckSelector();

var gamemode_functions = {
	normal: window.joinGame,
	password: window.joinGamePassword,
	create: window.createGame
}

function OpenDeckSelector() {
	if (deckSelectLocked) {
		return;
	}
	$("#state1").attr("hidden", true).css("display", "none");
	$("#deckSelectContainer").attr("hidden", false);
}

function CloseDeckSelector() {
	$("#state1").attr("hidden", false).css("display", "block");
	$("#deckSelectContainer").attr("hidden", true);
}

function DeckSelectorCallback(deck) {
	SetSelectedDeck(deck);
	CloseDeckSelector();
}

var last_tooltip;

function SetSelectedDeck(deck) {
	selectedDeck = deck;
	$('#PrettyCards_DeckArtifacts').html("");
	for (var i=0; i < deck.artifacts.length; i++) {
		var artifact = deck.artifacts[i];
		$('#PrettyCards_DeckArtifacts').append(artifactDisplay.ReturnArtifactIcon(artifact)).append(" ");
	}
	//console.log("Artifacts to display: ", arts, deck.artifacts);
	window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckId"] = deck.id;
	window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckSoul"] = deck.soul;
	playLocked = false;
	deckSelectLocked = false;
	
	var deck_cont = $("#PrettyCards_DeckContainer");
	deck_cont.html("");
	deckSelector.appendCardDeck(deck_cont, deck, false);
}

window.PrettyCards_StartJoiningQueue = function(id, game_mode) {
	if (playLocked) {
		return;
	}
	//console.log("Joining Queue Button Pressed!");
	var toast = PrettyCards_plugin.toast(
		{
			title: window.$.i18n("pc-play-decksetup-title"),
			text: window.$.i18n("pc-play-decksetup-text"),
		}
	);
	deckSelectLocked = true;
	playLocked = true;
	DeckEditor.ImportDeck(selectedDeck, function(status, data) {
		deckSelectLocked = false;
		playLocked = false;
		if (toast.exists()) {
			toast.close();
		}
		if (status == "success") {
			//console.log("success");
			$('#customDecks').val(selectedDeck.soul);
			gamemode_functions[game_mode](id);
		} else {
			//console.log("DeckEditor.ImportDeck error!", data);
		}
	})
}

// Tournament mode element: <div id="tournament-mode" class="col-xs-4 game-mode"><h2 data-i18n="[html]game-type-tournament"></h2></div>

function InitGameList() {
	//console.log("Init Play!");
	
	$("#state1 > table").first().css("display", "none").after(`
		<div class="PrettyCards_PlayDeckRow">
			<div class="PrettyCards_GamemodeDeck">
				<div id="PrettyCards_DeckContainer"></div>
			</div>
			<div class="PrettyCards_PlayDeckInfo">
				<div id="PrettyCards_DeckArtifacts"></div>
			</div>
		</div>
	`);
	$(".PrettyCards_PlayDeckRow").next("br").remove();

	$('.mainContent').append('<div id="deckSelectContainer" hidden></div>');

	window.createGame = function () {window.PrettyCards_StartJoiningQueue(null, 'create')};
	window.joinGame = function (id) {window.PrettyCards_StartJoiningQueue(id, 'normal')};
	window.joinGamePassword = function (id) {window.PrettyCards_StartJoiningQueue(id, 'password')};

	ExecuteWhen("SoulSelector:decksLoaded Chat:Connected PrettyCards:onArtifacts PrettyCards:TranslationExtReady", function () {
		deckSelector.closable = true;
		deckSelector.closeCallback = CloseDeckSelector;
		deckSelector.callback = DeckSelectorCallback;
		
		deckSelector.AppendTo($("#deckSelectContainer")[0]);
		//console.log("All events matched!");
		var deckId = Number(window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckId"]);
		var deckSoul = window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckSoul"];
		if (typeof(deckId) == "number" && typeof(deckSoul) == "string") {
			var deck = deckSelector.getDeckBySoulAndId(deckSoul, deckId);
			if (deck == null) {
				//$('#selectedDeck').html('<span class="red">Selected deck not found! It must have been deleted!</span>');
				var error_deck = {
					soul : "DETERMINATION",
					id : -1,
					name : window.$.i18n("pc-play-error"),
					cards : [],
					artifacts : [],
					image : onu_skin,
					description: window.$.i18n("pc-play-deckerror")
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
				name : window.$.i18n("pc-play-error"),
				cards : [],
				artifacts : [],
				image : dummy_skin,
				description: window.$.i18n("pc-play-nodeck")
			}
			SetSelectedDeck(error_deck);
			playLocked = true;
		}
		
		deckSelectLocked = false;
		
	})
	
	$("#PrettyCards_DeckContainer").click(OpenDeckSelector);
}

export {InitGameList};