
var soulCards = {};

window.soulInfo = function(soul_name) {
	var soulStringKey = 'soul-' + soul_name.replace('_', '-').toLowerCase();
    var soulDescStringKey = soulStringKey + '-desc';
    var name = $.i18n(soulStringKey);
	var desc = $.i18n(soulDescStringKey);
	
	console.log(name, desc);
	
	SoulPopUp();
}

function GetSoulCards() {
	soulCards = {};
	if (allCards) {
		if (allCards.length > 0) {
			for (var i=0; i < allCards.length; i++) {
				var card = allCards[i];
				if (card.soul) {
					if (!soulCards[card.soul.name]) {
						soulCards[card.soul.name] = [];
					}
					soulCards[card.soul.name].push(card);
				}
			}
			console.log("soulCards: ", soulCards);
		} else {
			console.log("Cards Not Fetched yet. Retry in 1 second.");
			setTimeout(GetSoulCards, 1000);
		}
	} else {
		console.log("This page does not handle cards!");
	}
}

GetSoulCards();

function SoulPopUp(id, name, desc) {
	
}

