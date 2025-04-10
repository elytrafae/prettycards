
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {SavedDeckSelector, dummy_skin, onu_skin, GetAllDecks} from "/src/libraries/decks/deck_selector.js";
import {DeckEditor} from "/src/libraries/decks/deck_editor.js";
import {utility} from "/src/libraries/utility.js";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/Play.css";
loadCSS(css);

var playLocked = true;
var deckSelectLocked = true;
var selectedDeck = {};
var deckSelector = new SavedDeckSelector();

var selfDivision = "";
var selfElo = 0;
var alreadyAgreedToRanked = false;

var $ = window.$;

function ReloadPage() {
	window.location.reload();
}

PrettyCards_plugin.events.on("Chat:getSelfInfos", function(data) {
	var me = JSON.parse(data.me);
	selfDivision = me.division;
	selfElo = me.eloRanked;
	//console.log("CHAT JOINED!", JSON.parse(data.me));
})

function askRanked() {
	if (alreadyAgreedToRanked) {
		return true;
	}
	if (selfDivision == "LEGEND" && selfElo <= 2000) {
		window.BootstrapDialog.show({
            title: window.$.i18n("pc-play-ranked-warning-title"),
			type: window.BootstrapDialog.TYPE_DANGER,
            message: window.$.i18n("pc-play-ranked-warning-body"),
			//onshow: this.OnShow
			buttons: [
				{
					label: window.$.i18n("pc-play-ranked-warning-smart"),
					cssClass: 'btn-primary',
					action: function(dialog) {
						dialog.close();
					}
				},
				{
					label: window.$.i18n("pc-play-ranked-warning-dumbass"),
					cssClass: 'btn-danger',
					action: function(dialog) {
						alreadyAgreedToRanked = true;
						StartJoiningQueue("ranked");
						dialog.close();
					}
				}
			]
        });
		return false;
	}
	return true;
}

var gamemode_functions = {
	standard: window.sendJoinQueue,
	ranked: window.sendJoinRankedQueue,
	//ranked: askRanked,
	event: window.sendJoinEventQueue,
	boss: window.sendJoinBossQueue,
	reload: ReloadPage
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

var last_tooltip;

function SetSelectedDeck(deck) {
	selectedDeck = deck;
	$('#PrettyCards_DeckArtifacts').html("");
	for (var i=0; i < deck.artifacts.length; i++) {
		var artifact = deck.artifacts[i];
		$('#PrettyCards_DeckArtifacts').append(artifactDisplay.ReturnArtifactIcon(artifact)).append(" ");
	}
	//console.log("Artifacts to display: ", arts, deck.artifacts);
	window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckId"] = deck.id;
	window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckSoul"] = deck.soul;
	playLocked = false;
	deckSelectLocked = false;
	
	var deck_cont = $("#PrettyCards_DeckContainer");
	deck_cont.html("");
	deckSelector.appendCardDeck(deck_cont, deck, false);
}

function StartJoiningQueue(game_mode) {
	if (playLocked) {
		return;
	}
	if (game_mode == "ranked" && !askRanked()) {
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

// Tournament mode element: <div id="tournament-mode" class="col-xs-4 game-mode"><h2 data-i18n="[html]game-type-tournament"></h2></div>

function InitPlay() {
	//console.log("Init Play!");
	
	if (document.querySelector('span[data-i18n="[html]play-incomplete"]')) {
		console.log("NO DECKS!");
		ExecuteWhen("PrettyCards:onArtifacts", function () {
			var decks = GetAllDecks();
			for (var i=0; i < decks.length; i++) {
				var deck = decks[i];
				if (deckSelector.IsValidDeck(deck)) {
					playLocked = false;
					selectedDeck = deck;
					StartJoiningQueue("reload");
					break;
				}
			}
		})
		return;
	}
	
	$("#phase1 > table").css("display", "none");
	$("#game-modes").css("display", "none");
	$("#phase1").append(`
		<div class="PrettyCards_GamemodeContainer">
			<div class="PrettyCards_GamemodeDeck">
				<div id="PrettyCards_DeckContainer"></div>
				<div id="PrettyCards_DeckArtifacts"></div>
				<div id="PrettyCards_SeasonRewards">
					<a style="color: gray; border: 1px dotted gray; padding: 5px; background-color: black;" href="rewards.jsp" class="pointer" data-i18n="[html]play-rewards"></a>
				</div>
			</div>
			<div class="PrettyCards_Gamemodes">
				<div id="standardContainer"></div>
				<div id="rankedContainer"></div>
				<div id="customContainer"></div>
				<div id="tornamentContainer">
				</div>
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
	
	$("#standardContainer").append($("#standard-mode").addClass("game-mode"));
	$("#rankedContainer").append($("#ranked-mode").addClass("game-mode"));
	$("#customContainer").append($("#custom-mode").addClass("game-mode"));
	
	$("#standard-mode")[0].onclick = function () {StartJoiningQueue("standard")};
	$("#ranked-mode")[0].onclick = function () {StartJoiningQueue("ranked")};
	
	ExecuteWhen("SoulSelector:decksLoaded Chat:Connected PrettyCards:onArtifacts PrettyCards:TranslationExtReady", function () {
		window.$("#PrettyCards_SeasonRewards a").html(window.$.i18n("play-rewards"));

		deckSelector.closable = true;
		deckSelector.closeCallback = CloseDeckSelector;
		deckSelector.callback = DeckSelectorCallback;
		
		deckSelector.AppendTo($("#deckSelectContainer")[0]);
		//console.log("All events matched!");
		var deckId = Number(window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckId"]);
		var deckSoul = window.localStorage["prettycards." + window.selfId + ".selectedPlayDeckSoul"];
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

export {InitPlay};