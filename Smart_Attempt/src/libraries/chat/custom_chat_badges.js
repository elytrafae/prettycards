import { utility } from "../utility";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

const PC_CONTRIB_BADGE = {
    id: 222,
    priority: 10,
    name: "PrettyCards_Contributor",
    icon: "PC_Contrib"
}

const BADGE_999 = {
    id: 999,
    priority: 15,
    name: "Overachiever",
    icon: "Overachiever"
}

const BADGE_9999 = {
    id: 9999,
    priority: 15,
    name: "Grassless",
    icon: "Grassless"
}

const CUTIE = {
    id: 277,
    priority: 16,
    name: "Cutie",
    icon: "Cutie"
}

var chatRoleUserData = {};
var custom_badges = [PC_CONTRIB_BADGE, BADGE_999, BADGE_9999, CUTIE];

function processMessage(message) {
    var user = message.user;
    if (user.pc_touched) {
        return;
    }
    user.pc_touched = true;
    if (findInChatBadgeList(user.id, "pc_contributor")) {
        user.groups.push(PC_CONTRIB_BADGE);
        if (user.mainGroup.priority >= 8) { // Only set this as the main group if the previous main group is Tester or worse.
            var oldMain = user.groups.find((group) => group.id === user.mainGroup.id);
            if (oldMain) {
                oldMain.priority = 10;
            }
            user.mainGroup = PC_CONTRIB_BADGE;
        }
        
    }
    if (user.level >= 9999) {
        user.groups.push(BADGE_9999);
    } else if (user.level >= 999) {
        user.groups.push(BADGE_999);
    }
    if (findInChatBadgeList(user.id, "cutie")) {
        user.groups.push(CUTIE);
    }
    user.groups.sort((a, b) => a.priority - b.priority);
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

$.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/customChatRoles.json", {}, function(data) {
    chatRoleUserData = data;
    PrettyCards_plugin.events.emit.singleton("PrettyCards:customChatRolesData", chatRoleUserData);
})

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

function findInChatBadgeList(userId, listName) {
    //console.log(chatRoleUserData, chatRoleUserData[listName]);
    if (!chatRoleUserData[listName]) {
        return false;
    }
    return chatRoleUserData[listName].find((u) => {return u.id === userId});
}

function getCuteFaceForId(id) {
    var badge = findInChatBadgeList(id, "cutie");
    if (badge) {
        return badge.face;
    }
    return null;
}

//PrettyCards_plugin.events.on("preChat:getHistory preChat:getPrivateHistory", processChatHistoryEvent);
//PrettyCards_plugin.events.on("preChat:getMessage preChat:getPrivateMessage", processChatMessageEvent);

export {getChatBadgeIcon, getCuteFaceForId};