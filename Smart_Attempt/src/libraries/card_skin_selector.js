
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
		var cont = document.createElement("DIV");
		for (var i=0; i < skins.length; i++) {
			var skin = skins[i];
			var div = document.createElement("DIV");
			div.className = "PrettyCards_SkinDiv";
			div.style.background = "url(images/cards/" + skin.image + ".png) no-repeat transparent";
			
			div.innerHTML = '<div class="PrettyCards_SkinText">' + skin.name + (skin.authorName !== "" ? '<br><span class="Artist">' + skin.authorName + '</span>' : '') + '</div>';
			
			cont.appendChild(div);
		}
		return cont;
	}
	
	OpenDialogue() {
		var skins = this.GetSkinsToDisplay();
		var html = this.GetHTML(skins);
		BootstrapDialog.show({
			title: "Select a card skin!",
			size: BootstrapDialog.SIZE_WIDE,
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
	
}

window.CardSkinSelector = CardSkinSelector;

export {CardSkinSelector};