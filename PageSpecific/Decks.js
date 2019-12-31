
onPage("Decks", function() {
	var info = document.getElementById("soulInfo");
	setTimeout( function() {
		AddSoulHover(info, info.getAttribute("data-soul"));
	}, 500);
	var soulSelect = document.getElementById("selectSouls");
	soulSelect.addEventListener("change", function(e) {
		//console.log("Event: ", e);
		document.querySelector("#soulInfo .PrettyCards_SoulHover").remove();
		AddSoulHover(info, info.getAttribute("data-soul"));
	})
})