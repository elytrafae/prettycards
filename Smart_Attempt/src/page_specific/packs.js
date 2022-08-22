
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {rarityIconsHTML, rarities} from "./../libraries/rarity_icons.js";
import {pagegetters} from "./../libraries/page_getters.js";
import {prettycards, PrettyCards_plugin, settings} from "./../libraries/underscript_checker.js";
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
	console.error("Cannot find Packs Page Template with name ", name);
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
	'default': settingsoptions[0], // default value
	'options': settingsoptions, // Options for type 'select'
	'reset': true, // Adds a reset button (sets to default)
	'refresh': false,
	'onChange': ChangeTemplate, // called when value is changed
});

//console.log("PageGetters", pagegetters);

var packs_data = [
	{
		g_cost : 100,
		ucp_cost : 10,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack",
		image_extension: ".png",
		name: "pc-packs-ut-name",
		description: "pc-packs-ut-desc",
		code_id: "Pack", // Open command: open + ID, Buy G command: add + ID, Buy UCP command: add + ID + Ucp
		does_exist: true,
		g_buy_count: 1,
		ucp_buy_count: 1,
		open_count: 1
	},
	{
		g_cost : 100,
		ucp_cost : 10,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/DeltarunePack",
		image_extension: ".png",
		name: "pc-packs-dr-name",
		description: "pc-packs-dr-desc",
		code_id: "DRPack",
		does_exist: true,
		g_buy_count: 1,
		ucp_buy_count: 1,
		open_count: 1
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/ShinyPack",
		image_extension: ".gif",
		name: "pc-packs-shiny-name",
		description: "pc-packs-shiny-desc",
		code_id: "ShinyPack",
		does_exist: true,
		open_count: 1
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/SuperPack",
		image_extension: ".png",
		name: "pc-packs-super-name",
		description: "pc-packs-super-desc",
		code_id: "SuperPack",
		does_exist: true,
		open_count: 1
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image_without_extension: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/FinalPack",
		image_extension: ".gif",
		name: "pc-packs-final-name",
		description: "pc-packs-final-desc",
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
		if (element.nodeName == "NAV" || element.nodeName == "FOOTER" || element.nodeName == "SCRIPT" /*|| (element.nodeName == "TABLE" && element.id == "cardsOpen")*/) {
			continue;
		} else {
			element.style.display = "none";
		}
	}
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromGH("Packs"); // Other pages might use flippable cards, so I am gonna load this every time.
})

function InitPacks() {
	
	ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function () {
		hideUglyPage();
		document.querySelector(".mainContent").innerHTML += "<div id='PrettyCards_MainContent'></div><div id='PrettyCards_PackOpenContent'></div>";
		ChangeTemplate(settings.packs_page_template.value() || settingsoptions[0], null);
		prettycards.testPackOpenAnimation = function(a, b) {StartOpenPackAnimation(packs_data2[a], b)};
	});
	
}

export {InitPacks, GetPageTemplateByName, settingsoptions};