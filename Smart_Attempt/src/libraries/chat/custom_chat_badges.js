import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

const PC_CONTRIB_BADGE = {
    id: 222,
    priority: 10,
    name: "PrettyCards Contributor",
    icon: "PC_Contrib"
}

function processMessage(message) {
    var user = message.user;
    user.groups.push(PC_CONTRIB_BADGE);
    //user.mainGroup = PC_CONTRIB_BADGE;
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
    var message = JSON.parse(data.chatMessage);
    processMessage(message);
    data.chatMessage = JSON.stringify(message); // I hate that I have to do stuff like this >~<
}

PrettyCards_plugin.events.on("preChat:getHistory preChat:getPrivateHistory", processChatHistoryEvent);
PrettyCards_plugin.events.on("preChat:getMessage preChat:getPrivateMessage", processChatMessageEvent);