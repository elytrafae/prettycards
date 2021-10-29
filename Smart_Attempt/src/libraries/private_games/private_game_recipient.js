
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";
import {rarityIconsHTML, rarities} from "/src/libraries/rarity_icons.js";
import {pagegetters} from "/src/libraries/page_getters.js";
import {SoulSelector} from "/src/libraries/soul_selector.js";
import {SavedDeckSelector, dummy_skin, onu_skin} from "/src/libraries/deck_selector.js";
import {DeckEditor} from "/src/libraries/deck_editor.js";

var custom_deck_sys = settings.override_decks.value();
var deckSelector = new SavedDeckSelector();

function processChatMessageHTML(ele, msg) {
	//console.log("HTML Chat message: ", ele, msg);
	if (!ele) {
		//console.log("Message received in a chat room you are not currently in. Returning.");
		return;
	}
	if (msg.message.startsWith('I challenge') && msg.message.endsWith("via PrettyCards")) {
		try {
			//var recipients = msg.message.split("I challenge ")[1].split(" to a CUSTOM game! via PrettyCards")[0].split(",");
			var recipients = msg.message.substring(12, msg.message.length - 34).split(", ");
			//console.log("Invitation!", recipients);
			//console.log($(ele).find(".chat-message"));
			
			if (msg.user.id === window.selfId) {
				$(ele).find(".chat-message").html('<span class="gray">* You sent an invitation to ' + recipients.join(', ') + '!</span>');
			} else if (recipients.includes("everyone") || recipients.includes(window.selfUsername)) {
				SoulSelector.ExecuteOnDeckLoad(function () {
					ele.style.backgroundColor = "black";
					$(ele).find(".chat-message").html("invited you to a CUSTOM game.");
				
					if (!custom_deck_sys) {
						var soulSelector = new SoulSelector();
						var soulContainer = document.createElement("SPAN");
						soulContainer.style = "white-space: nowrap;";
						soulContainer.innerHTML = soulSelector.SetUp("PrettyCards_ChallengeMessage_" + msg.id + "_", "Small");
						ele.appendChild(soulContainer);
						soulSelector.AddDeckTooltips();
					}
					
					var acceptButton = document.createElement("BUTTON");
					acceptButton.innerHTML = "Accept!";
					acceptButton.className = "btn btn-success PrettyCards_ChallengeMessageButton";
					if (custom_deck_sys) {
						acceptButton.onclick = function() {AcceptChallengeCustomDeck(msg.user.usernameSafe)};
					} else {
						acceptButton.onclick = function() {AcceptChallenge(msg.user.usernameSafe, soulSelector.selectedSoul)};
					}
					ele.appendChild(acceptButton);
				})
			} else {
				$(ele).find(".chat-message").html('<span class="gray">* Sent an invitation you cannot answer.</span>');
			}
		} catch (e) {
			// Do nothing.
			console.log("Error! ¯\_(ツ)_/¯", e);
		}
	}
}

function processChatMessageEvent(data) {
	//console.log("New chat message: ", data);
	processChatMessageHTML(document.querySelector("#" + data.room + " .message-group:last-of-type"), JSON.parse(data.chatMessage));
}

function processChatHistoryEvent(data) {
	//console.log("Chat History: ", data);
	var messages = JSON.parse(data.history);
	var elements = document.querySelectorAll("#" + data.room + " .message-group");
	for (var i=0; i < messages.length; i++) {
		processChatMessageHTML(elements[i], messages[i]);
	}
}

var latest_dial;

function SetUpDeckOnServer(deck, callback) {
	var toast = PrettyCards_plugin.toast(
		{
			title: "Please wait!",
			text: "Setting up the deck on the server . . .",
		}
	);
	DeckEditor.ImportDeck(deck, function(status) {
		if (toast.exists()) {
			toast.close();
		}
		if (status == "success") {
			//console.log("success");
			callback();
		} else {
			console.log("DeckEditor.ImportDeck error!");
		}
	})
}


function CloseDeckSelector() {
	latest_dial.close();
}

function AcceptChallengeCustomDeck(safeUserName) {
	function DeckSelectorCallback(deck) {
		CloseDeckSelector();
		SetUpDeckOnServer(deck, function() {AcceptChallenge( safeUserName, deck.soul);})
	}
	
	function OnShow() {
		deckSelector.AppendTo(latest_dial.$modalBody[0].firstChild.firstChild)
	}
	
	deckSelector.closable = false;
	deckSelector.closeCallback = CloseDeckSelector;
	deckSelector.callback = DeckSelectorCallback;
	
	latest_dial = window.BootstrapDialog.show({
		title: "Choose a deck!",
		size: window.BootstrapDialog.SIZE_LARGE,
		message: "",
		onshown: OnShow.bind(this),
		buttons: [{
				label: "Cancel!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}
		]
	});
}

function AcceptChallenge( safeUserName, soul) {
	sessionStorage.setItem("PrettyCards_PrivateGameIsHost", false);
	sessionStorage.setItem("PrettyCards_PrivateGameName", "PLACEHOLDER_SO_CODE_STARTS");
	sessionStorage.setItem("PrettyCards_PrivateGameSoul", soul);
	sessionStorage.setItem("PrettyCards_PrivateGameCreator", safeUserName);
	window.location = '/GamesList';
}

PrettyCards_plugin.events.on("Chat:getHistory", processChatHistoryEvent);
PrettyCards_plugin.events.on("Chat:getMessage", processChatMessageEvent);
PrettyCards_plugin.events.on("Chat:getPrivateHistory", processChatHistoryEvent);
PrettyCards_plugin.events.on("Chat:getPrivateMessage", processChatMessageEvent);

export {}