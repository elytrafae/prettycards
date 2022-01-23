
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var isHost = JSON.parse(sessionStorage.getItem("PrettyCards_PrivateGameIsHost"));
var gameName = sessionStorage.getItem("PrettyCards_PrivateGameName");
var gameCreator = sessionStorage.getItem("PrettyCards_PrivateGameCreator");
var recipients = JSON.parse(sessionStorage.getItem("PrettyCards_PrivateGameRecipients") || '["everyone"]');
var soul = sessionStorage.getItem("PrettyCards_PrivateGameSoul") || localStorage.getItem("customDeck");

function HostChallenge() {
	console.log("Initiating as host!");
	socket.send(JSON.stringify({action: "createGame", name: gameName, soul: soul}));
	PrettyCards_plugin.events.on("preCustom:getPlayerJoined", OnSomeoneJoin); // This event should only fire if you are the host.
}

function OnSomeoneJoin(data) {
	if (recipients.includes("everyone") || recipients.includes(data.username)) {
		sessionStorage.removeItem("PrettyCards_PrivateGameName");
		window.start();
	} else {
		window.banUser();
		this.canceled = true;
	}
}

function RecipientAcceptChallenge() {
	console.log("Initiating as recipient!");
	PrettyCards_plugin.events.on("preCustom:getGamesList", OnGameListLoad);
}

function OnGameListLoad(data) {
	console.log("Game List Loaded!", data);
	var games = JSON.parse(data.games);
	console.log(games);
	for (var i=0; i < games.length; i++) {
		var game = games[i];
		//if (game.name == gameName) {
		if (game.owner.usernameSafe == gameCreator) {
			sessionStorage.removeItem("PrettyCards_PrivateGameName");
			socket.send(JSON.stringify({action: "joinGame",gameId: game.id, soul: soul, gamePassword: ""}));
		}
	}
}

function SetUpSocket() {
	console.log("Socket Setup!", window.socket);
	var socket = window.socket;
	const oHandler = socket.onopen;
	socket.onopen = function(event) {
		InitiateChallengeIfThereIs();
		oHandler(event);
	}
}

function InitiateChallengeIfThereIs() {
	console.log("Private game: ", isHost, gameName, recipients, soul, gameCreator);
	if (!!gameName) {
		if (isHost) {
			HostChallenge();
		} else {
			RecipientAcceptChallenge();
		}
	}
}

if (underscript.onPage('GamesList')) {
	ExecuteWhen("PrettyCards:onPageLoad", function() { // Theoretical fix to one of Sernon's bugs?
		SetUpSocket();
	});
}

// PrettyCards_plugin.events.on('enterCustom', SetUpSocket); // You can switch to this when Feild makes this event a singleton.

export {};