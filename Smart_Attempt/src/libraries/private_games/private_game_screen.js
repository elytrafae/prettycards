
import {utility} from "/src/libraries/utility.js";
import {pagegetters} from "/src/libraries/page_getters.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {SoulSelector} from "/src/libraries/soul_selector.js";

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@1edf00a84189614e8030eb6637abf84316cee582/css/Souls.css");

var soulSelector = new SoulSelector();

function GetChallengeHTML(user) {
	return `
	<p>Game Name: </p><input id="PrettyCards_PrivateGameName" type="text" class="form-control" value="${"PrettyCardsCustom" + Math.floor(Math.random()*100)}"></input>
	<p>Invitees (separate names with ","): </p><input id="PrettyCards_PrivateGameRecipients" type="text" class="form-control" value="${ (!!user) ? user.username : ""}"></input>
	<label class="form-check-label"><input id="PrettyCards_PrivateGameEveryone" type="checkbox" class="form-check-input" ${(!user) ? "checked" : ""}></input> Challenge Everyone?</label>
	<p>Soul: ${soulSelector.SetUp("PrettyCards_ChallengeSoul_", "Normal")}</p>
`
}

function OnShow(dialog) {
	soulSelector.AddDeckTooltips();
}

var messageInfos = {};

function ChallengePlayerScreen(user, infos) {
	messageInfos = infos;
	BootstrapDialog.show({
		title: "Custom Challenge!",
		message: GetChallengeHTML(user),
		onshown: OnShow.bind(this),
		buttons: [{
				label: "Nevermind!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}, {
				label: "Send Challenge!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					var gameName = document.getElementById("PrettyCards_PrivateGameName").value;
					var recipients = document.getElementById("PrettyCards_PrivateGameEveryone").checked ? ["everyone"] : document.getElementById("PrettyCards_PrivateGameRecipients").value.split(",");
					for (var i=0; i < recipients.length; i++) {
						recipients[i] = recipients[i].trim();
					}
					if (recipients.length <= 0) {
						recipients = ["everyone"];
					}
					var soul = soulSelector.selectedSoul; // For testing purposes. Not ANYMORE!
					SendChallenge(gameName, recipients, soul);
				}
			}
		]
	});
}

function SendChallenge(gameName, recipients, soul) {
	sessionStorage.setItem("PrettyCards_PrivateGameIsHost", true);
	sessionStorage.setItem("PrettyCards_PrivateGameName", gameName);
	sessionStorage.setItem("PrettyCards_PrivateGameSoul", soul);
	sessionStorage.setItem("PrettyCards_PrivateGameRecipients", JSON.stringify(recipients));
	var message = "I challenge " + recipients.join(", ") + " to a CUSTOM game! via PrettyCards";
	if (messageInfos.idRoom > 0) {
		console.log("Public message: ", message, String(messageInfos.idRoom));
		window.sendMessage(message, String(messageInfos.idRoom));
	} else {
		console.log("Private message: ", message, String(messageInfos.user.id));
		window.sendPrivateMessage(message, String(messageInfos.user.id));
	}
	window.location = '/GamesList';
}

export {ChallengePlayerScreen};