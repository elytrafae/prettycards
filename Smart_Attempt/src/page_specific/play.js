
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {SavedDeckSelector} from "/src/libraries/deck_selector.js";
import {DeckEditor} from "/src/libraries/deck_editor.js";

var playLocked = true;
var deckSelectLocked = true;
var selectedDeck = {};
var deckSelector = new SavedDeckSelector();

var gamemode_functions = {
	standard: window.sendJoinQueue,
	ranked: window.sendJoinRankedQueue,
	event: window.sendJoinEventQueue,
	boss: window.sendJoinBossQueue
}

function OpenDeckSelector() {
	if (deckSelectLocked) {
		return;
	}
	$("#phase1").attr("hidden", true).css("display", "none");
	$("#deckSelectContainer").attr("hidden", false);
}

function CloseDeckSelector() {
	$("#phase1").attr("hidden", false).css("display", "block");
	$("#deckSelectContainer").attr("hidden", true);
}

function DeckSelectorCallback(deck) {
	SetSelectedDeck(deck);
	CloseDeckSelector();
}

function SetSelectedDeck(deck) {
	selectedDeck = deck;
	var arts = "";
	for (var i=0; i < deck.artifacts.length; i++) {
		var artifact = deck.artifacts[i];
		arts += artifactDisplay.ReturnArtifactIcon(artifact);
	}
	$('#deckSelectArtifacts').html(arts);
	$('#selectedDeck').html(`<span class="${deck.soul}">Selected Deck: ${deck.name}</span>`);
	window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckId"] = deck.id;
	window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckSoul"] = deck.soul;
	playLocked = false;
	deckSelectLocked = false;
}

function StartJoiningQueue(game_mode) {
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
			$('#playDecks').val(selectedDeck.soul);
			gamemode_functions[game_mode]();
		} else {
			console.log("DeckEditor.ImportDeck error!");
		}
	})
}

function InitPlay() {
	console.log("Init Play!");
	$("#phase1").append(`
		<div class="container">
			<div class="row">
				<div class="col-md-1" id="selectedDeckContainer"></div>
				<div class="col-md-1" id="standardContainer"></div>
			</div><div class="row">
				<div class="col-md-1" id="rankedContainer"></div>
				<div class="col-md-1" id="customContainer"></div>
			</div>
		</div>
	`);
	$('#playDecks').css("display", "none");
	$('#playDecks').parent().append('<div id="selectedDeck"></div>');
	$('.mainContent').append('<div id="deckSelectContainer" hidden></div>');
	$(".playSoulArtifacts").css( // Stop. Resetting. The Visibility!
		{
			"opacity": "0",
			"position": "absolute"
		}
	);
	$("#selectedDeck").parent().next().append('<span id="deckSelectArtifacts"></span>');
	
	$("#standardContainer").append($("#standard-mode").addClass("game-mode"));
	$("#rankedContainer").append($("#ranked-mode").addClass("game-mode"));
	$("#customContainer").append($("#custom-mode").addClass("game-mode"));
	
	$("#standard-mode")[0].onclick = function () {StartJoiningQueue("standard")};
	$("#ranked-mode")[0].onclick = function () {StartJoiningQueue("ranked")};
	
	ExecuteWhen("SoulSelector:decksLoaded Chat:Connected PrettyCards:onArtifacts", function () {
		deckSelector.closable = true;
		deckSelector.closeCallback = CloseDeckSelector;
		deckSelector.callback = DeckSelectorCallback;
		
		deckSelector.AppendTo($("#deckSelectContainer")[0]);
		console.log("All events matched!");
		var deckId = Number(window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckId"]);
		var deckSoul = window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckSoul"];
		if (typeof(deckId) == "number" && typeof(deckSoul) == "string") {
			var deck = deckSelector.getDeckBySoulAndId(deckSoul, deckId);
			if (deck == null) {
				$('#selectedDeck').html('<span class="red">Selected deck not found! It must have been deleted!</span>');
			} else {
				SetSelectedDeck(deck);
			}
		} else {
			$('#selectedDeck').html('<span class="red">No Deck Selected!</span>');
		}
		
		deckSelectLocked = false;
		
	})
	
	$("#selectedDeck").click(OpenDeckSelector);
}

export {InitPlay};