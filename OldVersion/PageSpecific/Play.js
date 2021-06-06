
underscript.onPage("Play", function () {
	console.log(settings.replace_soul_selection.value());
	if (settings.replace_soul_selection.value()) {
		var soulSelect = document.getElementById("playDecks");
	  var div = CustomizeSoulSelectObj(soulSelect, localStorage.getItem("playDeck"), 3);
		div.style.display = "inline-block";
	}
    //document.getElementById("soulInfo").style.display = "none";
})
