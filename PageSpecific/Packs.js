// How to open ALL packs (and make fancy animations)

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
		description: 'Contains a random <img src="images/rarity/BASE_COMMON.png" title="COMMON">/<img src="images/rarity/DELTARUNE_COMMON.png" title="COMMON">, <img src="images/rarity/BASE_RARE.png" title="RARE">/<img src="images/rarity/DELTARUNE_RARE.png" title="RARE">, <img src="images/rarity/BASE_EPIC.png" title="EPIC">/<img src="images/rarity/DELTARUNE_EPIC.png" title="EPIC"> and <img src="images/rarity/BASE_LEGENDARY.png" title="LEGENDARY">/<img src="images/rarity/DELTARUNE_LEGENDARY.png" title="LEGENDARY"> card.',
		code_id: "SuperPack",
		does_exist: true
	},
	{
		g_cost : -1,
		ucp_cost : -1,
		image: "",
		name: "Final Pack",
		description: 'Contains a random <img src="images/rarity/BASE_RARE.png" title="RARE">/<img src="images/rarity/DELTARUNE_RARE.png" title="RARE">, <img src="images/rarity/BASE_EPIC.png" title="EPIC">/<img src="images/rarity/DELTARUNE_EPIC.png" title="EPIC">, <img src="images/rarity/BASE_LEGENDARY.png" title="LEGENDARY">/<img src="images/rarity/DELTARUNE_LEGENDARY.png" title="LEGENDARY"> and <img src="images/rarity/BASE_DETERMINATION.png" title="DETERMINATION">/<img src="images/rarity/DELTARUNE_DETERMINATION.png" title="DETERMINATION"> card.',
		code_id: "FinalPack",
		does_exist: true
	}
]

function GenerateBuyRow(pack_data) {
	return `
		<input type="number" id="PrettyCards_PackBuyCount" pack_id="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
		x <button id="PrettyCards_PackGBuy" pack_id="${pack_data.code_id}">Buy (<span id="PrettyCards_PackGPrice" pack_id="${pack_data.code_id}">100</span> <img src="images/icons/gold.png" class="height-16">)</button>
		 <button id="PrettyCards_PackUcpBuy" pack_id="${pack_data.code_id}">Buy (<span class="ucp" id="PrettyCards_PackUcpPrice" pack_id="${pack_data.code_id}">10</span> UCP)</button>
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

if (settings.packs.value() && underscript.onPage('Packs')) {
	
	console.log("This is the fucking packs page! Please do something! FFS!");
	
	DeleteUglyPage();
	
	mainContent.innerHTML += `
		<div id="PrettyCards_PacksRow">
			<div class="PrettyCards_PackCell" pack_id="Pack"></div>
			<div class="PrettyCards_PackCell" pack_id="DRPack"></div>
		</div>
		<div id="PrettyCards_PacksRow">
			<div class="PrettyCards_PackCell" pack_id="ShinyPack"></div>
			<div class="PrettyCards_PackCell" pack_id="SuperPack"></div>
			<div class="PrettyCards_PackCell" pack_id="FinalPack"></div>
		</div>
	`
	
	for (var i=0; i < packs_data.length; i++) {
		var txt = GeneratePack(packs_data[i]);
		document.querySelector(".PrettyCards_PackCell[pack_id="+ packs_data[i].code_id +"]").innerHTML = txt;
		console.log(packs_data[i], txt);
	}
	
	PrettyCards_plugin.events.on("openedPacks", function(a1, a2, a3) {console.log(a1, a2, a3)});
	
	//const my_css = GM_getResourceText("PACKS_CSS");
	//console.log("CSS Loaded: ", my_css);
    //GM_addStyle(my_css);
	
}



//console.log("Packs Page Done!");
