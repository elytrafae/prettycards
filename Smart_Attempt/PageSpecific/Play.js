console.log("PrettyCards: Playing");
var mainCont = document.getElementsByClassName("mainContent")[0];
//console.log(mainCont);

var gameModesMenu = document.getElementById("phase1");

var origGMCont = document.getElementById("gameModes");

var newCont = document.createElement("DIV");

// Images + text are 0-2, 3-5 is the functional things!
var origGameModes = document.querySelectorAll("#gameModes td");
//console.log(origGameModes);

var gameModeBTNs = document.querySelectorAll("#gameModes .btn");
//console.log(gameModeBTNs);


// New Casual Mode Thingy
var casualArts = document.getElementsByClassName("standardSoulArtifacts");
//console.log(casualArts);

var casual = document.createElement("table");
casual.style = "width: 100%; height: 10em; background-color:black; border: 2px solid white; margin-bottom: 1em;";

var cr = document.createElement("tr");
casual.appendChild(cr);

var c1 = document.createElement("td");
c1.style = "width: 34%; height: 100%; display: inline-block; text-align: center; background-image: url(../images/deltaruneEvent.png);";
c1.innerHTML = '<h2 data-i18n="[html]game-type-standard">STANDARD</h2>';
cr.appendChild(c1);

var c2 = document.createElement("td");
c2.style = "width: 33%; height: 100%; padding: 1em 2.2em; text-align: center; display: inline-block;";
cr.appendChild(c2);

var c3 = document.createElement("td");
c3.style = "width: 33%; height: 100%; padding: 1em; text-align: center; display: inline-block;";
cr.appendChild(c3);

c2.appendChild(document.getElementById("standardDecks"));
for (var i=(casualArts.length-1); i >= 0; i--) {
	var art = casualArts[i];
	var art_childs = Array.from(art.children);
	art.innerHTML = "";
	//console.log(art_childs);
	for (var k=0; k < art_childs.length; k++) {
		art.appendChild(art_childs[k]);
		var s = document.createElement("span");
		s.style.color = (art_childs[k].getAttribute("legendary") === "true" ? "yellow" : "white");
		s.style["margin-left"] = "0.5em";
		s.innerHTML = art_childs[k].name;
		art.appendChild(s);
		art.appendChild(document.createElement("br"));
	}
	art.style["margin-top"] = "1em";
	c2.appendChild(art);
}
gameModeBTNs[0].style["margin-top"] = "2.8em";
gameModeBTNs[0].style.height = "2.8em";
c3.appendChild(gameModeBTNs[0]);

newCont.appendChild(casual);

// New Ranked Mode Thingy
var rankedArts = document.getElementsByClassName("rankedSoulArtifacts");

var ranked = document.createElement("table");
ranked.style = "width: 100%; height: 10em; background-color:black; border: 2px solid white; margin-bottom: 1em;";

var rr = document.createElement("tr");
ranked.appendChild(rr);

var r3 = document.createElement("td");
r3.style = "width: 33%; height: 100%; display: inline-block; text-align: center; padding: 1emtext-align: center;";
r3.appendChild(document.querySelectorAll("#rankedMode h3")[0]);
rr.appendChild(r3);

var r2 = document.createElement("td");
r2.style = "width: 33%; height: 100%; padding: 1em 2.2em; text-align: center; display: inline-block;";
rr.appendChild(r2);

var r1 = document.createElement("td");
r1.style = "width: 34%; height: 100%; padding: 1em; text-align: center; display: inline-block;  background-image: url(../images/ranked.png);";
r1.innerHTML = '<h2 data-i18n="[html]game-type-ranked">RANKED</h2><br><a href="rewards.jsp" data-i18n="[html]play-rewards">End of season rewards</a>';
rr.appendChild(r1);

r2.appendChild(document.getElementById("rankedDecks"));
for (var i=(rankedArts.length-1); i >= 0; i--) {
	var art = rankedArts[i];
	var art_childs = Array.from(art.children);
	art.innerHTML = "";
	//console.log(art_childs);
	for (var k=0; k < art_childs.length; k++) {
		art.appendChild(art_childs[k]);
		var s = document.createElement("span");
		s.style.color = (art_childs[k].getAttribute("legendary") === "true" ? "yellow" : "white");
		s.style["margin-left"] = "0.5em";
		s.innerHTML = art_childs[k].name;
		art.appendChild(s);
		art.appendChild(document.createElement("br"));
	}
	art.style["margin-top"] = "1em";
	r2.appendChild(art);
}
gameModeBTNs[1].style["margin-top"] = "1em";
gameModeBTNs[1].style.height = "2.8em";
r3.appendChild(gameModeBTNs[1]);
newCont.appendChild(ranked);

// New Custom Mode Thingy
var custom = document.createElement("table");
custom.style = "width: 100%; height: 10em; background-color:black; border: 2px solid white; margin-bottom: 1em;";

var cur = document.createElement("tr");
custom.appendChild(cur);

var cu1 = document.createElement("td");
cu1.style = "width: 34%; height: 100%; display: inline-block; text-align: center; background-image: url(../images/custom.png);";
cu1.innerHTML = '<h2 data-i18n="[html]game-type-custom">CUSTOM</h2>';
cur.appendChild(cu1);

var cu2 = document.createElement("td");
cu2.style = "width: 66%; height: 100%; padding: 1em 2.2em; text-align: center; display: inline-block;";
cur.appendChild(cu2);

gameModeBTNs[2].style["margin-top"] = "2.8em";
gameModeBTNs[2].style.height = "2.8em";
cu2.appendChild(gameModeBTNs[2]);
newCont.appendChild(custom);

// Delete and Place
gameModesMenu.innerHTML = '';
gameModesMenu.appendChild(newCont);
