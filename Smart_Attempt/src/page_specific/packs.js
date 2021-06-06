
import {rarityIconsHTML} from "./../libraries/rarity_icons.js";
import {pagegetters} from "./../libraries/page_getters.js";
import {PrettyCards_plugin, settings} from "./../libraries/underscript_checker.js";
import {utility} from "./../libraries/utility.js";

//console.log("PageGetters", pagegetters);

var packs_data = [
	{
		g_cost : 100,
		ucp_cost : 10,
		image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png",
		name: "Undertale Pack",
		description: "Contains 4 random Undertale Cards.",
		code_id: "Pack", // Open command: open + ID, Buy G command: add + ID, Buy UCP command: add + ID + Ucp
		does_exist: true
	},
	{
		g_cost : 100,
		ucp_cost : 10,
		image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png",
		name: "Deltarune Pack",
		description: "Contains 4 random Deltarune Cards.",
		code_id: "DRPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png",
		name: "Shiny Pack",
		description: "Contains 4 random Shiny Cards.",
		code_id: "ShinyPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png",
		name: "Super Pack",
		description: `Contains a random ${rarityIconsHTML.BASE.COMMON}/${rarityIconsHTML.DELTARUNE.COMMON}, ${rarityIconsHTML.BASE.RARE}/${rarityIconsHTML.DELTARUNE.RARE}, ${rarityIconsHTML.BASE.EPIC}/${rarityIconsHTML.DELTARUNE.EPIC} and ${rarityIconsHTML.BASE.LEGENDARY}/${rarityIconsHTML.DELTARUNE.LEGENDARY} card.`,
		code_id: "SuperPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png",
		name: "Final Pack",
		description: `Contains a random ${rarityIconsHTML.BASE.RARE}/${rarityIconsHTML.DELTARUNE.RARE}, ${rarityIconsHTML.BASE.EPIC}/${rarityIconsHTML.DELTARUNE.EPIC}, ${rarityIconsHTML.BASE.LEGENDARY}/${rarityIconsHTML.DELTARUNE.LEGENDARY} and ${rarityIconsHTML.BASE.DETERMINATION}/${rarityIconsHTML.DELTARUNE.DETERMINATION} card.`,
		code_id: "FinalPack",
		does_exist: true
	}
]

var packs_data2 = {}; // To ease id-based search of pack data.
for (var i=0; i < packs_data.length; i++) {
	var data = packs_data[i];
	packs_data2[data.code_id] = data;
}

function GenerateBuyRow(pack_data) {
	return `
		<input type="number" class="PrettyCards_PackBuyCount" data-packid="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
		x <button class="PrettyCards_PackGBuy btn-primary" data-packid="${pack_data.code_id}">Buy (<span class="PrettyCards_PackGPrice" data-packid="${pack_data.code_id}">100</span> <img src="images/icons/gold.png" class="height-16">)</button>
		 <button class="PrettyCards_PackUcpBuy btn-primary" data-packid="${pack_data.code_id}">Buy (<span class="ucp PrettyCards_PackUcpPrice" data-packid="${pack_data.code_id}">10</span> UCP)</button>
	`;
}

function GenerateOpenRow(pack_data) {
	return `
		<input type="number" class="PrettyCards_PackOpenCount" data-packid="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
		x <button class="PrettyCards_PackOpen btn-primary" data-packid="${pack_data.code_id}">Open <span class="PrettyCards_PackOpenCountButton" data-packid="${pack_data.code_id}">1</span></button>
	`;
}

function GeneratePack(pack_data, pack_count) {
	var buystr = (pack_data.does_exist && (pack_data.g_cost > -1)) ? GenerateBuyRow(pack_data) : "This pack cannot be bought.";
	var openstr = pack_data.does_exist ? GenerateOpenRow(pack_data) : "This pack cannot be opened.";
	return `
	<div class="PrettyCards_FloatingPack">
		<img class="PrettyCards_FloatingPackImage" src="${pack_data.image}">
		<div class="PrettyCards_PackText">
			<div class="PrettyCards_PackName">${pack_data.name}</div>
			<div class="PrettyCards_PackDescription">${pack_data.description}</div>
			<div class="PrettyCards_PackBuy">${buystr}</div>
			<div class="PrettyCards_PackOpen">${openstr}</div>
		</div>
	</div>
	`;
}

var mainContent = document.querySelector(".mainContent");

function DeleteUglyPage() { // Nothing personal
	var children = mainContent.children;
	for (var i=0; i < children.length; i++) {
		var element = children[i];
		if (element.nodeName == "NAV" || element.nodeName == "FOOTER" || element.nodeName == "SCRIPT" || (element.nodeName == "TABLE" && element.id == "cardsOpen")) {
			continue;
		}
		element.remove();
	}
}

function SanitizeNumberInput(input) {
	var val = input.value || "1";
	val = val.replace("-", "");
	val = val.replace(",", "");
	val = val.replace(".", "");
	input.value = val;
}

function ChangePrices(code_id, count) {
	count = Number(count);
	console.log(count, code_id);
	if (count == NaN) {
		return;
	}
	var data = packs_data2[code_id];
	document.querySelector(".PrettyCards_PackGPrice[data-packid="+ code_id +"]").innerHTML = Math.min(count * data.g_cost, Math.floor(pagegetters.gold/data.g_cost)*data.g_cost);
	document.querySelector(".PrettyCards_PackUcpPrice[data-packid="+ code_id +"]").innerHTML = Math.min(count * data.ucp_cost, Math.floor(pagegetters.ucp/data.ucp_cost)*data.ucp_cost);
}

function ChangePackCountButton(code_id, count) {
	count = Number(count);
	console.log(count, code_id);
	if (count == NaN) {
		return;
	}
	var data = packs_data2[code_id];
	document.querySelector(".PrettyCards_PackOpenCountButton[data-packid="+ code_id +"]").innerHTML = Math.min(count, 50);
}

function onPackMouseOver(code_id) {
	console.log("Mouse enter", code_id);
	$(".PrettyCards_PackCell[data-packid="+ code_id +"] .PrettyCards_PackText").slideDown( "slow", function() {});
}

function onPackMouseLeave(code_id) {
	console.log("Mouse leave", code_id);
	$(".PrettyCards_PackCell[data-packid="+ code_id +"] .PrettyCards_PackText").slideUp( "slow", function() {});
}

function InitPacks() {
	DeleteUglyPage();
	
	mainContent.innerHTML += `
		<div class="PrettyCards_PacksRow">
			<div class="PrettyCards_PackCell" data-packid="Pack"></div>
			<div class="PrettyCards_PackCell" data-packid="DRPack"></div>
		</div>
		<div class="PrettyCards_PackSpacer"></div>
		<div class="PrettyCards_PacksRow">
			<div class="PrettyCards_PackCell" data-packid="ShinyPack"></div>
			<div class="PrettyCards_PackCell" data-packid="SuperPack"></div>
			<div class="PrettyCards_PackCell" data-packid="FinalPack"></div>
		</div>
		<div class="PrettyCards_PackSpacer"></div>
	`
	
	for (var i=0; i < packs_data.length; i++) {
		var data = packs_data[i];
		var txt = GeneratePack(data);
		var pack_cell = document.querySelector(".PrettyCards_PackCell[data-packid="+ data.code_id +"]");
		pack_cell.innerHTML = txt;
		
		pack_cell.onmouseover = function(e) {onPackMouseOver(this.getAttribute("data-packid"))};
		pack_cell.onmouseleave = function(e) {onPackMouseLeave(this.getAttribute("data-packid"))};
		$(".PrettyCards_PackCell[data-packid="+ data.code_id +"] .PrettyCards_PackText").slideUp(0);
		
		if (data.does_exist) {
			document.querySelector(".PrettyCards_PackOpenCount[data-packid="+ data.code_id +"]").onchange = function(e) {SanitizeNumberInput(this);ChangePackCountButton(this.getAttribute("data-packid"), this.value)};
			if (data.g_cost > -1) {
			document.querySelector(".PrettyCards_PackBuyCount[data-packid="+ data.code_id +"]").onchange = function(e) {SanitizeNumberInput(this);ChangePrices(this.getAttribute("data-packid"), this.value)};
			}
		}
	}
	
	PrettyCards_plugin.events.on("openedPacks", function(a1, a2, a3) {console.log(a1, a2, a3)});
	
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@e736689b245d086d5458b41873a4796d8360a616/css/Packs.css");
}

console.log("InitPacks", InitPacks);

export {InitPacks};