
onPage("Game", function() {
	var infos = document.querySelectorAll("[data-soul]");
	console.log(infos);
	for (int i=0; i < infos.length; i++) {
		var info = infos[i];
		setTimeout( function() {
			AddSoulHover(info, info.getAttribute("data-soul"));
			AddSoulClick(info);
		}, 12000);
	}
})