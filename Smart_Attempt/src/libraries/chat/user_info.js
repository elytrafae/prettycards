
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";
import {rarityIconsHTML, rarities} from "/src/libraries/rarity_icons.js";
import {pagegetters} from "/src/libraries/page_getters.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

import {ChallengePlayerScreen} from "/src/libraries/private_games/private_game_screen.js";
import { translationManager } from "../translation/translation_manager";
import { getChatBadgeIcon, getCuteFaceForId } from "./custom_chat_badges";

window.PrettyCards_plugin = PrettyCards_plugin;

var $ = window.$;

/*
	Remaining Checklist:
	- Maybe get some more data to display. (IDEA: Challonge Tournaments)
	- Remember to update the CSS files at the end!
	
	Done:
	- Group wrapping fixed!
	- Shiny avatars fixed!
	- For some reason it does not work on private messages. Fixed!
	- Underscript: Right-Click, then Profile shows the default profile screen. Fixed by overriding getInfo.
	- Add Friend/Unfriend, Private Message, Spectate.
	- Added Admin controls.
	- Add Ignore/Unignore and Mention actions.
	- Show friendship leaderboard data!
*/

var leaderboard = [];
var $;
var oldGetInfo;

addSetting({
    'key': 'user_info',
    'name': 'Better User Info', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});

function friendshipShowUpdate(newVal, oldVal, $elements = $(".PrettyCards_UserInfo_FriendshipHideable")) {
	if (newVal) {
		$elements.removeClass("PrettyCards_Hidden");
	} else {
		$elements.addClass("PrettyCards_Hidden");
	}
}

var friendship_show_setting = addSetting({
    'key': 'user_info_friendship_show',
    'name': 'Show Friendship Data On User Info', // Name in settings page
	'note': 'Requires "Better User Info" to have any effect!',
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
	'onChange': friendshipShowUpdate,
	'hidden': true
});

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
	
	utility.loadCSSFromGH("UserInfo");
	utility.loadCSSFromGH("CustomFriendship");
	utility.loadCSSFromGH("FormExtensions");
	utility.loadCSSFromLink("/css/meters.css");
	//utility.loadCSSFromLink("/css/cards.css");
	//utility.loadCSSFromLink("/css/frames.css");
}

ExecuteWhen("PrettyCards:onPageLoad", onPageLoaded);

function sendUserInfoEvent(ele) {
	
	var infos = $(ele).data('infos');
	console.log(infos);
    var user = infos.user;
	//console.log(infos);
	
	const preEvenet = PrettyCards_plugin.events.emit("preChat:getInfo", {infos : infos, user : user}, true);
	if (!preEvenet.canceled) {
		oldGetInfo(ele);
		var popup = window.BootstrapDialog.dialogs[Object.keys(BootstrapDialog.dialogs)[0]];
		PrettyCards_plugin.events.emit("Chat:getInfo", {popup : popup, popupElement : popup.$modalDialog[0], infos : infos, user : user});
	}
}

PrettyCards_plugin.events.on("Chat:getInfo", function(data) {
	if (!settings.user_info.value()) {return;}
	console.log("Chat:getInfo ", data);
	var user = data.user;
	var header = data.popupElement.querySelector(".modal-header");
	var name_color = window.localStorage["prettycards.profile_skin_text_color." + window.selfId + "." + user.profileSkin.id] || "#FFFFFF";
	data.popup.$modalDialog[0].className = "modal-dialog modal-lg";
	
	header.className += " PrettyCards_UserHeader";
	header.style["background-image"] = "url(images/profiles/" + user.profileSkin.image + ".png)";
	
	var cutie_face = getCuteFaceForId(user.id);
	var cutieStr = "";
	if (cutie_face) {
		cutieStr = ` <span class="Cutie">(${cutie_face})</span>`;
	}

	var title = header.querySelector(".bootstrap-dialog-title");
	title.innerHTML += cutieStr;
	title.className += " PrettyCards_UserTitle";
	title.style.color = name_color;
	
	var footer = data.popupElement.querySelector(".bootstrap-dialog-footer-buttons");
	footer.style = "display: flex; justify-content: flex-end; align-items: center;";
	
	var color_picker = document.createElement("INPUT");
	color_picker.setAttribute("type", "color");
	color_picker.value = name_color;
	color_picker.style = "height: 32px; margin: 0px 4px;";
	color_picker.oninput = function(e) {
		//console.log(user);
		title.style.color = color_picker.value;
		window.localStorage["prettycards.profile_skin_text_color." + window.selfId + "." + user.profileSkin.id] = color_picker.value;
	}
	footer.prepend(color_picker);
	
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
			//icon.src = "images/" + group.icon + ".png";
			icon.src = getChatBadgeIcon(group.icon);
			icon.onerror = function (e) {e.target.style.display = "none";};
			icon.title = group.name;
			cont.appendChild(icon);
		}
		
		var text = document.createElement("SPAN");
		text.innerHTML = translationManager.getWithFallback("group-" + group.name.replace(" ", "_").toLowerCase(), group.name);
		text.className = group.name.replace(" ", "_");
		text.style.paddingRight = "15px";
		cont.appendChild(text);
	}
	column1.appendChild(groups);
	
	var lv = document.createElement("DIV");
	lv.innerHTML = window.$.i18n("stat-lv") + " " + user.level;
	lv.className = "PrettyCards_UserLV";
	column1.appendChild(lv);
	
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
			friendButton.innerHTML = '<span class="glyphicon glyphicon-user gray"></span> ' + window.$.i18n("pc-chat-friend-you");
			return;
		}
		friendButton.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-user"></span> ' + translationManager.getRandomFromValueList("pc-chat-friend-mystery") + "</span>";
	}
	
	function friendButtonFriend() {
		friendButton.innerHTML = '<span class="glyphicon glyphicon-user green"></span> ' + window.$.i18n("pc-chat-friend-add");
		friendButton.style.cursor = "pointer";
		friendButton.onclick = function() {
			$.post("/Friends", {username: user.username, addFriend: "Add friend"}, friendButtonUnfriend);
		};
	}
	
	function friendButtonUnfriend() {
		friendButton.innerHTML = '<span class="glyphicon glyphicon-user red"></span> ' + window.$.i18n("pc-chat-friend-remove");
		friendButton.style.cursor = "pointer";
		friendButton.onclick = unfriendConfirmation;
	}
	
	function unfriendConfirmation() {
		BootstrapDialog.show({
			title: window.$.i18n("pc-chat-unfriend-confirm-title", user.username),
			message: window.$.i18n("pc-chat-unfriend-confirm", user.username),
			buttons: [{
					label: window.$.i18n("pc-navigate-no"),
					cssClass: 'btn-primary us-normal',
					action(dialog) {
						dialog.close();
					}
				}, {
					label: window.$.i18n("pc-navigate-yes"), 
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
		ignoreContainer.innerHTML = '<span class="glyphicon glyphicon-volume-off red"></span> ' + (underscript.user.isIgnored(user) ? window.$.i18n("pc-chat-ignore-remove") : window.$.i18n("pc-chat-ignore-add"));
	}
	
	if (!pagegetters.IsMyself(user.id)) {
		UpdateIgnoreText();
		ignoreContainer.style.cursor = "pointer";
		ignoreContainer.onclick = function() {
			//console.log("IGNORING USER", user, underscript.user.isIgnored(user));
			if (underscript.user.isIgnored(user)) {
				underscript.user.unIgnore(user);
			} else {
				underscript.user.ignore(user);
			}
			UpdateIgnoreText();
		}
	} else {
		if (!demoniocEasterEgg) {
			ignoreContainer.innerHTML = '<span class="glyphicon glyphicon-volume-off gray"></span> ' + window.$.i18n("pc-chat-ignore-self");
		} else {
			ignoreContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-volume-off"></span> ' + translationManager.getRandomFromValueList("pc-chat-ignore-mystery") + "</span>";
		}
	}
	
	var privateMessageContainer = document.createElement("DIV");
	column1.appendChild(privateMessageContainer);
	if (!pagegetters.IsMyself(user.id) && (pagegetters.IsSelfMod() || pagegetters.IsMyFriend(user.id))) {
		privateMessageContainer.innerHTML = '<span class="glyphicon glyphicon-envelope yellow"></span> ' + window.$.i18n("pc-chat-pm-allowed");
		privateMessageContainer.style.cursor = "pointer";
		privateMessageContainer.onclick = function() {openPrivateRoom(user.id, user.username);}
	} else if (pagegetters.IsMyself(user.id)) {
		if (!demoniocEasterEgg) {
			privateMessageContainer.innerHTML = '<span class="glyphicon glyphicon-envelope gray"></span> ' + window.$.i18n("pc-chat-pm-self");
		} else {
			privateMessageContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-envelope"></span> ' + translationManager.getRandomFromValueList("pc-chat-pm-mystery") + "</span>";
		}
	} else {
		privateMessageContainer.innerHTML = '<span class="glyphicon glyphicon-envelope gray"></span> ' + window.$.i18n("pc-chat-pm-denied");
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
			spectateContainer.innerHTML = `<span class="glyphicon glyphicon-eye-open green"></span> ${window.$.i18n("pc-chat-spectate-match")}<br><a href="${game.player1.spectateLink}"><img src="images/souls/${game.player1.soul}.png"></img><span class="${game.player1.soul}"> ${game.player1.name}</span></a> ${window.$.i18n("pc-chat-spectate-separator")} 
<a href="${game.player2.spectateLink}"><img src="images/souls/${game.player2.soul}.png"></img><span class="${game.player2.soul}"> ${game.player2.name}</span></a>`;
		});
	} else if (pagegetters.IsMyself(user.id) && user.gameId > -1) {	
		if (!demoniocEasterEgg) {
			spectateContainer.innerHTML = '<span class="glyphicon glyphicon-eye-open gray"></span> ' + window.$.i18n("pc-chat-spectate-self");
		} else {
			spectateContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-eye-open"></span> ' + translationManager.getRandomFromValueList("pc-chat-spectate-mystery-match") + "</span>";
		}
	} else if (pagegetters.IsMyself(user.id)) {
		if (!demoniocEasterEgg) {
			spectateContainer.innerHTML = '<span class="glyphicon glyphicon-eye-open gray"></span> ' + window.$.i18n("pc-chat-spectate-self");
		} else {
			spectateContainer.innerHTML = '<span style="color:red"><span class="glyphicon glyphicon-eye-open"></span> ' + translationManager.getRandomFromValueList("pc-chat-spectate-mystery-idle") + "</span>";
		}
	} else {
		spectateContainer.innerHTML = '<span class="glyphicon glyphicon-eye-open gray"></span> ' + window.$.i18n("pc-chat-spectate-idle");
	}
	
	if (!pagegetters.IsMyself(user.id) && user.gameId <= -1) {
		var challengeContainer = document.createElement("DIV");
		challengeContainer.innerHTML = '<span class="glyphicon glyphicon-flash red"></span> ' + window.$.i18n("pc-chat-challenge-create");
		challengeContainer.style.cursor = "pointer";
		challengeContainer.onclick = function() {
			ChallengePlayerScreen(user, data.infos);
		};
		column1.appendChild(challengeContainer);
	}
	
	var modContainer = document.createElement("DIV");
	if (pagegetters.IsSelfMod() && !pagegetters.IsMyself(user.id)) {
		var times = {
			1 : '1 ' + window.$.i18n("pc-smalltime-sec", 1),
			30 : '30 ' + window.$.i18n("pc-smalltime-sec", 2),
			60 : '1 ' + window.$.i18n("pc-smalltime-min", 1),
			600 : '10 ' + window.$.i18n("pc-smalltime-min", 2),
			3600 : '1 ' + window.$.i18n("pc-smalltime-hour", 1),
			21600 : '6 ' + window.$.i18n("pc-smalltime-hour", 2),
			43200 : '12 ' + window.$.i18n("pc-smalltime-hour", 2),
			43200 : '1 day' + window.$.i18n("pc-smalltime-day", 1)
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
		
		var button = document.createElement("BUTTON");
		button.className = "btn btn-primary";
		button.innerHTML = window.$.i18n("pc-chat-mod-timeout");
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
		rank = "<div>" + window.$.i18n("pc-chat-ranked-rank") + ": " + getRankedPositionHTML(rankNr) + "</div>";
	}
	
	//console.log("USER", user);
	var wins = "<div>" + window.$.i18n("pc-chat-ranked-wins") + ": " + user.winsRanked + "</div>";
	var losses = "<div>" + window.$.i18n("pc-chat-ranked-losses") + ": " + user.lossesRanked + "</div>";
	var winrate = "<div>" + window.$.i18n("pc-chat-ranked-winrate") + ": " + (Math.floor((user.winsRanked / (user.winsRanked + user.lossesRanked))*10000) / 100) + "%</div>";
	var winstreak = "<div>" + window.$.i18n("pc-chat-ranked-winstreak") + ": " + user.winStreak + "</div>";
	column2.innerHTML += rank + wins + losses + winrate + winstreak;
	/////////////

	// Another set of rows
	var row2 = document.createElement("DIV");
	row2.className = "row";
	
	var column3 = document.createElement("DIV");
	column3.className = "double_column PrettyCards_UserColumn";
	row2.appendChild(column3);
	
	/*
	var column4 = document.createElement("DIV");
	column4.className = "column PrettyCards_UserColumn";
	row2.appendChild(column4);
	*/
	
	message.appendChild(row2);
	//////////////////////

	// Friendship Stuff
	var friendshipContainer = document.createElement("DIV");
	friendshipContainer.className = "PrettyCards_ChatFriendshipContainer PrettyCards_UserInfo_FriendshipHideable";
	friendshipContainer.innerHTML = `<h2 class='gray'>${window.$.i18n("pc-chat-friendship-fetching")}</h2>`;

	var titleCont = document.createElement("DIV");
	titleCont.id = "PrettyCards_UserInfo_FriendshipTitleContainer";

	var titleText = document.createElement("H2");
	titleText.innerHTML = window.$.i18n("pc-chat-friendship-title");
	titleText.className = "PrettyCards_UserInfo_FriendshipTitleText";
	titleCont.appendChild(titleText);

	column3.appendChild(titleCont);
	column3.appendChild(friendshipContainer);

	utility.getFriendshipInfo(user.id, function(data) {
		friendshipContainer.innerHTML = "";

		titleText.onclick = () => {
			var newVal = !friendship_show_setting.value();
			friendship_show_setting.set(newVal, !newVal);
		};

		var $swapSortBtn = $(`
		<div style="display:flex;" id="PrettyCards_UserInfo_SwapSortArea" class="PrettyCards_UserInfo_FriendshipHideable">
			<label class="form-check-label" for="PrettyCards_UserInfo_SwapSortBtn">${window.$.i18n("pc-chat-friendship-sortxp")}</label>
			<label class="form_switch friendshipSortSwitch">
				<input type="checkbox" id="PrettyCards_UserInfo_SwapSortBtn">
				<span class="slider round"></span>
			</label>
			<label class="form-check-label" for="PrettyCards_UserInfo_SwapSortBtn">${window.$.i18n("pc-chat-friendship-sortrank")}</label>
		</div>`);
		$(titleCont).append($swapSortBtn);
		
		var $input = $swapSortBtn.find("#PrettyCards_UserInfo_SwapSortBtn");
		$input.change(function() {
			updateSortAndDisplay(data.scores, $(friendshipContainer), $input);
		})

		updateSortAndDisplay(data.scores, $(friendshipContainer), $input);
		
		var lastFetched = document.createElement("P");
		lastFetched.className = "PrettyCards_UserInfo_FriendshipHideable gray";
		var date = new Date(data.lastUpdated);
		lastFetched.innerHTML = `${window.$.i18n("pc-chat-friendship-fetchedat")}: ${date.toUTCString()}`;
		column3.appendChild(lastFetched);

		friendshipShowUpdate(friendship_show_setting.value(), friendship_show_setting.value(), $(column3).find(".PrettyCards_UserInfo_FriendshipHideable"));
	}).fail(function() {
		friendshipContainer.innerHTML = `<p class='red'>${window.$.i18n("pc-chat-friendship-fail")}</p>`; 
	});


	/////////////////////
	
});

var xpSort = function(a, b) {return b.xp - a.xp};
var rankSort = function(a, b) {return a.rank - b.rank};
function updateSortAndDisplay(scores, parent, $input) {
	if (!$input.prop("checked")) {
		sortAndDisplay(scores, parent, xpSort);
	} else {
		sortAndDisplay(scores, parent, rankSort);
	}
}

function sortAndDisplay(scores, parent, sort) {
	scores.sort(sort);
	parent.empty();
	for (var i=0; i < Math.min(8, scores.length); i++) {
		var score = scores[i];
		appendFriendshipCard(score, parent, 0);
	}
}

function appendFriendshipCard(score, container, topType = 1) {
	
	var topTxt;
	switch (topType) {
		case 1: topTxt = "TOP XP"; break;
		case 2: topTxt = "TOP RANK"; break;
		case 3: topTxt = "TOP XP & RANK"; break;
	}
	
	var level = window.getLevel(score.xp);
	var card = utility.appendCardFriendship(window.getCard(score.cardId), container, level, score.xp - utility.getXpForLevel(level - 1), window.distanceNextLevel(level));
	if (topTxt) {
		card.append('<div class="PrettyCards_FriendshipTop">' + topTxt + '</div>');
	}
	card.append(`<div class="PrettyCards_FriendshipRank"${score.rank <= 5 ? ' top' : ''} val="${score.rank}"></div>`);
	card.off("click");
	card.find('.cardDesc').empty();
	return card;
}

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
		return rarityIconsHTML.DELTARUNE.DETERMINATION + " " + window.$.i18n("pc-chat-ranked-first");
	}
	if (rankNr == 2) {
		return rarityIconsHTML.DELTARUNE.LEGENDARY + " " + window.$.i18n("pc-chat-ranked-second");
	}
	if (rankNr == 3) {
		return rarityIconsHTML.DELTARUNE.EPIC + " " + window.$.i18n("pc-chat-ranked-third");
	}
	if (rankNr == 4) {
		return rarityIconsHTML.DELTARUNE.RARE + " " + window.$.i18n("pc-chat-ranked-fourth");
	}
	if (rankNr == 5) {
		return rarityIconsHTML.DELTARUNE.COMMON + " " + window.$.i18n("pc-chat-ranked-fifth");
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
	//console.log(fabricatedMessage);
	window.appendMessage(fabricatedMessage, 1, false);
	var eventData = {chatMessage : JSON.stringify(fabricatedMessage), room : "chat-public-1"};
	processChatMessageEvent(eventData);
}

window.sendMessageAsPositionInRanked = sendMessageAsPositionInRanked;

export {};