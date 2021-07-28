
var cardSkins = [];
var frameName = "Undertale";

function FetchCardCosmeticsData() {
	$.get("https://undercards.net/CardSkinsConfig", {action: "profile"},function( data ) {
		cardSkins = JSON.parse(data.cardSkins);
		frameName = data.frameName;
		//console.log("Card Cosmetics data fetched!", data, cardSkins, frameName);
	});
}

function GetSuitableCardSkin(card_id) {
	for (var i=0; i < cardSkins.length; i++) {
		var skin = cardSkins[i];
		if (skin.cardId == card_id && skin.active) {
			return skin;
		}
	}
	return null;
}

function SetCosmeticsForCardData(card_data) {
	var skin = GetSuitableCardSkin(card_data.id);
	if (skin !== null) {
		card_data.image = skin.image;
		card_data.typeSkin = skin.typeSkin;
	}
	card_data.frameSkinName = frameName;
	return card_data;
}

FetchCardCosmeticsData();

export {SetCosmeticsForCardData};