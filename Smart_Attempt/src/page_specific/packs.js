
import {rarityIconsHTML} from "./../libraries/rarity_icons.js";
import {pagegetters} from "./../libraries/page_getters.js";
import {PrettyCards_plugin, settings} from "./../libraries/underscript_checker.js";
import {utility} from "./../libraries/utility.js";

import {NormalPacksPage} from "./../libraries/packs_page_templates/normal.js";
import {WidePacksPage} from "./../libraries/packs_page_templates/wide.js";

import {StartOpenPackAnimation} from "./../libraries/pack_open_anim_manager.js";

var pagetemplates = [NormalPacksPage, WidePacksPage];

var settingsoptions = [];
var settingsnote = "Select the look of the Packs Page!";

for (var i=0; i < pagetemplates.length; i++) {
	settingsoptions[i] = pagetemplates[i].displayName;
	settingsnote += ("<br>" + pagetemplates[i].displayName + ": " + pagetemplates[i].description);
}

function GetPageTemplateByName(name) {
	for (var i=0; i < pagetemplates.length; i++) {
		if (pagetemplates[i].displayName == name) {
			return pagetemplates[i];
		}
	}
	return null;
}

function ChangeTemplate(newname, oldname) {
	GetPageTemplateByName(newname).generatePage(packs_data, packs_data2);
}

settings.packs_page_template = PrettyCards_plugin.settings().add({
	'key': 'packs_page_template', // key
	'name': 'Packs Page Template', // Name in settings page
	'type': 'select',
	'note': settingsnote, // Show note when hovering over setting
	'refresh': true, // true to add note "Will require you to refresh the page"
	//'disabled': boolean or `function(): boolean`, // true to disable setting
	'default': "Normal", // default value
	'options': settingsoptions, // Options for type 'select'
	'reset': true, // Adds a reset button (sets to default)
	'onChange': ChangeTemplate, // called when value is changed
});

//console.log("PageGetters", pagegetters);

var packs_data = [
	{
		g_cost : 100,
		ucp_cost : 10,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack",
		image_extension: ".png",
		name: "Undertale Pack",
		description: "Contains 4 random Undertale Cards.",
		code_id: "Pack", // Open command: open + ID, Buy G command: add + ID, Buy UCP command: add + ID + Ucp
		does_exist: true,
		g_buy_count: 1,
		ucp_buy_count: 1,
		open_count: 1
	},
	{
		g_cost : 100,
		ucp_cost : 10,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack",
		image_extension: ".png",
		name: "Deltarune Pack",
		description: "Contains 4 random Deltarune Cards.",
		code_id: "DRPack",
		does_exist: true,
		g_buy_count: 1,
		ucp_buy_count: 1,
		open_count: 1
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack",
		image_extension: ".png",
		name: "Shiny Pack",
		description: "Contains 4 random Shiny Cards.",
		code_id: "ShinyPack",
		does_exist: true,
		open_count: 1
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack",
		image_extension: ".png",
		name: "Super Pack",
		description: `Contains a random ${rarityIconsHTML.BASE.COMMON}/${rarityIconsHTML.DELTARUNE.COMMON}, ${rarityIconsHTML.BASE.RARE}/${rarityIconsHTML.DELTARUNE.RARE}, ${rarityIconsHTML.BASE.EPIC}/${rarityIconsHTML.DELTARUNE.EPIC} and ${rarityIconsHTML.BASE.LEGENDARY}/${rarityIconsHTML.DELTARUNE.LEGENDARY} card.`,
		code_id: "SuperPack",
		does_exist: true,
		open_count: 1
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack",
		image_extension: ".png",
		name: "Final Pack",
		description: `Contains a random ${rarityIconsHTML.BASE.RARE}/${rarityIconsHTML.DELTARUNE.RARE}, ${rarityIconsHTML.BASE.EPIC}/${rarityIconsHTML.DELTARUNE.EPIC}, ${rarityIconsHTML.BASE.LEGENDARY}/${rarityIconsHTML.DELTARUNE.LEGENDARY} and ${rarityIconsHTML.BASE.DETERMINATION}/${rarityIconsHTML.DELTARUNE.DETERMINATION} card.`,
		code_id: "FinalPack",
		does_exist: true,
		open_count: 1
	}
]

var packs_data2 = {}; // To ease id-based search of pack data.
for (var i=0; i < packs_data.length; i++) {
	var data = packs_data[i];
	data.amount = pagegetters.GetNumberOfPacks(data.code_id); // Appends how many packs of that kind does the user have to the pack data.
	data.image = data.image_without_extension + data.image_extension;
	packs_data2[data.code_id] = data;
}

function hideUglyPage() { // Nothing personal.
	var children = [...document.querySelector(".mainContent").children];
	//console.log(children);
	for (var i=0; i < children.length; i++) {
		var element = children[i];
		if (element.nodeName == "NAV" || element.nodeName == "FOOTER" || element.nodeName == "SCRIPT" || (element.nodeName == "TABLE" && element.id == "cardsOpen")) {
			continue;
		} else {
			element.style.display = "none";
		}
	}
}

function InitPacks() {
	
	hideUglyPage();
	document.querySelector(".mainContent").innerHTML += "<div id='PrettyCards_MainContent'></div><div id='PrettyCards_PackOpenContent'></div>";

	ChangeTemplate(settings.packs_page_template.value(), null);
	
	PrettyCards_plugin.events.on("openedPacks", function(a1, a2, a3) {console.log(a1, a2, a3)});
	
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@de615fe6531c76e89d8a92e642b41e2b1864ad2d/css/Packs.css");
	
	if (settings.debug_mode.value) {
		console.log("DEBUG mode activated!")
		var test_data = JSON.parse("[{\"attack\":5,\"hp\":6,\"maxHp\":6,\"originalAttack\":5,\"originalHp\":6,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":25,\"fixedId\":25,\"typeCard\":0,\"name\":\"Astigmatism\",\"image\":\"Astigmatism\",\"baseImage\":\"Astigmatism\",\"cost\":7,\"rarity\":\"COMMON\",\"originalCost\":7,\"target\":\"ALL\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":7,\"hp\":10,\"maxHp\":10,\"originalAttack\":7,\"originalHp\":10,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":38,\"fixedId\":38,\"typeCard\":0,\"name\":\"Royal Guard 1\",\"image\":\"Royal_Guard_1\",\"baseImage\":\"Royal_Guard_1\",\"cost\":9,\"rarity\":\"COMMON\",\"originalCost\":9,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"ROYAL_GUARD\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":1,\"hp\":2,\"maxHp\":2,\"originalAttack\":1,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":433,\"fixedId\":433,\"typeCard\":0,\"name\":\"Butterflies\",\"image\":\"Butterflies\",\"baseImage\":\"Butterflies\",\"cost\":1,\"rarity\":\"COMMON\",\"originalCost\":1,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":6,\"hp\":3,\"maxHp\":3,\"originalAttack\":6,\"originalHp\":3,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":101,\"fixedId\":101,\"typeCard\":0,\"name\":\"Nacarat Jester\",\"image\":\"Nacarat_Jester\",\"baseImage\":\"Nacarat_Jester\",\"cost\":5,\"rarity\":\"RARE\",\"originalCost\":5,\"target\":\"MONSTER\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":7,\"hp\":10,\"maxHp\":10,\"originalAttack\":7,\"originalHp\":10,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":38,\"fixedId\":38,\"typeCard\":0,\"name\":\"Royal Guard 1\",\"image\":\"Royal_Guard_1\",\"baseImage\":\"Royal_Guard_1\",\"cost\":9,\"rarity\":\"COMMON\",\"originalCost\":9,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"ROYAL_GUARD\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":2,\"maxHp\":2,\"originalAttack\":2,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":562,\"fixedId\":562,\"typeCard\":0,\"name\":\"Overlord Migosp\",\"image\":\"Overlord_Migosp\",\"baseImage\":\"Overlord_Migosp\",\"cost\":2,\"rarity\":\"COMMON\",\"originalCost\":2,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":2,\"maxHp\":2,\"originalAttack\":2,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":562,\"fixedId\":562,\"typeCard\":0,\"name\":\"Overlord Migosp\",\"image\":\"Overlord_Migosp\",\"baseImage\":\"Overlord_Migosp\",\"cost\":2,\"rarity\":\"COMMON\",\"originalCost\":2,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":5,\"maxHp\":5,\"originalAttack\":2,\"originalHp\":5,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":true,\"transparency\":false,\"candy\":false,\"id\":438,\"fixedId\":438,\"typeCard\":0,\"name\":\"Battleflies\",\"image\":\"Battleflies\",\"baseImage\":\"Battleflies\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":2,\"maxHp\":2,\"originalAttack\":3,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":147,\"fixedId\":147,\"typeCard\":0,\"name\":\"Fuku Fire\",\"image\":\"Burning_Spirit\",\"baseImage\":\"Fuku_Fire\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":5,\"maxHp\":5,\"originalAttack\":2,\"originalHp\":5,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":true,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":489,\"fixedId\":489,\"typeCard\":0,\"name\":\"Water Sausage\",\"image\":\"Water_Sausage\",\"baseImage\":\"Water_Sausage\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"PLANT\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":3,\"maxHp\":3,\"originalAttack\":3,\"originalHp\":3,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":186,\"fixedId\":186,\"typeCard\":0,\"name\":\"Trash Tornado\",\"image\":\"Trash_Tornado\",\"baseImage\":\"Trash_Tornado\",\"cost\":3,\"rarity\":\"RARE\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"soul\":{\"id\":6,\"name\":\"PATIENCE\"},\"id\":71,\"fixedId\":71,\"typeCard\":1,\"name\":\"Frozen Energy\",\"image\":\"Frozen_Energy\",\"baseImage\":\"Frozen_Energy\",\"cost\":2,\"rarity\":\"COMMON\",\"originalCost\":2,\"target\":\"MONSTER\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"soul\":{\"id\":7,\"name\":\"PERSEVERANCE\"},\"id\":134,\"fixedId\":134,\"typeCard\":1,\"name\":\"Spider Web\",\"image\":\"Spider_Web\",\"baseImage\":\"Spider_Web\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"target\":\"ENEMY_MONSTER\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":1,\"hp\":2,\"maxHp\":2,\"originalAttack\":1,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":223,\"fixedId\":223,\"typeCard\":0,\"name\":\"Yellow Snail\",\"image\":\"Yellow_Snail\",\"baseImage\":\"Yellow_Snail\",\"cost\":1,\"rarity\":\"COMMON\",\"originalCost\":1,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"SNAIL\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":3,\"maxHp\":3,\"originalAttack\":2,\"originalHp\":3,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":478,\"fixedId\":478,\"typeCard\":0,\"name\":\"Spider Bakery\",\"image\":\"Spider_Bakery\",\"baseImage\":\"Spider_Bakery\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"ARACHNID\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"soul\":{\"id\":3,\"name\":\"INTEGRITY\"},\"id\":82,\"fixedId\":82,\"typeCard\":1,\"name\":\"Break\",\"image\":\"Break\",\"baseImage\":\"Break\",\"cost\":0,\"rarity\":\"COMMON\",\"originalCost\":0,\"target\":\"ALLY_MONSTER\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":5,\"maxHp\":5,\"originalAttack\":3,\"originalHp\":5,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":405,\"fixedId\":405,\"typeCard\":0,\"name\":\"Telescope\",\"image\":\"Telescope\",\"baseImage\":\"Telescope\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":5,\"hp\":6,\"maxHp\":6,\"originalAttack\":5,\"originalHp\":6,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":403,\"fixedId\":403,\"typeCard\":0,\"name\":\"Jukebox\",\"image\":\"Jukebox\",\"baseImage\":\"Jukebox\",\"cost\":6,\"rarity\":\"COMMON\",\"originalCost\":6,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":1,\"hp\":2,\"maxHp\":2,\"originalAttack\":1,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":493,\"fixedId\":493,\"typeCard\":0,\"name\":\"Snail Bucket\",\"image\":\"Snail_Bucket\",\"baseImage\":\"Snail_Bucket\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":1,\"hp\":4,\"maxHp\":4,\"originalAttack\":1,\"originalHp\":4,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":404,\"fixedId\":404,\"typeCard\":0,\"name\":\"Shrine Mascot\",\"image\":\"Shrine_Mascot\",\"baseImage\":\"Shrine_Mascot\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":9,\"maxHp\":9,\"originalAttack\":2,\"originalHp\":9,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":165,\"fixedId\":165,\"typeCard\":0,\"name\":\"Oni\",\"image\":\"Oni\",\"baseImage\":\"Oni\",\"cost\":7,\"rarity\":\"COMMON\",\"originalCost\":7,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":6,\"maxHp\":6,\"originalAttack\":3,\"originalHp\":6,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":true,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":14,\"fixedId\":14,\"typeCard\":0,\"name\":\"Jerry\",\"image\":\"Jerry\",\"baseImage\":\"Jerry\",\"cost\":5,\"rarity\":\"COMMON\",\"originalCost\":5,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":5,\"hp\":4,\"maxHp\":4,\"originalAttack\":5,\"originalHp\":4,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":541,\"fixedId\":541,\"typeCard\":0,\"name\":\"Painting\",\"image\":\"Painting\",\"baseImage\":\"Painting\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"target\":\"ALLY_MONSTER\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":3,\"maxHp\":3,\"originalAttack\":2,\"originalHp\":3,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":244,\"fixedId\":244,\"typeCard\":0,\"name\":\"Fox Head\",\"image\":\"Fox_Head\",\"baseImage\":\"Fox_Head\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":2,\"maxHp\":2,\"originalAttack\":3,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":147,\"fixedId\":147,\"typeCard\":0,\"name\":\"Fuku Fire\",\"image\":\"Burning_Spirit\",\"baseImage\":\"Fuku_Fire\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":2,\"maxHp\":2,\"originalAttack\":2,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":166,\"fixedId\":166,\"typeCard\":0,\"name\":\"Crazy Bun\",\"image\":\"Crazy_Bun\",\"baseImage\":\"Crazy_Bun\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"soul\":{\"lives\":1,\"id\":2,\"name\":\"DETERMINATION\"},\"id\":67,\"fixedId\":67,\"typeCard\":1,\"name\":\"Resurrection\",\"image\":\"Resurrection\",\"baseImage\":\"Resurrection\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":6,\"maxHp\":6,\"originalAttack\":3,\"originalHp\":6,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":true,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":108,\"fixedId\":108,\"typeCard\":0,\"name\":\"Rock\",\"image\":\"Rock\",\"baseImage\":\"Rock\",\"cost\":6,\"rarity\":\"COMMON\",\"originalCost\":6,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":1,\"hp\":3,\"maxHp\":3,\"originalAttack\":1,\"originalHp\":3,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":true,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":401,\"fixedId\":401,\"typeCard\":0,\"name\":\"Certificate\",\"image\":\"Certificate\",\"baseImage\":\"Certificate\",\"cost\":2,\"rarity\":\"COMMON\",\"originalCost\":2,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":4,\"maxHp\":4,\"originalAttack\":2,\"originalHp\":4,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":125,\"fixedId\":125,\"typeCard\":0,\"name\":\"Heats Flamesman\",\"image\":\"Heats_Flamesman\",\"baseImage\":\"Heats_Flamesman\",\"cost\":4,\"rarity\":\"COMMON\",\"originalCost\":4,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":4,\"maxHp\":4,\"originalAttack\":2,\"originalHp\":4,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":420,\"fixedId\":420,\"typeCard\":0,\"name\":\"Spike Trap\",\"image\":\"Spike_Trap\",\"baseImage\":\"Spike_Trap\",\"cost\":3,\"rarity\":\"COMMON\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":5,\"hp\":9,\"maxHp\":9,\"originalAttack\":5,\"originalHp\":9,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":17,\"fixedId\":17,\"typeCard\":0,\"name\":\"Knight Knight\",\"image\":\"Knight_Knight\",\"baseImage\":\"Knight_Knight\",\"cost\":9,\"rarity\":\"COMMON\",\"originalCost\":9,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":2,\"maxHp\":2,\"originalAttack\":2,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":120,\"fixedId\":120,\"typeCard\":0,\"name\":\"G Follower 3\",\"image\":\"G_Follower_3\",\"baseImage\":\"G_Follower_3\",\"cost\":2,\"rarity\":\"COMMON\",\"originalCost\":2,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"G_FOLLOWER\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":1,\"maxHp\":1,\"originalAttack\":2,\"originalHp\":1,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":224,\"fixedId\":224,\"typeCard\":0,\"name\":\"Red Snail\",\"image\":\"Red_Snail\",\"baseImage\":\"Red_Snail\",\"cost\":1,\"rarity\":\"COMMON\",\"originalCost\":1,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"SNAIL\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":4,\"maxHp\":4,\"originalAttack\":2,\"originalHp\":4,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":149,\"fixedId\":149,\"typeCard\":0,\"name\":\"Dog House\",\"image\":\"Dog_House\",\"baseImage\":\"Dog_House\",\"cost\":3,\"rarity\":\"RARE\",\"originalCost\":3,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":3,\"hp\":5,\"maxHp\":5,\"originalAttack\":3,\"originalHp\":5,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":167,\"fixedId\":167,\"typeCard\":0,\"name\":\"Receptionist 1\",\"image\":\"Receptionist_1\",\"baseImage\":\"Receptionist_1\",\"cost\":5,\"rarity\":\"COMMON\",\"originalCost\":5,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":2,\"hp\":2,\"maxHp\":2,\"originalAttack\":2,\"originalHp\":2,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":false,\"candy\":false,\"id\":32,\"fixedId\":32,\"typeCard\":0,\"name\":\"Memory Head\",\"image\":\"Memory_Head\",\"baseImage\":\"Memory_Head\",\"cost\":2,\"rarity\":\"COMMON\",\"originalCost\":2,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"AMALGAMATE\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":4,\"hp\":6,\"maxHp\":6,\"originalAttack\":4,\"originalHp\":6,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":true,\"transparency\":false,\"candy\":false,\"id\":35,\"fixedId\":35,\"typeCard\":0,\"name\":\"Lemon Bread\",\"image\":\"Lemon_Bread\",\"baseImage\":\"Lemon_Bread\",\"cost\":6,\"rarity\":\"COMMON\",\"originalCost\":6,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[\"AMALGAMATE\",\"MOLD\"],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"attack\":4,\"hp\":7,\"maxHp\":7,\"originalAttack\":4,\"originalHp\":7,\"dodge\":0,\"armor\":false,\"paralyzed\":0,\"silence\":false,\"kr\":0,\"burn\":0,\"cantAttack\":false,\"charge\":false,\"taunt\":false,\"invulnerable\":false,\"haste\":false,\"transparency\":true,\"candy\":false,\"id\":507,\"fixedId\":507,\"typeCard\":0,\"name\":\"Fireplace\",\"image\":\"Fireplace\",\"baseImage\":\"Fireplace\",\"cost\":7,\"rarity\":\"RARE\",\"originalCost\":7,\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0},{\"soul\":{\"id\":1,\"name\":\"BRAVERY\"},\"id\":77,\"fixedId\":77,\"typeCard\":1,\"name\":\"Assault\",\"image\":\"Assault\",\"baseImage\":\"Assault\",\"cost\":1,\"rarity\":\"COMMON\",\"originalCost\":1,\"target\":\"ALLY_MONSTER\",\"shiny\":false,\"quantity\":1,\"extension\":\"BASE\",\"tribes\":[],\"selectCards\":[],\"frameSkinName\":\"Undertale\",\"typeSkin\":0,\"playedTurn\":0,\"ownerId\":0}]");
		var test_button = document.createElement("BUTTON");
		test_button.style = "font-size: 3em; color: black; position: fixed; bottom: 0px; right: 0px;";
		test_button.innerHTML = "Test Animation";
		test_button.onclick = function() {StartOpenPackAnimation(packs_data2.Pack, test_data)};
		document.querySelector(".mainContent").appendChild(test_button);
		//setTimeout( function() {StartOpenPackAnimation(packs_data2.Pack);}, 1000);
	}
}

console.log("InitPacks", InitPacks);

export {InitPacks};