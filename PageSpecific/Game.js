
/*
onPage("Game", function() {
    setTimeout( function() {
		var infos = FindAllByExistingAttribute("data-soul", "span");
        console.log(infos);
        for (var i=0; i < infos.length; i++) {
            var info = infos[i];
            AddSoulHover(info, info.getAttribute("data-soul"));
            AddSoulClick(info);
        }
    }, 12000);
})*/

onPage("Game", function() {
    setTimeout( function() {
		var info1 = document.getElementById("enemyUsername");
        console.log(info1);
        var info2 = document.getElementById("yourUsername");
        console.log(info2);
        AddSoulHover(info1, info1.getAttribute("data-soul"), 3);
        AddSoulClick(info1);
        AddSoulHover(info2, info2.getAttribute("data-soul"), 1);
        AddSoulClick(info2);
    }, 12000);
})