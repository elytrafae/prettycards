
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";
import {rarityIconsHTML, rarities} from "/src/libraries/rarity_icons.js";
import {pagegetters} from "/src/libraries/page_getters.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

import {ChallengePlayerScreen} from "/src/libraries/private_games/private_game_screen.js";

window.PrettyCards_plugin = PrettyCards_plugin;

var $ = window.$;

/*
	Remaining Checklist:
	- Add Ignore/Unignore and Mention actions.
	- Maybe get some more data to display? (Friendship would be very nice, but it would put a HUGE strain on both the server and the client.)
	- Remember to update the CSS files at the end!
	
	Done:
	- Group wrapping fixed!
	- Shiny avatars fixed!
	- For some reason it does not work on private messages. Fixed!
	- Underscript: Right-Click, then Profile shows the default profile screen. Fixed by overriding getInfo.
	- Add Friend/Unfriend, Private Message, Spectate.
	- Added Admin controls.
*/

var leaderboard = [];
var $;
var oldGetInfo;

function getRankedLeaderboard() {
	window.$.get("Leaderboard?action=ranked", function(e) {
		//console.log(JSON.parse(e.leaderboard));
		leaderboard = JSON.parse(e.leaderboard);
	});
}

ExecuteWhen("PrettyCards:onPageLoad", getRankedLeaderboard);

function onPageLoaded() {
	oldGetInfo = window.getInfo;
	window.getInfo = sendUserInfoEvent;
	$ = window.$;
	
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@3327dc099073de91a57d9a1b4a1ce28a473d8587/css/UserInfo.css");
	utility.loadCSSFromLink("https://undercards.net/css/meters.css");
}

ExecuteWhen("PrettyCards:onPageLoad", onPageLoaded);

function sendUserInfoEvent(ele) {
	
	var infos = $(ele).data('infos');
    var user = infos.user;
	//console.log(infos);
	
	const preEvenet = PrettyCards_plugin.events.emit("preChat:getInfo", {infos : infos, user : user}, true);
	if (!preEvenet.canceled) {
		oldGetInfo(ele);
		var popup = window.BootstrapDialog.dialogs[Object.keys(BootstrapDialog.dialogs)[0]];
		PrettyCards_plugin.events.emit("Chat:getInfo", {popup : popup, popupElement : popup.$modalDialog[0], infos : infos, user : user});
	}
}

/*
// The User Info itself is redirected to overriding the getInfo function. This section is for noting which chat is every message in.
function processChatMessageHTML(ele, msg) {
	console.log("HTML Chat message: ", ele, msg);
	if (!ele) {
		console.log("Message received in a chat room you are not currently in. Returning.");
		return;
	}
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
PrettyCards_plugin.events.on("Chat:getPrivateHistory", processChatHistoryEvent);
PrettyCards_plugin.events.on("Chat:getPrivateMessage", processChatMessageEvent);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

PrettyCards_plugin.events.on("Chat:getInfo", function(data) {
	//console.log("Chat:getInfo ", data);
	var user = data.user;
	var header = data.popupElement.querySelector(".modal-header");
	data.popup.$modalDialog[0].className = "modal-dialog modal-lg";
	
	header.className += " PrettyCards_UserHeader";
	header.style["background-image"] = "url(images/profiles/" + user.profileSkin.image + ".png)";
	
	var title = header.querySelector(".bootstrap-dialog-title");
	title.className += " PrettyCards_UserTitle";
	
	var pfp = data.popupElement.querySelector(".avatar"); // The style pixels all assume the PFP size is the default 64x64
	pfp.className += " PrettyCards_UserProfilePic";
	header.appendChild(pfp);
	
	if (user.shinyAvatar) {
		header.appendChild(data.popupElement.querySelector(".rainbowAvatar"));
	}
	
	// Body setup
	var message = data.popupElement.querySelector(".bootstrap-dialog-message");
	message.innerHTML = "";
	
	var row = document.createElement("DIV");
	row.className = "row";
	
	var column1 = document.createElement("DIV");
	column1.className = "column PrettyCards_UserColumn";
	row.appendChild(column1);
	
	var column2 = document.createElement("DIV");
	column2.className = "column PrettyCards_UserColumn";
	row.appendChild(column2);
	
	message.appendChild(row);
	/////////////
	
	var demoniocEasterEgg = Math.random() <= 0.022;
	
	// Column 1
	var groups = document.createElement("DIV");
	groups.className = "PrettyCards_UserGroups";
	groups.innerHTML = "Groups: ";
	for (var i=0; i < user.groups.length; i++) {
		var group = user.groups[i];
		var cont = document.createElement("SPAN");
		cont.className = "PrettyCards_UserGroupContainer";
		groups.appendChild(cont);
		
		if (group.icon) {
			var icon = document.createElement("IMG");
			icon.src = "images/" + group.icon + ".png";
			icon.onerror = function (e) {e.target.style.display = "none";};
			icon.title = group.name;
			cont.appendChild(icon);
		}
		
		var text = document.createElement("SPAN");
		text.innerHTML = group.name;
		text.className = group.name.replace(" ", "_");
		text.style.paddingRight = "15px";
		cont.appendChild(text);
	}
	column1.appendChild(groups);
	
	var lv = document.createElement("DIV");
	lv.innerHTML = window.$.i18n("stat-lv") + " " + user.level;
	lv.className = "PrettyCards_UserLV";
	column1.appendChild(lv);
	
	var ignoreButton = document.createElement("DIV");
	
	var friendButton = document.createElement("DIV");
	column1.appendChild(friendButton);
	if (!pagegetters.IsMyself(user.id) && !pagegetters.IsMyFriend(user.id)) {
		friendButtonFriend();
	} else if (pagegetters.IsMyself(user.id)) {
		friendButtonYou();
	} else {
		friendButtonUnfriend();
	}
	
	function friendButtonYou() {
		if (!demoniocEasterEgg) {
			friendButton.innerHTML = '<span class="glyphicon glyphicon-user gray"></span> Can\'t friend yourself.';
			return;
		}
		var friendButtonMessages = [
			"It's you.",
			"Aren't you your own best friend~?",
			"I wonder if one betrays themself before their friends do . . .",
			"Do you even trust youself as much as your friends?",
			"Having only yourself by your side is possible one of the worst prisons.",
			"I wonder if you can friend your imaginary friends . . ."
		];
		friendButton.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-user"></span> ' + friendButtonMessages[Math.floor(Math.random() * friendButtonMessages.length)] + "</span>";
	}
	
	function friendButtonFriend() {
		friendButton.innerHTML = '<span class="glyphicon glyphicon-user green"></span> Add Friend!';
		friendButton.style.cursor = "pointer";
		friendButton.onclick = function() {
			$.post("/Friends", {username: user.username, addFriend: "Add friend"}, friendButtonUnfriend);
		};
	}
	
	function friendButtonUnfriend() {
		friendButton.innerHTML = '<span class="glyphicon glyphicon-user red"></span> Unfriend';
		friendButton.style.cursor = "pointer";
		friendButton.onclick = unfriendConfirmation;
	}
	
	function unfriendConfirmation() {
		BootstrapDialog.show({
			title: "Unfriend " + user.username + "?",
			message: "Do you really wish to unfriend " + user.username + "?",
			buttons: [{
					label: "No!",
					cssClass: 'btn-primary us-normal',
					action(dialog) {
						dialog.close();
					}
				}, {
					label: "Yes!",
					cssClass: 'btn-danger us-normal',
					action(dialog) {
						$.get("/Friends?delete=" + user.id, {}, friendButtonFriend());
						dialog.close();
					}
				}
			]
		});
	}
	
	var ignoreContainer = document.createElement("DIV");
	column1.appendChild(ignoreContainer);
	
	function UpdateIgnoreText() {
		ignoreContainer.innerHTML = '<span class="glyphicon glyphicon-volume-off red"></span> ' + (underscript.user.isIgnored(user) ? "Unignore" : "Ignore");
	}
	
	if (!pagegetters.IsMyself(user.id)) {
		UpdateIgnoreText();
		ignoreContainer.style.cursor = "pointer";
		ignoreContainer.onclick = function() {
			console.log("IGNORING USER", user, underscript.user.isIgnored(user));
			if (underscript.user.isIgnored(user)) {
				underscript.user.unIgnore(user);
			} else {
				underscript.user.ignore(user);
			}
			UpdateIgnoreText();
		}
	} else {
		if (!demoniocEasterEgg) {
			ignoreContainer.innerHTML = '<span class="glyphicon glyphicon-volume-off gray"></span> Can\'t ignore yourself!';
		} else {
			var ignoreButtonMessages = [
				"Believe me, I tried doing this a lot . . .",
				"You don't even like yourself, huh?",
				"You will always find a way to harrass yourself anyway."
			];
			ignoreContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-volume-off"></span> ' + ignoreButtonMessages[Math.floor(Math.random() * ignoreButtonMessages.length)] + "</span>";
		}
	}
	
	var privateMessageContainer = document.createElement("DIV");
	column1.appendChild(privateMessageContainer);
	if (!pagegetters.IsMyself(user.id) && (pagegetters.IsSelfMod() || pagegetters.IsMyFriend(user.id))) {
		privateMessageContainer.innerHTML = '<span class="glyphicon glyphicon-envelope yellow"></span> Private Message';
		privateMessageContainer.style.cursor = "pointer";
		privateMessageContainer.onclick = function() {openPrivateRoom(user.id, user.username);}
	} else if (pagegetters.IsMyself(user.id)) {
		if (!demoniocEasterEgg) {
			privateMessageContainer.innerHTML = '<span class="glyphicon glyphicon-envelope gray"></span> Can\'t private message yourself!';
		} else {
			var privateMessageButtonMessages = [
				"Your internal monologue should probably stay in your head.",
				"A notebook would be a better place to keep your thoughts.",
				"Messaging yourself would be pointless, wouldn't it?"
			];
			privateMessageContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-envelope"></span> ' + privateMessageButtonMessages[Math.floor(Math.random() * privateMessageButtonMessages.length)] + "</span>";
		}
	} else {
		privateMessageContainer.innerHTML = '<span class="glyphicon glyphicon-envelope gray"></span> Can\'t private message this user!';
	}
	
	const spectateContainer = document.createElement("DIV");
	column1.appendChild(spectateContainer);
	if (!pagegetters.IsMyself(user.id) && user.gameId > -1) {
		pagegetters.GetActiveMatchForId(user.gameId, function (game) {
			if (game.player2.id === user.id) {
				var p1 = game.player1;
				game.player1 = game.player2;
				game.player2 = p1;
			}
			spectateContainer.innerHTML = `<span class="glyphicon glyphicon-eye-open green"></span> Now in a match:<br><a href="${game.player1.spectateLink}"><img src="images/souls/${game.player1.soul}.png"></img><span class="${game.player1.soul}"> ${game.player1.name}</span></a> VS 
<a href="${game.player2.spectateLink}"><img src="images/souls/${game.player2.soul}.png"></img><span class="${game.player2.soul}"> ${game.player2.name}</span></a>`;
		});
	} else if (pagegetters.IsMyself(user.id) && user.gameId > -1) {	
		if (!demoniocEasterEgg) {
			spectateContainer.innerHTML = '<span class="glyphicon glyphicon-eye-open gray"></span> Can\'t spectate yourself!';
		} else {
			var spectateButtonMessages = [
				"You shouldn't spectate yourself.",
				"You should pay attention to the game instead of looking at yourself.",
				"Don't just sit by looking at yourself! Play the game!"
			];
			spectateContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-eye-open"></span> ' + spectateButtonMessages[Math.floor(Math.random() * spectateButtonMessages.length)] + "</span>";
		}
	} else if (pagegetters.IsMyself(user.id)) {
		if (!demoniocEasterEgg) {
			spectateContainer.innerHTML = '<span class="glyphicon glyphicon-eye-open gray"></span> Can\'t spectate yourself.';
		} else {
			var spectateButtonMessages = [
				"You shouldn't spectate yourself, anyway.",
				"Spectate others, not yourself."
			];
			spectateContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-eye-open"></span> ' + spectateButtonMessages[Math.floor(Math.random() * spectateButtonMessages.length)] + "</span>";
		}
	} else {
		spectateContainer.innerHTML = '<span class="glyphicon glyphicon-eye-open gray"></span> This player is not in a match.';
	}
	
	if (!pagegetters.IsMyself(user.id) && user.gameId <= -1) {
		var challengeContainer = document.createElement("DIV");
		challengeContainer.innerHTML = '<span class="glyphicon glyphicon-flash red"></span> Challenge!';
		challengeContainer.style.cursor = "pointer";
		challengeContainer.onclick = function() {
			ChallengePlayerScreen(user, data.infos);
		};
		column1.appendChild(challengeContainer);
	}
	
	var modContainer = document.createElement("DIV");
	if (pagegetters.IsSelfMod() && !pagegetters.IsMyself(user.id)) {
		var times = {
			1 : '1 sec',
			30 : '30 sec',
			60 : '1 min',
			600 : '10 min',
			3600 : '1 hour',
			21600 : '6 hours',
			43200 : '12 hours',
			43200 : '1 day'
		}
		modContainer.innerHTML = '<span class="glyphicon glyphicon-volume-off gray"></span> ' + window.$.i18n('chat-time-out-user') + ' ';
		
		var input = document.createElement("INPUT");
		input.setAttribute("type", "text");
		input.id = "PrettyCards_Timeout";
		input.style = "display:inline; width: 110px; margin-right: 15px;";
		input.setAttribute( "list", "PrettyCards_TimeoutList");
		
		input.onchange = function() {
			for (var sec in times) {
				if (times[sec] == this.value) {
					this.value = sec;
					break;
				}
			}
		}
		
		var dataList = document.createElement("DATALIST");
		dataList.id = "PrettyCards_TimeoutList";
		for (var sec in times) {
			dataList.innerHTML += '<option value="' + times[sec] + '"></option>';
		}
		//dataList.innerHTML += '<option value="-1"><input type="number"></input></option>';
		
		/*
		var select = document.createElement("SELECT");
		select.id = "PrettyCards_Timeout";
		for (var sec in times) {
			select.innerHTML += '<option value="' + sec + '">' + times[sec] + '</option>';
		}
		select.innerHTML += '<option value="-1"><input type="number"></input></option>';
		*/
		
		var button = document.createElement("BUTTON"); //<button class="btn btn-primary" onclick="">Timeout!</button>
		button.className = "btn btn-primary";
		button.innerHTML = "Timeout!";
		button.onclick = function() {
			var val = $('#PrettyCards_Timeout').val();
			for (var sec in times) {
				if (times[sec] == val) {
					val = sec;
					break;
				}
			}
			//console.log("timeout", String(user.id), val);
			window.timeout(String(user.id), val);
		}
		modContainer.appendChild(input);
		modContainer.appendChild(button);
		modContainer.appendChild(dataList);
	}
	column1.appendChild(modContainer);
	/////////////
	
	// Column 2
	column2.innerHTML += window.$.i18n('{{DIVISION:' + user.division + '}}');
	var progress = '<span style="font-size: 20px;" class="rainbowText">' + user.eloRanked + '</span>';
    if (user.division !== "LEGEND") {
        progress = '  <progress max="25" value="' + (user.eloRanked % 25) + '" class="' + getRank(user.division) + 'Bar" style="width: 150px;"></progress> <span>(' + user.eloRanked + ')</span>';
    }
	column2.innerHTML += progress;
	
	var rankNr = getRankedPosition(user);
	var rank = "";
	if (rankNr > -1) {
		rank = "<div>Rank: " + getRankedPositionHTML(rankNr) + "</div>";
	}
	
	var wins = "<div>Wins: " + user.winsRanked + "</div>";
	var losses = "<div>Losses: " + user.lossesRanked + "</div>";
	var winrate = "<div>Win/Loss Ratio: " + (Math.floor((user.winsRanked / user.lossesRanked)*100) / 100) + "</div>";
	var winstreak = "<div>Winstreak: " + user.winStreak + "</div>";
	column2.innerHTML += rank + wins + losses + winrate + winstreak;
	/////////////
	
});

function getRankedPosition(user) {
	if (leaderboard.length <= 0) {
		return -1;
	}
	for (var i=0; i < leaderboard.length; i++) {
		if (user.id === leaderboard[i].id) {
			return i+1;
		}
	}
	return -1;
}

function getRankedPositionHTML(rankNr) {
	if (rankNr == 1) {
		return rarityIconsHTML.DELTARUNE.DETERMINATION + " First Place!";
	}
	if (rankNr == 2) {
		return rarityIconsHTML.DELTARUNE.LEGENDARY + " Second Place!";
	}
	if (rankNr == 3) {
		return rarityIconsHTML.DELTARUNE.EPIC + " Third Place!";
	}
	if (rankNr == 4) {
		return rarityIconsHTML.DELTARUNE.RARE + " Fourth Place!";
	}
	if (rankNr == 5) {
		return rarityIconsHTML.DELTARUNE.COMMON + " Fifth Place!";
	}
	return rankNr;
}

// Copied from Undercards itself because it is not present on all pages.
function getRank(string) {
    return string.substring(0, string.indexOf('_'));
}

// Test Function
function sendMessageAsPositionInRanked(pos) {
	var user = leaderboard[pos-1];
	user.mainGroup = {
		id: 10,
		name: "User",
		priority: 13
	}
	user.groups = [user.mainGroup];
	user.profileSkin = {
		id: 34,
		image: "Charas_Rush",
		name: "Charas Rush",
		ucpCost: 400
	}
	
	var fabricatedMessage = {
		deleted : false,
		id: 100000,
		idRoom: 1,
		me: false,
		message: "I am high on leaderboard!!!!!!",
		rainbow: true,
		user: leaderboard[pos-1]
	}
	console.log(fabricatedMessage);
	window.appendMessage(fabricatedMessage, 1, false);
	var eventData = {chatMessage : JSON.stringify(fabricatedMessage), room : "chat-public-1"};
	processChatMessageEvent(eventData);
}

window.sendMessageAsPositionInRanked = sendMessageAsPositionInRanked;

export {};