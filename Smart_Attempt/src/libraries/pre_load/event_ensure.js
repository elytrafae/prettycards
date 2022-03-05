
// This is a script that should help with calling things AFTER certain one-time events have been fired.

var eventsToListenFor = ["PrettyCards:onLoad", "PrettyCards:onPageLoad","SoulSelector:decksLoaded", "Chat:Connected", "PrettyCards:onArtifacts", "translation:loaded", "PC_Chat:getSelfInfos"];
var eventsFired = {};
var eventsData = {};

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

var waitingObjects = [];

function ExecuteWhen(events, callback) { // events is a space-devided string OR an array of strings.
	if (typeof(events) == "string") {
		events = events.split(" ");
	}
	var obj = {
		eventsToWaitFor: [],
		callback: callback
	}
	for (var i=0; i < events.length; i++) {
		var e = events[i];
		var found = eventsToListenFor.find(element => element === e);
		if (!found) {
			console.log("! ExecuteWhen WARNING ! The event ", e, " is not being tracked!");
		}
		if (!eventsFired[e]) {
			obj.eventsToWaitFor.push(e);
		}
	}
	if (!ExecuteWaitingObjectCallbackIfPossible(obj)) { // Both checks if the thing can run instantly AND if it can it does so!
		waitingObjects.push(obj);
	}
}

function InitListeners() {
	for (var i=0; i < eventsToListenFor.length; i++) {
		const e = eventsToListenFor[i];
		eventsFired[e] = false;
		PrettyCards_plugin.events.on(e, function(data) {
			console.log(e + " event captured successfully! data: ", data);
			eventsFired[e] = true;
			eventsData[e] = data;
			UpdateWaitingObjects(e);
		});
	}
}

function UpdateWaitingObjects(e) { // e - event to check off the list
	for (var i=0; i < waitingObjects.length; i++) {
		var obj = waitingObjects[i];
		var deleted = utility.deleteByValue(obj.eventsToWaitFor, e);
		if (deleted) {
			var executed = ExecuteWaitingObjectCallbackIfPossible(obj);
			if (executed) {
				waitingObjects.splice(i, 1);
				i--;
			}
		}
	}
}

function ExecuteWaitingObjectCallbackIfPossible(obj) {
	if (obj.eventsToWaitFor.length <= 0) {
		obj.callback();
		return true;
	}
	return false;
}

InitListeners();

if ('loading' == document.readyState) {
	// This script is running at document-start time.
	document.addEventListener("load", function() {
		PrettyCards_plugin.events.emit("PrettyCards:onLoad");
	})
} else {
	// This script is running after document-start.
	PrettyCards_plugin.events.emit("PrettyCards:onLoad");
}

ExecuteWhen("PrettyCards:onPageLoad", function () {
	if (!window.allCards) {
		window.$("body").append('<script src="js/card.js?v=063001" type="text/javascript"></script>');
		window.$("head").append('<link href="css/cards.css?v=063001" rel="stylesheet" type="text/css">');
		window.$("head").append('<link href="css/frames.css?v=063001" rel="stylesheet" type="text/css">');
	}
	if (!window.underscript.onPage("Friendship")) {
		window.$("body").append('<script src="js/friendshipUtils.js?v=068003" type="text/javascript"></script>');
	}
});

console.log("EventEnsure initialized at " + document.readyState + " state!");



export {ExecuteWhen};