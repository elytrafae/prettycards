
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import { PrettyCards_plugin } from "../libraries/underscript_checker";

function appendCardCustomCardSkin(skin, container) {
	
	var card = utility.completeCopy(window.getCard(skin.cardId) || window.allCards[0]);
	console.log("TYPE SKIN", skin.typeSkin, typeof(skin.typeSkin));
	card.typeSkin = skin.typeSkin;
	var $card = window.appendCard(card, container);
	
	$card.find(".cardImage").css("background-image", 'url("' + skin.image + '")').css("background-size", "contain");
	$card.find(".cardDesc").find("div").html(skin.name + '<br><span class="Artist">' + skin.authorName + '</span>');
	
	$card.click(DoCardClickAction);
	
	return $card;
}

function ConstructSkinSelectionMenu() {
	var container = window.$("#PrettyCards_CardListContainer");
	container.html("");
	for (var i=0; i < skins.length; i++) {
		var skin = skins[i];
		appendCardCustomCardSkin(skin, container);
	}
}

function DoStuffWhenAllCardsAreReady() {
	card_options = GetOptionsWithCards();
	//console.log(card_options);
	ConstructSkinSelectionMenu();
}

var deleteModeOn = false;
function ToggleDeleteMode() {
	if (deleteModeOn) {
		// Disable Delete Mode
		$(".cardBackground").css("box-shadow", "");
		deleteModeOn = false;
		window.$("#PrettyCards_DeleteCustomCardSkinButton").html("Delete");
	} else {
		// Enable Delete Mode
		$(".cardBackground").css("box-shadow", "0px 0px 10px 6px rgba(255,0,0,0.8)");
		deleteModeOn = true;
		window.$("#PrettyCards_DeleteCustomCardSkinButton").html("Cancel");
	}
}

/*
var imageDataURL = "";
function uploadImageFile() {
	const preview = document.querySelector('img');
	const file = document.getElementById("PrettyCards_EditCardSkin_FileInput").files[0];
	const reader = new FileReader();

	reader.addEventListener("load", function () {
		// convert image file to base64 string
		//preview.src = reader.result;
		console.log("RESULT: ", reader.result);
		//window.open(reader.result);
		//document.getElementById("PrettyCards_EditCardSkin_ImageInput").value = reader.result;
		DeactivateInput(document.getElementById("PrettyCards_EditCardSkin_ImageInput"));
		imageDataURL = reader.result;
	}, false);

	if (file) {
		reader.readAsDataURL(file);
	}
}
*/

function GetOptionsWithCards() {
	var txt = "";
	for (var i=0; i < window.allCards.length; i++) {
		var card = window.allCards[i];
		txt = txt + '<option value="' + (card.fixedId || card.id) + '">' + card.name + '</option>'; 
	}
	return txt;
}

/*
function ActivateInput(input) {
	input.disabled = false;
	input.placeholder = "";
}

function DeactivateInput(input) {
	input.disabled = true;
	input.value = "";
	input.placeholder = "Image Uploaded . . .";
}*/

function DeleteCardSkin(skin) {
	for (var i = skin.storageId; i < skins.length-1; i++) {
		localStorage[GetCustomCardSkinStorageIndex(i)] = localStorage[GetCustomCardSkinStorageIndex(i+1)];
		skins[i+1].storageId--;
	}
	localStorage.removeItem(GetCustomCardSkinStorageIndex(skins.length-1));
	
	skins.splice(skin.storageId, 1);
	ToggleDeleteMode();
	ConstructSkinSelectionMenu();
}

function SaveCardSkin(index, name, authorName, typeSkin, cardId, image) {
	var skin = {
		active: false,
		authorName: authorName,
		cardId: cardId,
		cardName: window.getCard(cardId).name,
		id: -22,
		image: image,
		name: name,
		owned: true,
		typeSkin: typeSkin,
		ucpCost: -9999,
		isCustom: true,
		unavailable: true
	}
	
	localStorage[GetCustomCardSkinStorageIndex(index)] = JSON.stringify(skin);
	//localStorage[GetCustomCardSkinStorageIndex(index) + ".image"] = image;
	
	//skin.image = image;
	skin.storageId = index;
	skins[index] = skin;
	ConstructSkinSelectionMenu();
}

function CreateNewSkin() {
	if (deleteModeOn) {
		ToggleDeleteMode();
	}
	var skin = {
		active: false,
		authorName: window.selfUsername || "Unknown",
		cardId: 1,
		cardName: window.getCard(1).name,
		id: -22,
		image: "",
		name: "New Skin",
		owned: true,
		typeSkin: 0,
		ucpCost: -9999,
		isCustom: true,
		unavailable: true,
		storageId: skins.length
	}
	EditCardSkinScreen(skin);
}

function ImageHelpDialogue() {
	var message = '<h1>Why is a link needed instead of an uploaded image from my PC?</h1>' +
		'<p>Because localStorage, the place where I need to store things around here, has quite some strict policies with memory usage, and image data would most of the time take up all of the available space and more, causing a bunch of issues. So, instead, I settled with a method that is reliable and will always work.</p>' +
		'<h1>How do I get an image link?</h1>' +
		'<p>There are quite a lot of options out there host-wise, but what\'s important is that the link you type in is pointing towards the raw image. Nothing else, nothing more.</p>' +
		'<h1>How do I upload an image if I don\'t have a server of my own, or don\'t pay a host?</h1>' +
		'<p>You can use image sharing sites, or even <i>some</i> social media sites to do the hosting for you. I would personally recommend <a href="https://imgur.com/">Imgur</a>, as it\'s easy to upload an image there AND the compression is minimal. Discord is also a similarly excellent choice.</p>' +
		'<p>After uploading the image to your preferred "hosting service", right-click the image, then click "Copy Image Address" or "Copy Image Link". Then paste THAT into the Image Link input and you should be done. This should work ~90% of the time.</p>' +
		'<h1>I did what you said and it\'s still not working. What do I do?</h1>' +
		'<p>Contact me on Discord so we can sort this issue out, and potentially correct or expand upon this tutorial for others who may be struggling.</p>' +
		'<br>' +
		'<p class="gray">Thanks for reading! ^^</p>'+
		'<p class="gray">PS: The recommended resolutions: <br>Normal Skins: 160x90<br>Full Skins: 160x230<br>Breaking Skins: 176x246</p>';
	
	window.BootstrapDialog.show({
		title: "Image URL Help",
		size: window.BootstrapDialog.SIZE_WIDE,
		message: message,
		closable: true,
		//closeByBackdrop: false,
		//onshown: OnShow.bind(this),
		buttons: [{
				label: "Close!",
				cssClass: 'btn btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}
		]
	});
}

function EditCardSkinScreen(skin) {
	
	//imageDataURL = "";
	var container = document.createElement("DIV");
	container.id = "PrettyCards_CustomCardSkins_EditContainer";
	container.className = "PrettyCards_RowFlex";
	
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
	
	var p3 = document.createElement("P");
	p3.innerHTML = "Skin Type";
	p3.className = "PrettyCards_InvertedP";
	col1.appendChild(p3);
	
	var input3 = document.createElement("SELECT");
	input3.className = "form-control white";
	input3.innerHTML = `
		<option value="0">Normal</option>
		<option value="1">Full</option>
		<option value="2">Breaking</option>
	`;
	input3.value = skin.typeSkin;
	col1.appendChild(input3);
	
	var p4 = document.createElement("P");
	p4.innerHTML = "Card (Currently doesn't matter)";
	p4.className = "PrettyCards_InvertedP";
	col1.appendChild(p4);
	
	var input4 = document.createElement("SELECT");
	input4.className = "form-control white";
	input4.innerHTML = card_options;
	input4.value = skin.cardId;
	col1.appendChild(input4);
	
	var p5 = document.createElement("P");
	p5.innerHTML = "Image Link";
	p5.className = "PrettyCards_InvertedP";
	col1.appendChild(p5);
	
	var mini_cont = document.createElement("DIV");
	mini_cont.className = "PrettyCards_RowFlex";
	col1.appendChild(mini_cont);
	
	var input5 = document.createElement("INPUT");
	input5.className = "form-control";
	input5.id = "PrettyCards_EditCardSkin_ImageInput";
	//input5.setAttribute("maxlength", 999999);
	input5.value = skin.image;
	input5.setAttribute("type", "text");
	mini_cont.appendChild(input5);
	
	var input5_help = document.createElement("BUTTON");
	input5_help.className = "btn btn-primary";
	input5_help.innerHTML = '<span class="glyphicon glyphicon-question-sign"></span>';
	input5_help.onclick = ImageHelpDialogue;
	mini_cont.appendChild(input5_help);
	
	/*
	var mini_cont = document.createElement("DIV");
	mini_cont.className = "PrettyCards_RowFlex";
	col1.appendChild(mini_cont);
	
	if (skin.image.startsWith("data:")) {
		DeactivateInput(input5);
		imageDataURL = skin.image;
	} else {
		ActivateInput(input5);
		input5.value = skin.image;
	}
	
	var input5_file = document.createElement("INPUT");
	input5_file.className = "form-control white";
	input5_file.id = "PrettyCards_EditCardSkin_FileInput";
	input5_file.setAttribute("name", "PrettyCards_EditCardSkin_FileInput");
	input5_file.style = "display: none;";
	//input5.value = skin.cardId;
	input5_file.onchange = uploadImageFile;
	input5_file.setAttribute("accept", "image/*");
	input5_file.setAttribute("type", "file");
	mini_cont.appendChild(input5_file);
	
	var input5_label = document.createElement("BUTTON");
	input5_label.className = "btn btn-primary";
	//input5_label.setAttribute("for", "PrettyCards_EditCardSkin_FileInput");
	//input5_label.innerHTML = '<div class="btn btn-primary"><span class="glyphicon glyphicon-open-file"></span> Upload Image</div>';
	input5_label.innerHTML = '<span class="glyphicon glyphicon-open-file"></span> Upload File';
	input5_label.onclick = function() {input5_file.click();}
	mini_cont.appendChild(input5_label);
	
	var input5_cancel = document.createElement("BUTTON");
	input5_cancel.className = "btn btn-danger";
	input5_cancel.innerHTML = '<span class="glyphicon glyphicon-remove"></span> Clear File';
	input5_cancel.onclick = function() {imageDataURL = "";ActivateInput(input5);}
	mini_cont.appendChild(input5_cancel);
	*/
	//console.log("size", window.BootstrapDialog.SIZE_LARGE);
	window.BootstrapDialog.show({
		title: "Edit Card Skin!",
		size: window.BootstrapDialog.SIZE_LARGE,
		message: container,
		closable: true,
		closeByBackdrop: false,
		//onshown: OnShow.bind(this),
		buttons: [{
				label: "Cancel!",
				cssClass: 'btn btn-danger us-normal',
				action(dialog) {
					dialog.close();
				}
			},
			{
				label: "Save!",
				cssClass: 'btn btn-primary us-normal',
				action(dialog) {
					var image = input5.value;
					//if (image.length <= 0) {
					//	image = imageDataURL;
					//}
					SaveCardSkin(skin.storageId, input1.value, input2.value, Number(input3.value), Number(input4.value), image);
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
	if (deleteModeOn) {
		DeleteCardSkin(skin);
	} else {
		EditCardSkinScreen(skin);
	}
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

/*
function GetImageFromLocalStorage(index) {
	var string = window.localStorage[GetCustomCardSkinStorageIndex(index) + ".image"];
	if (!string) {
		return "";
	}
	return string;
}*/

function GetCustomCardSkinsList() {
	var skins = [];
	var i = 0;
	var skin = GetCustomCardSkinFromLocalStorage(0);
	while (skin) {
		skin.storageId = i;
		//skin.image = GetImageFromLocalStorage(i);
		skins[i] = skin;
		i++;
		skin = GetCustomCardSkinFromLocalStorage(i);
	}
	return skins;
}

var skins;
var card_options;
function InitCustomCardSkins() {
	console.log("ENTERED THING!");
	PrettyCards_plugin.events.on(":GuestMode", function() {
		console.log("I AM GUEST!");
		window.location.href = "/SignIn";
	});
	ExecuteWhen("PrettyCards:onPageLoad PC_Chat:getSelfInfos", function () {
		window.$("title").html("PrettyCards - Custom Card Skins");
		utility.loadCSSFromGH("CustomCardSkins");
		window.$(".mainContent").html(`
			<div id="PrettyCards_CardSkinsTab" style="font-size: 2em; margin-bottom: 1em;">
				<button id="PrettyCards_CreateCustomCardSkinButton" class="brn btn-success">Create New</button>
				<button id="PrettyCards_DeleteCustomCardSkinButton" class="brn btn-danger">Delete</button>
			</div>
			<div id="PrettyCards_CardListContainer"></div>
		`);
		
		window.$("#PrettyCards_CreateCustomCardSkinButton").click(CreateNewSkin);
		window.$("#PrettyCards_DeleteCustomCardSkinButton").click(ToggleDeleteMode);
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