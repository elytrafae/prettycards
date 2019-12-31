
onPage("Decks", function() {
	var info = document.getElementById("soulInfo")
	AddSoulHover(info, info.getAttribute("data-soul"));
	var soulSelect = document.getElementById("selectSouls");
	soulSelect.addEventListener("change", function(e) {
		console.log("Event: ", e);
		document.querySelector("#soulInfo .PrettyCards_SoulHover").remove();
		AddSoulHover(info, info.getAttribute("data-soul"));
	})
})