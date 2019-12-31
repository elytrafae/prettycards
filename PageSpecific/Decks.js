
onPage("Decks", function() {
	var info = document.getElementById("soulInfo");
	setTimeout( function() {
		AddSoulHover(info, info.getAttribute("data-soul"));
        AddSoulClick(info);
	}, 1000);
	var soulSelect = document.getElementById("selectSouls");
	soulSelect.addEventListener("change", function(e) {
		//console.log("Event: ", e);
		document.querySelector("#soulInfo .PrettyCards_SoulHover").remove();
		AddSoulHover(info, info.getAttribute("data-soul"));
	})
})