
underscript.onPage("GamesList", function () {
	if (settings.replace_soul_selection.value()) {
		var soulSelect = document.getElementById("customDecks");
	  var div = CustomizeSoulSelectObj(soulSelect, localStorage.getItem("customDeck"), 3);
		div.style.display = "inline-block";
	}
    //document.getElementById("soulInfo").style.display = "none";
})
