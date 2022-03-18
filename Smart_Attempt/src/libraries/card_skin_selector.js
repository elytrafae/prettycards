
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {utility} from "/src/libraries/utility.js";

var allCardSkins = [];
var ownedCardSkins = [];
var notOwnedCardSkins = [];
var defaultCardSkins = [];
var customCardSkins = [];

var bonusBaseCards = ["Heal Delivery", "Explosion", "Sacrifice", "Same Fate", "Onutrem"];

var skinLists = [customCardSkins, defaultCardSkins, ownedCardSkins, notOwnedCardSkins];
var listNames = ["Custom Card Skins", "Default Card Skins", "Owned Card Skins", "Not Owned Card Skins"]

ExecuteWhen("PrettyCards:onPageLoad", function () {
	$.get("/CardSkinsConfig?action=shop", {}, function(data) {
		//console.log(data);
		allCardSkins = JSON.parse(data.cardSkins);
		ProcessCardSkinLists();
		//console.log(allCardSkins);
	});
	ExecuteWhen("Chat:Connected", function() {
		ProcessCustomCardSkins();
	});
});

/*
$.get("CardSkinsConfig?action=profile", {}, function(data) {
	//console.log(data);
	ownedCardSkins = JSON.parse(data.cardSkins);
	ProcessNotOwnedSkins();
	console.log("OWNED_CARD_SKINS:", ownedCardSkins);
});
*/

function ProcessCustomCardSkins() {
	var skin = window.localStorage["prettycards.custom_card_skin." + window.selfId + ".0"];
	var i = 0;
	while (typeof(skin) === "string") {
		//console.log("SKIN BEING ADDED: ", skin);
		customCardSkins.push(JSON.parse(skin));
		i++;
		skin = window.localStorage["prettycards.custom_card_skin." + window.selfId + "." + i];
	}
	skinLists[0] = customCardSkins;
	//console.log("CUSTOM CARD SKINS: ", customCardSkins);
}

function ProcessCardSkinLists() {
	for (var i=0; i < allCardSkins.length; i++) {
		var skin = allCardSkins[i];
		if (skin.owned) {
			ownedCardSkins.push(skin);
		} else {
			notOwnedCardSkins.push(skin);
		}
	}
	
	skinLists[2] = ownedCardSkins;
	//console.log("Not owned card skins: ", notOwnedCardSkins);
}

if (!window.allCards || window.allCards.length == 0) {
	window.document.addEventListener("allCardsReady", function() {
		ProcessDefaultSkins();
	});
} else {
	ProcessDefaultSkins();
}

utility.loadCSSFromGH("CardSkinSelector");

function ProcessDefaultSkins() {
	for (var i=0; i < allCards.length; i++) {
		var card = allCards[i];
		defaultCardSkins.push({
			active: true,
			authorName: "",
			cardId: card.id,
			cardName: card.name,
			id: -1,
			image: card.image,
			name: card.name,
			owned: true,
			typeSkin: 0,
			ucpCost: 0,
			unavailable: false
		});
	}
	for (var i=0; i < bonusBaseCards.length; i++) {
		var name = bonusBaseCards[i];
		defaultCardSkins.push({
			active: true,
			authorName: "",
			cardId: -1,
			cardName: name,
			id: -1,
			image: name.replaceAll(" ", "_"),
			name: name,
			owned: true,
			typeSkin: 0,
			ucpCost: 0,
			unavailable: false
		});
	}
	//console.log(defaultCardSkins);
}

class CardSkinSelector {
	
	constructor() {
		this.callback = function() {};
		
		this.container = null;
		this.skinElements = [];
		this.skins = [];
		this.searchBar = null;
	}
	
	GetSkinsToDisplay() {
		var skinsToDisplay = [];
		for (var i=0; i < skinLists.length; i++) {
			skinsToDisplay = skinsToDisplay.concat(skinLists[i]);
		}
		return skinsToDisplay;
	}
	
	GetHTML() {
		this.searchBar = document.createElement("INPUT");
		this.searchBar.className = "form-control";
		this.searchBar.setAttribute("type", "text");
		this.searchBar.placeholder = "Search . . .";
		console.log(this);
		$(this.searchBar).keyup(this.ApplyFilters.bind(this));
		
		var cont = document.createElement("DIV");
		
		cont.appendChild(this.searchBar);
		
		var skinsCont = document.createElement("DIV");
		skinsCont.className = "PrettyCards_SkinsContainer";
		cont.appendChild(skinsCont);
		
		for (var i=0; i < skinLists.length; i++) {
			var list = skinLists[i];
			//console.log("LIST ", i, list);
			
			var category_header = document.createElement("DIV");
			category_header.className = "PrettyCards_SkinHeader";
			category_header.innerHTML = listNames[i];
			
			const category_container = document.createElement("DIV");
			for (var j=0; j < list.length; j++) {
				const skin = list[j];
				var image = "images/cards/" + skin.image + ".png";
				if (skin.isCustom) {
					image = skin.image;
				}
				var div = document.createElement("DIV");
				div.className = "PrettyCards_SkinDiv";
				div.style.background = "url(" + image + ") no-repeat transparent";
				div.style.backgroundSize = "cover";
				
				div.innerHTML = '<div class="PrettyCards_SkinText">' + skin.name + (skin.authorName !== "" ? '<br><span class="Artist">' + skin.authorName + '</span>' : '') + '</div>';
				if (skin.typeSkin > 0) {
					div.innerHTML += '<div class="PrettyCards_FullSkinPreview"><img src="' + image + '"></div>';
				}
				
				div.onclick = function() {
					this.callback(skin);
				}.bind(this);
				
				this.skinElements.push(div);
				category_container.appendChild(div);
			}
			
			category_header.onclick = function() {
				$(category_container).toggle();
			}
			
			skinsCont.appendChild(category_header);
			skinsCont.appendChild(category_container);
		}
		
		this.container = cont;
		return cont;
	}
	
	OpenDialogue() {
		this.container = null;
		this.skinElements = [];
		this.skins = [];
		this.searchBar = null;
		
		this.skins = this.GetSkinsToDisplay();
		var html = this.GetHTML();
		this.dial = BootstrapDialog.show({
			title: "Select a card skin!",
			size: BootstrapDialog.SIZE_WIDE,
			closable: true,
            closeByBackdrop: false,
			message: html,
			buttons: [{
					label: "Nevermind!",
					cssClass: 'btn-primary us-normal',
					action(dialog) {
						dialog.close();
					}
				}
			]
		});
	}
	
	ApplyFilters() {
		//console.log("Filters!");
		for (var i=0; i < this.skinElements.length; i++) {
			//console.log(this.skinElements)
			this.skinElements[i].style.display = this.isRemoved(this.skins[i]) ? "none" : "";
		}
	}
	
	isRemoved(skin) {
		var searchValue = $(this.searchBar).val().toLowerCase();
		//console.log("Search value:", searchValue);
		
		 if (searchValue.length > 0) {
			var findableString = '';
			findableString += $.i18n('card-name-' + skin.cardId, 1);
			findableString += skin.name;
			findableString += skin.authorName;
			if (skin.typeSkin == 0) {
				findableString += "normal";
			} else if (skin.typeSkin == 1) {
				findableString += "full";
			} else if (skin.typeSkin == 2) {
				findableString += "breaking";
			}
			//findableString += skin.ucpCost;
			//console.log(findableString, skin);
			
			return !findableString.toLowerCase().includes(searchValue);
		 }
		 return false;
	}
	
}

window.CardSkinSelector = CardSkinSelector;

export {CardSkinSelector};
