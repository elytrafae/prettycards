
onPage("GamesList", function () {
	var soulSelect = document.getElementById("customDecks");
    var div = CustomizeSoulSelectObj(soulSelect, localStorage.getItem("customDeck"));
	div.style.display = "inline-block";
    //document.getElementById("soulInfo").style.display = "none";
})