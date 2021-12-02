
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

function appendCardCustomCardSkin(skin, container) {
	
	var card = window.getCard(skin.cardId) || window.allCards[0];
	var $card = window.appendCard(card, container);
	
	$card.find(".cardImage").css("background-image", 'url("' + skin.image + '")');
	$card.find(".cardDesc").find("div").html(skin.name + '<br><span class="Artist">' + skin.authorName + '</span>');
	
	$card.click(DoCardClickAction);
	
	return $card;
}

function DoStuffWhenAllCardsAreReady() {
	for (var i=0; i < skins.length; i++) {
		var skin = skins[i];
		appendCardCustomCardSkin(skin, window.$("#PrettyCards_CardListContainer"));
	}
}

var deleteModeOn = false;

function EditCardSkinScreen(skin) {
	
	var container = document.createElement("DIV");
	container.id = "PrettyCards_CustomCardSkins_EditContainer";
	
	var col1 = document.createElement("DIV");
	col1.className = "PrettyCards_CustomCardSkins_EditColumn";
	var col2 = document.createElement("DIV");
	col2.className = "PrettyCards_CustomCardSkins_EditColumn";
	container.appendChild(col1);
	container.appendChild(col2);
	
	var p1 = document.createElement("P");
	p1.innerHTML = "Card Skin Name";
	p1.className = "PrettyCards_InvertedP";
	col1.appendChild(p1);
	
	var input1 = document.createElement("INPUT");
	input1.className = "form-control";
	input1.value = skin.name;
	input1.setAttribute("type", "text");
	col1.appendChild(input1);
	
	var p2 = document.createElement("P");
	p2.innerHTML = "Artist Name";
	p2.className = "PrettyCards_InvertedP";
	col1.appendChild(p2);
	
	var input2 = document.createElement("INPUT");
	input2.className = "form-control";
	input2.value = skin.authorName;
	input2.setAttribute("type", "text");
	col1.appendChild(input2);
	
	//console.log("size", window.BootstrapDialog.SIZE_LARGE);
	window.BootstrapDialog.show({
		title: "Edit Card Skin!",
		size: window.BootstrapDialog.SIZE_LARGE,
		message: container,
		//onshown: OnShow.bind(this),
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

function DoCardClickAction(e) {
	//console.log(e);
	var $card = $(e.currentTarget);
	//console.log($card);
	var index = Array.prototype.indexOf.call(document.getElementById("PrettyCards_CardListContainer").children, $card[0]);
	var skin = skins[index];
	console.log(skin);
	EditCardSkinScreen(skin);
}

function GetCustomCardSkinStorageIndex(index) {
	return "prettycards.custom_card_skin." + window.selfId + "." + index;
}

function GetCustomCardSkinFromLocalStorage(index) {
	var string = window.localStorage[GetCustomCardSkinStorageIndex(index)];
	if (!string) {
		return null;
	}
	return JSON.parse(string);
}

function GetCustomCardSkinsList() {
	var skins = [];
	var i = 0;
	var skin = GetCustomCardSkinFromLocalStorage(0);
	while (skin) {
		skin.storageId = i;
		skins[i] = skin;
		i++;
		skin = GetCustomCardSkinFromLocalStorage(i);
	}
	return skins;
}

var skins;
function InitCustomCardSkins() {
	ExecuteWhen("PrettyCards:onPageLoad PC_Chat:getSelfInfos", function () {
		window.$(".mainContent").html(`
			<div id="PrettyCards_CardSkinsTab" style="font-size: 2em; margin-bottom: 1em;">
				<button id="PrettyCards_CreateCustomCardSkinButton" class="brn btn-success">Create New</button>
				<button id="PrettyCards_DeleteCustomCardSkinButton" class="brn btn-danger">Delete</button>
			</div>
			<div id="PrettyCards_CardListContainer"></div>
		`);
		
		skins = GetCustomCardSkinsList();
		console.log("SKINS", skins);
		
		if (window.allCards && window.allCards.length > 0) {
			DoStuffWhenAllCardsAreReady();
		} else {
			window.document.addEventListener("allCardsReady", function() {
				DoStuffWhenAllCardsAreReady();
			});
		}
	});
}

export {InitCustomCardSkins};