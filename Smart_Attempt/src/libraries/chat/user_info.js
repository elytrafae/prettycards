
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@c77e027d77f453bc8e074950d1261f1dce67553b/css/UserInfo.css");
window.PrettyCards_plugin = PrettyCards_plugin;

function sendUserInfoEvent(e) {
	
	var infos = $(e.target).data('infos');
    var user = infos.user;
	
	const preEvenet = PrettyCards_plugin.events.emit("preChat:getInfo", {infos : infos, user : user}, true);
	if (!preEvenet.canceled) {
		window.getInfo(e.target);
		var popup = window.BootstrapDialog.dialogs[Object.keys(BootstrapDialog.dialogs)[0]];
		PrettyCards_plugin.events.emit("Chat:getInfo", {popup : popup, popupElement : popup.$modalDialog[0], infos : infos, user : user});
	}
}

function processChatMessageHTML(ele, msg) {
	console.log("HTML Chat message: ", ele, msg);
	if (!ele) {
		console.log("Message received in a chat room you are not currently in. Returning.");
		return;
	}
	var user_span = ele.querySelector(".chat-user");
	user_span.onclick = sendUserInfoEvent;
}

function processChatMessageEvent(data) {
	console.log("New chat message: ", data);
	processChatMessageHTML(document.querySelector("#" + data.room + " .message-group:last-of-type"), JSON.parse(data.chatMessage));
}

function processChatHistoryEvent(data) {
	console.log("Chat History: ", data);
	var messages = JSON.parse(data.history);
	var elements = document.querySelectorAll("#" + data.room + " .message-group");
	for (var i=0; i < messages.length; i++) {
		processChatMessageHTML(elements[i], messages[i]);
	}
}

PrettyCards_plugin.events.on("Chat:getHistory", processChatHistoryEvent);
PrettyCards_plugin.events.on("Chat:getMessage", processChatMessageEvent);


PrettyCards_plugin.events.on("Chat:getInfo", function(data) {
	console.log("Chat:getInfo ", data);
	var header = data.popupElement.querySelector(".modal-header");
	data.popup.$modalDialog[0].className = "modal-dialog modal-lg";
	
	header.className += " PrettyCards_UserHeader";
	header.style["background-image"] = "url(images/profiles/" + data.user.profileSkin.image + ".png)";
	
	var title = header.querySelector(".bootstrap-dialog-title");
	title.className += " PrettyCards_UserTitle";
	
	var pfp = data.popupElement.querySelector(".avatar"); // The style pixels all assume the PFP size is the default 64x64
	pfp.className += " PrettyCards_UserProfilePic";
	header.appendChild(pfp);
	
	var message = data.popupElement.querySelector(".bootstrap-dialog-message");
	message.innerHTML = "";
});

export {};