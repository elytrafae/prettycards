import { utility } from "../utility";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

const PC_CONTRIB_BADGE = {
    id: 222,
    priority: 10,
    name: "PrettyCards_Contributor",
    icon: "PC_Contrib"
}

const BADGE_999 = {
    id: 999,
    priority: 10,
    name: "Overachiever",
    icon: "Overachiever"
}

var custom_badges = [PC_CONTRIB_BADGE, BADGE_999];

function processMessage(message) {
    var user = message.user;
    console.log(user);
    user.groups.push(PC_CONTRIB_BADGE);
    user.mainGroup = PC_CONTRIB_BADGE;
    if (user.level >= 900) {
        user.groups.push(BADGE_999);
    }
}

function correctCustomIcons(message, idRoom, isPrivate) {
    var room = isPrivate ? 'chat-private-' + idRoom : 'chat-public-' + idRoom;
    var $chat = $('#' + room);
    var icons = $chat.find("#message-" + message.id).find(".groupIcon");
    for (var i=0; i < icons.length; i++) {
        var icon = icons[i];
        var title = icon.getAttribute("title");
        var badge = custom_badges.find((badge) => badge.name == title);
        if (badge) {
            icon.src = getCustomBadgeURL(badge.icon);
        }
    }
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

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", () => {
    //console.log("CUSTOM BADGE HIGHJACK");
    utility.loadCSSFromGH("CustomChatBadges");
    var oldfn = window.appendMessage;
    window.appendMessage = (chatMessage, idRoom, isPrivate) => {
        processMessage(chatMessage);
        oldfn(chatMessage, idRoom, isPrivate);
        correctCustomIcons(chatMessage, idRoom, isPrivate);
    }

})

function getCustomBadgeURL(icon) {return `https://raw.githubusercontent.com/CMD-God/prettycards/master/img/ChatBadges/${icon}.png`;}

function getChatBadgeIcon(icon) {
    var customBadge = custom_badges.find((badge) => badge.icon == icon);
    if (customBadge) {
        return getCustomBadgeURL(icon);
    } else {
        return `images/${icon}.png`;
    }
}



//PrettyCards_plugin.events.on("preChat:getHistory preChat:getPrivateHistory", processChatHistoryEvent);
//PrettyCards_plugin.events.on("preChat:getMessage preChat:getPrivateMessage", processChatMessageEvent);

export {getChatBadgeIcon};