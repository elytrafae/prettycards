
import {utility} from "/src/libraries/utility.js";

var allCardSkins = [];
var ownedCardSkins = [];
var defaultCardSkins = [];

$.get("CardSkinsConfig?action=shop", {}, function(data) {
	//console.log(data);
	allCardSkins = JSON.parse(data.cardSkins);
	//console.log(allCardSkins);
});

$.get("CardSkinsConfig?action=profile", {}, function(data) {
	//console.log(data);
	ownedCardSkins = JSON.parse(data.cardSkins);
	//console.log(ownedCardSkins);
});

if (!window.allCards || window.allCards.length == 0) {
	window.document.addEventListener("allCardsReady", function() {
		ProcessDefaultSkins();
	});
} else {
	ProcessDefaultSkins();
}

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@61cd42478251d9132f22bd84d53d450b083b7fd4/css/CardSkinSelector.css");

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
			name: "Default",
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
		this.includeDefault = true;
		this.onlyOwned = false;
		this.onlyAvailable = false;
		this.includeOnu = true;
		
		this.container = null;
		this.skinElements = [];
		this.skins = [];
		this.searchBar = null;
	}
	
	GetSkinsToDisplay() {
		var skinsToDisplay = [];
		if (this.includeDefault) {
			skinsToDisplay = skinsToDisplay.concat(defaultCardSkins);
		}
		var l = [];
		if (this.onlyOwned) {
			l = ownedCardSkins;
		} else {
			l = allCardSkins;
		}
		if (this.onlyAvailable) {
			for (var i=0; i < l.length; i++) {
				var skin = l[i];
				if (!skin.unavailable) {
					skinsToDisplay.push(skin);
				}
			}
		} else {
			skinsToDisplay = skinsToDisplay.concat(l);
		}
		if (this.includeOnu) {
			skinsToDisplay.push({
				active: true,
				authorName: "Onutrem",
				cardId: -1,
				cardName: "Onutrem",
				id: -1,
				image: "Onutrem",
				name: "Onutrem",
				owned: true,
				typeSkin: 0,
				ucpCost: 0,
				unavailable: false
			});
		}
		return skinsToDisplay;
	}
	
	GetHTML(skins) {
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
		
		for (var i=0; i < this.skins.length; i++) {
			const skin = this.skins[i];
			var div = document.createElement("DIV");
			div.className = "PrettyCards_SkinDiv";
			div.style.background = "url(images/cards/" + skin.image + ".png) no-repeat transparent";
			
			div.innerHTML = '<div class="PrettyCards_SkinText">' + skin.name + (skin.authorName !== "" ? '<br><span class="Artist">' + skin.authorName + '</span>' : '') + '</div>';
			if (skin.typeSkin > 0) {
				div.innerHTML += '<div class="PrettyCards_FullSkinPreview"><img src="images/cards/' + skin.image + '.png"></div>';
			}
			
			div.onclick = function() {
				this.callback(skin);
			}.bind(this);
			
			this.skinElements.push(div);
			skinsCont.appendChild(div);
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
		console.log("Filters!");
		for (var i=0; i < this.skinElements.length; i++) {
			//console.log(this.skinElements)
			this.skinElements[i].style.display = this.isRemoved(this.skins[i]) ? "none" : "";
		}
	}
	
	isRemoved(skin) {
		var searchValue = $(this.searchBar).val().toLowerCase();
		console.log("Search value:", searchValue);
		
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
			console.log(findableString, skin);
			
			return !findableString.toLowerCase().includes(searchValue);
		 }
		 return false;
	}
	
}

window.CardSkinSelector = CardSkinSelector;

export {CardSkinSelector};