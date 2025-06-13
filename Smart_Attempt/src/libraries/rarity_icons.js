import $ from "/src/third_party/jquery-3.6.0.min.js";

var rarityIconsHTML = {};
var rarities = ["BASE", "COMMON", "RARE", "EPIC", "LEGENDARY", "DETERMINATION", "TOKEN"];
var extensions = ["BASE", "DELTARUNE", "UTY"];

function getUrlForIcon(extension, rarity) {
	return `/images/rarity/${extension}_${rarity}.png`;
}

function GenerateRarityIconHTML(extension, rarity) {
	return `<img src="${getUrlForIcon(extension, rarity)}" title="${rarity}">`;
}

for (var i=0; i < extensions.length; i++) {
	var extension = extensions[i];
	rarityIconsHTML[extension] = {};
	for (var j=0; j < rarities.length; j++) {
		var rarity = rarities[j];
		rarityIconsHTML[extension][rarity] = GenerateRarityIconHTML(extension, rarity);
	}
}

function preLoadIcons() {
	var element = document.createElement("DIV");
	element.style = "display: none;";
	document.body.appendChild(element);
	for (var ext in rarityIconsHTML) {
		var icons = rarityIconsHTML[ext];
		for (var rarity in icons) {
			var img = $(icons[rarity]);
			element.appendChild(img[0]);
			//utility.preloadImage(getUrlForIcon(ext, rarity));
		}
	}
	setTimeout(function() {element.remove()}, 1000);
}

preLoadIcons();

export {rarityIconsHTML, rarities};
