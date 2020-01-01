
onPage("Play", function () {
	var soulSelect = document.getElementById("playDecks");
    var div = CustomizeSoulSelectObj(soulSelect, localStorage.getItem("playDeck"));
	div.style.display = "inline-block";
    //document.getElementById("soulInfo").style.display = "none";
})