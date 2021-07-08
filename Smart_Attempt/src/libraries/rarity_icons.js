
var rarityIconsHTML = {};
var rarities = ["BASE", "COMMON", "RARE", "EPIC", "LEGENDARY", "DETERMINATION", "TOKEN"];
var extensions = ["BASE", "DELTARUNE"];

function GenerateRarityIconHTML(extension, rarity) {
	return `<img src="images/rarity/${extension}_${rarity}.png" title="${rarity}">`;
}

for (var i=0; i < extensions.length; i++) {
	var extension = extensions[i];
	rarityIconsHTML[extension] = {};
	for (var j=0; j < rarities.length; j++) {
		var rarity = rarities[j];
		rarityIconsHTML[extension][rarity] = GenerateRarityIconHTML(extension, rarity);
	}
}

export {rarityIconsHTML, rarities};