
onPage("GamesList", function () {
	var soulSelect = document.getElementById("customDecks");
    var div = CustomizeSoulSelectObj(soulSelect, storage.getItem("customDeck"));
	div.style.display = "inline-block";
    //document.getElementById("soulInfo").style.display = "none";
})