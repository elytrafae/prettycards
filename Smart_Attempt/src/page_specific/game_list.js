
// Otherwise known as "Customs"

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {SavedDeckSelector, dummy_skin, onu_skin} from "/src/libraries/deck_selector.js";
import {DeckEditor} from "/src/libraries/deck_editor.js";
import {utility} from "/src/libraries/utility.js";

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
	var arts = "";
	for (var i=0; i < deck.artifacts.length; i++) {
		var artifact = deck.artifacts[i];
		arts += artifactDisplay.ReturnArtifactIcon(artifact);
	}
	console.log("Artifacts to display: ", arts, deck.artifacts);
	$('#PrettyCards_DeckArtifacts').html(arts);
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
			title: "Please wait!",
			text: "Setting up the deck on the server . . .",
		}
	);
	deckSelectLocked = true;
	playLocked = true;
	DeckEditor.ImportDeck(selectedDeck, function(status) {
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
			console.log("DeckEditor.ImportDeck error!");
		}
	})
}

// Tournament mode element: <div id="tournament-mode" class="col-xs-4 game-mode"><h2 data-i18n="[html]game-type-tournament"></h2></div>

function InitGameList() {
	console.log("Init Play!");
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@4ebd16e8aea3023000642a69626c90174162a8f6/css/Play.css");
	
	$("#state1 > table").css("display", "none");
	$("#state1 br").css("display", "none");
	$(".mainContent > br").css("display", "none");
	$("#game-modes").css("display", "none");
	$("#state1").append(`
		<div class="PrettyCards_GamemodeContainer">
			<div class="PrettyCards_GamemodeDeck">
				<div id="PrettyCards_DeckContainer"></div>
				<div id="PrettyCards_DeckArtifacts"></div>
				<div id="PrettyCards_JoinCreate"></div>
			</div>
			<div class="PrettyCards_GamesList">
				<table id="PrettyCards_Games" class="table table-bordered">
					<tr>
						<td data-i18n="[html]lobby-game-name"></td>
						<td data-i18n="[html]lobby-game-owner"></td>
						<td data-i18n="[html]lobby-game-slots"></td>
						<td data-i18n="[html]lobby-game-password"></td>
					</tr>
				</table>
			</div>
		</div>
	`);
	
	$('.mainContent').append('<div id="deckSelectContainer" hidden></div>');
	$(".playSoulArtifacts").css( // Stop. Resetting. The Visibility!
		{
			"opacity": "0",
			"position": "absolute"
		}
	);
	
	$("#PrettyCards_JoinCreate").append($("#state1 button"));
	//$("#standard-mode")[0].onclick = function () {StartJoiningQueue("standard")};
	//$("#ranked-mode")[0].onclick = function () {StartJoiningQueue("ranked")};
	
	$("#PrettyCards_JoinCreate button")[0].onclick = function() {window.PrettyCards_StartJoiningQueue(null, 'create')}
	
	ExecuteWhen("SoulSelector:decksLoaded Chat:Connected PrettyCards:onArtifacts", function () {
		deckSelector.closable = true;
		deckSelector.closeCallback = CloseDeckSelector;
		deckSelector.callback = DeckSelectorCallback;
		
		deckSelector.AppendTo($("#deckSelectContainer")[0]);
		console.log("All events matched!");
		var deckId = Number(window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckId"]);
		var deckSoul = window.localStorage["prettycards." + window.selfId + ".selectedCustomDeckSoul"];
		if (typeof(deckId) == "number" && typeof(deckSoul) == "string") {
			var deck = deckSelector.getDeckBySoulAndId(deckSoul, deckId);
			if (deck == null) {
				//$('#selectedDeck').html('<span class="red">Selected deck not found! It must have been deleted!</span>');
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
		
		deckSelectLocked = false;
		
	})
	
	$("#PrettyCards_DeckContainer").click(OpenDeckSelector);
	
	window.regenerateTable = function(games) {
		$("#PrettyCards_Games").find("tr:gt(0)").remove();
		for (var i = 0; i < games.length; i++) {
			var slots;
			if (games[i].player !== undefined) {
				slots = "2/2";
			} else {
				slots = "1/2";
			}
			var gameMode = '{{MODE:' + games[i].gameType + '}}';
			if (games[i].isPrivate) {
				$('#PrettyCards_Games tr:last').after('<tr class="pointer" onclick="PrettyCards_StartJoiningQueue(' + games[i].id + ', \'password\')"><td>' + games[i].name + '</td><td>' + games[i].owner.username + '</td><td>' + slots + '</td><td>' + $.i18n("lobby-yes") + '</td></tr>');
			} else {
				$('#PrettyCards_Games tr:last').after('<tr class="pointer" onclick="PrettyCards_StartJoiningQueue(' + games[i].id + ', \'normal\')"><td>' + games[i].name + '</td><td>' + games[i].owner.username + '</td><td>' + slots + '</td><td>' + $.i18n("lobby-no") + '</td></tr>');
			}
		}
	}
}

export {InitGameList};