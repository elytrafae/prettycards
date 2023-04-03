import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

function processMessage(message) {
    console.log(message);
}

function processChatHistoryEvent(data) {
    var messages = JSON.parse(data.history);
	for (var i=0; i < messages.length; i++) {
		processMessage(messages[i]);
	}
    data.history = JSON.stringify(messages); // I hate that I have to do stuff like this >~<
}

function processChatMessageEvent(data) {
    data.chatMessage = JSON.stringify(processMessage(JSON.parse(data.chatMessage))); // I hate that I have to do stuff like this >~<
}

PrettyCards_plugin.events.on("preChat:getHistory preChat:getPrivateHistory", processChatHistoryEvent);
PrettyCards_plugin.events.on("preChat:getMessage preChat:getPrivateMessage", processChatMessageEvent);