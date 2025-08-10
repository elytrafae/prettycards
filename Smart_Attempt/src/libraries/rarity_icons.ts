
var rarityIconsHTML: {[extension:string]: {[rarity:string]: string}} = {};
const rarities = ["BASE", "COMMON", "RARE", "EPIC", "LEGENDARY", "DETERMINATION", "TOKEN"];
const extensions = ["BASE", "DELTARUNE", "UTY"];

function getUrlForIcon(extension: string, rarity: string) : string {
	return `/images/rarity/${extension}_${rarity}.png`;
}

function GenerateRarityIconHTML(extension: string, rarity: string) : string {
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

function preLoadIcons(): void {
	var element = document.createElement("DIV");
	element.style = "display: none;";
	document.body.appendChild(element);
	for (var ext in rarityIconsHTML) {
		var icons = rarityIconsHTML[ext];
		var html = "";
		for (var rarity in icons) {
			html += icons[rarity];
		}
		element.innerHTML = html;
	}
	setTimeout(function() {element.remove()}, 1000);
}

preLoadIcons();

export {rarityIconsHTML, rarities, extensions};
