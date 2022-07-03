
import { PrettyCards_plugin } from "./underscript_checker";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {utility} from "/src/libraries/utility.js";
import {returnHDImageIfThereIs} from "/src/libraries/card_modifyers/hd_card_skins.js";

var allCardSkins = [];
var ownedCardSkins = [];
var notOwnedCardSkins = [];
var defaultCardSkins = [];
var customCardSkins = [];
var aprilFools2022 = [];

var bonusBaseCards = ["Heal Delivery", "Explosion", "Sacrifice", "Same Fate", "Onutrem"];

var skinLists = [customCardSkins, defaultCardSkins, ownedCardSkins, notOwnedCardSkins, aprilFools2022];
var listNames = ["pc-skinselect-header-custom", "pc-skinselect-header-default", "pc-skinselect-header-owned", "pc-skinselect-header-notowned", ["pc-skinselect-header-april", 2022, 69]]

function processHeaderTranslations() {
	listNames.forEach((e, i) => {
		if (typeof(e) == "string") {
			listNames[i] = window.$.i18n(e);
		} else {
			listNames[i] = window.$.i18n(e[0], e[1], e[2]);
		}
	})
} 

/*
$.get("CardSkinsConfig?action=profile", {}, function(data) {
	//console.log(data);
	ownedCardSkins = JSON.parse(data.cardSkins);
	ProcessNotOwnedSkins();
	//console.log("OWNED_CARD_SKINS:", ownedCardSkins);
});
*/

function ProcessAprilFools2022Skins(data) {
	for (var i=0; i < data.length; i++) {
		var id = data[i];
		var card = window.getCard(id);
		aprilFools2022.push({
			active: false,
			authorName: "???",
			cardId: card.id,
			cardName: card.name,
			id: -69,
			image: `https://github.com/CMD-God/prettycards/raw/856f490c607fdd90d54e82143d0b696da6e27bde/img/Cards/April_Fools_2022/${card.image}.png`,
			name: window.$.i18n("pc-skinselect-skinname-april", 2022, window.$.i18n(`card-name-${card.id}`)),
			owned: true,
			typeSkin: 0,
			ucpCost: 69420,
			unavailable: false,
			isCustom: true
		});
	}
}

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
			name: window.$.i18n(`card-name-${card.id}`),
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

var alreadyLoading = false;
function loadAllCardSkins() { // This function is called whenever a feature requests this, so it doesn't load on pages it doesn't need to.
	if (alreadyLoading) {return;}
	alreadyLoading = true;
	ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function () {
		$.get("/CardSkinsConfig?action=shop", {}, function(data) {
			//console.log(data);
			allCardSkins = JSON.parse(data.cardSkins);
			ProcessCardSkinLists();
			//console.log(allCardSkins);
		});
		ExecuteWhen("Chat:Connected", function() {
			ProcessCustomCardSkins();
		});
		$.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/50f69f27a249d843792aedc5139d60fc9b178b23/json/aprilFools2022.json", {}, function(data) {
			ProcessAprilFools2022Skins(data);
		})

		processHeaderTranslations();
	});

	PrettyCards_plugin.events.on("allCardsReady", ProcessDefaultSkins);
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
		this.searchBar.placeholder = window.$.i18n("pc-skinselect-search");
		//console.log(this);
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
				var image = returnHDImageIfThereIs(skin.image);
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
			title: window.$.i18n("pc-skinselect-title"),
			size: BootstrapDialog.SIZE_WIDE,
			closable: true,
            closeByBackdrop: false,
			message: html,
			buttons: [{
					label: window.$.i18n("pc-navigate-nevermind"),
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

export {CardSkinSelector, allCardSkins, loadAllCardSkins};
