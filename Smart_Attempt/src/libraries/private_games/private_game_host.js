
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

var isHost = JSON.parse(localStorage.getItem("PrettyCards_PrivateGameIsHost"));
var gameName = localStorage.getItem("PrettyCards_PrivateGameName");
var gameCreator = localStorage.getItem("PrettyCards_PrivateGameCreator");
var recipients = JSON.parse(localStorage.getItem("PrettyCards_PrivateGameRecipients") || '["everyone"]');
var soul = localStorage.getItem("PrettyCards_PrivateGameSoul") || localStorage.getItem("customDeck");

function HostChallenge() {
	console.log("Initiating as host!");
	socket.send(JSON.stringify({action: "createGame", name: gameName, soul: soul}));
	PrettyCards_plugin.events.on("preCustom:getPlayerJoined", OnSomeoneJoin); // This event should only fire if you are the host.
}

function OnSomeoneJoin(data) {
	if (recipients.includes("everyone") || recipients.includes(data.username)) {
		localStorage.removeItem("PrettyCards_PrivateGameName");
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
			localStorage.removeItem("PrettyCards_PrivateGameName");
			socket.send(JSON.stringify({action: "joinGame",gameId: game.id, soul: soul, gamePassword: ""}));
		}
	}
}

function SetUpSocket() {
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
	SetUpSocket();
}

export {};