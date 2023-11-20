// How to open ALL packs (and make fancy animations)

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

var packs_data = [
	{
		g_cost : 100,
		ucp_cost : 10,
		image: "",
		name: "Undertale Pack",
		description: "Contains 4 random Undertale Cards.",
		code_id: "Pack", // Open command: open + ID, Buy G command: add + ID, Buy UCP command: add + ID + Ucp
		does_exist: true
	},
	{
		g_cost : 100,
		ucp_cost : 10,
		image: "",
		name: "Deltarune Pack",
		description: "Contains 4 random Deltarune Cards.",
		code_id: "DRPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "",
		name: "Shiny Pack",
		description: "Contains 4 random Shiny Cards.",
		code_id: "ShinyPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "",
		name: "Super Pack",
		description: `Contains a random ${rarityIconsHTML.BASE.COMMON}/${rarityIconsHTML.DELTARUNE.COMMON}, ${rarityIconsHTML.BASE.RARE}/${rarityIconsHTML.DELTARUNE.RARE}, ${rarityIconsHTML.BASE.EPIC}/${rarityIconsHTML.DELTARUNE.EPIC} and ${rarityIconsHTML.BASE.LEGENDARY}/${rarityIconsHTML.DELTARUNE.LEGENDARY} card.`,
		code_id: "SuperPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "",
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
		x <button class="PrettyCards_PackGBuy" data-packid="${pack_data.code_id}">Buy (<span class="PrettyCards_PackGPrice" data-packid="${pack_data.code_id}">100</span> <img src="images/icons/gold.png" class="height-16">)</button>
		 <button class="PrettyCards_PackUcpBuy" data-packid="${pack_data.code_id}">Buy (<span class="ucp PrettyCards_PackUcpPrice" data-packid="${pack_data.code_id}">10</span> UCP)</button>
	`;
}

function GeneratePack(pack_data, pack_count) {
	var buystr = (pack_data.does_exist && (pack_data.g_cost > -1)) ? GenerateBuyRow(pack_data) : "This pack cannot be bought.";
	var openstr = pack_data.does_exist ? "yes" : "no";
	return `
	<div class="PrettyCards_FloatingPack">
		<img src="${pack_data.image}">
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

if (settings.packs.value() && underscript.onPage('Packs')) {
	
	DeleteUglyPage();
	
	mainContent.innerHTML += `
		<div class="PrettyCards_PacksRow">
			<div class="PrettyCards_PackCell" data-packid="Pack"></div>
			<div class="PrettyCards_PackCell" data-packid="DRPack"></div>
		</div>
		<div class="PrettyCards_PacksRow">
			<div class="PrettyCards_PackCell" data-packid="ShinyPack"></div>
			<div class="PrettyCards_PackCell" data-packid="SuperPack"></div>
			<div class="PrettyCards_PackCell" data-packid="FinalPack"></div>
		</div>
	`
	
	for (var i=0; i < packs_data.length; i++) {
		var data = packs_data[i];
		var txt = GeneratePack(data);
		document.querySelector(".PrettyCards_PackCell[data-packid="+ data.code_id +"]").innerHTML = txt;
		console.log(packs_data[i], txt);
		if (data.g_cost > -1) {
			document.querySelector(".PrettyCards_PackBuyCount[data-packid="+ data.code_id +"]").onchange = function(e) {SanitizeNumberInput(this);ChangePrices(this.getAttribute("data-packid"), this.value)};
		}
	}
	
	PrettyCards_plugin.events.on("openedPacks", function(a1, a2, a3) {console.log(a1, a2, a3)});
	
	loadCSSFromLink("https://cdn.jsdelivr.net/gh/elytrafae/prettycards@480a1ecd355d15a6eec631871f965c18bf6adf90/css/Packs.css");
	
}



//console.log("Packs Page Done!");
