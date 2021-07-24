
/*
var filters_data = [
	// Base Filters re-implemented.
	{
		id : "baseRarityInput",
		type: "checkbox",
		filterType: "rarity",
		val : "BASE"
	},
	{
		id : "commonRarityInput",
		type: "checkbox",
		filterType: "rarity",
		val : "COMMON"
	},
	{
		id : "rareRarityInput",
		type: "checkbox",
		filterType: "rarity",
		val : "RARE"
	},
	{
		id : "epicRarityInput",
		type: "checkbox",
		filterType: "rarity",
		val : "EPIC"
	},
	{
		id : "legendaryRarityInput",
		type: "checkbox",
		filterType: "rarity",
		val : "LEGENDARY"
	},
	{
		id : "determinationRarityInput",
		type: "checkbox",
		filterType: "rarity",
		val : "DETERMINATION"
	},
	{
		id : "tokenRarityInput",
		type: "checkbox",
		filterType: "rarity",
		notIncludeDefault: true,
		val : "TOKEN"
	},
	{
		id : "monsterInput",
		type: "checkbox",
		filterType: "typeCard",
		val : 1
	},
	{
		id : "spellInput",
		type: "checkbox",
		filterType: "typeCard",
		val : 0
	},
	{
		id : "undertaleInput",
		type: "checkbox",
		filterType: "extension",
		val : "BASE"
	},
	{
		id : "deltaruneInput",
		type: "checkbox",
		filterType: "extension",
		val : "DELTARUNE"
	},
	{
		id : "shinyInput",
		type: "checkbox",
		filterType: "shiny",
		notIncludeDefault: true,
		val : true
	},

	// Custom Filters
	{
		id : "PrettyCards_DDLCFilter",
		icon : "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/DOKI.png",
		type: "checkbox",
		filterType: "extension",
		val: "DDLC"
	}
]
*/

var filters_data = {
	
	rarity: [
		{
			id : "baseRarityInput",
			type: "checkbox",
			val : "BASE"
		},
		{
			id : "commonRarityInput",
			type: "checkbox",
			val : "COMMON"
		},
		{
			id : "rareRarityInput",
			type: "checkbox",
			val : "RARE"
		},
		{
			id : "epicRarityInput",
			type: "checkbox",
			val : "EPIC"
		},
		{
			id : "legendaryRarityInput",
			type: "checkbox",
			val : "LEGENDARY"
		},
		{
			id : "determinationRarityInput",
			type: "checkbox",
			val : "DETERMINATION"
		},
		{
			id : "tokenRarityInput",
			type: "checkbox",
			banFromPage: ["Decks"],
			notIncludeDefault: true,
			val : "TOKEN"
		}
	],
	typeCard: [
		{
			id : "monsterInput",
			type: "checkbox",
			val : 1
		},
		{
			id : "spellInput",
			type: "checkbox",
			val : 0
		}
	],
	extension: [
		{
			id : "undertaleInput",
			type: "checkbox",
			val : "BASE"
		},
		{
			id : "deltaruneInput",
			type: "checkbox",
			val : "DELTARUNE"
		},
		{
			id : "PrettyCards_DDLCFilter",
			icon : "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/DOKI.png",
			type: "checkbox",
			val: "DDLC"
		}
	],
	shiny: [
		{
			id : "shinyInput",
			type: "checkbox",
			banFromPage: ["Decks"],
			notIncludeDefault: true,
			val : true
		}
	]
};

function SetUpFilters() {
	var filterTd = document.getElementsByClassName("filter")[0].parentElement;
	var customFiltersP = document.createElement("P");
	customFiltersP.className = "filter";
	customFiltersP.style = "text-align: center;font-size: 16px;";
	filterTd.appendChild(customFiltersP);
	var $customFiltersP = $(customFiltersP);
	
	for (var filterType in filters_data) {
		var filters = filters_data[filterType];
		for (var i=filters.length-1; i >= 0; i--) {
			var filter = filters[i];
			var bannedFrom = filter.banFromPage || [];
			console.log(window.location.href.substr(window.location.href.lastIndexOf('/') + 1));
			if (!bannedFrom.includes( window.location.href.substr(window.location.href.lastIndexOf('/') + 1) )) {
				var ele = document.getElementById(filter.id);
				if (ele) {
					filter.element = $(ele);
				} else {
					var label = $('<label><input type="' + filter.type + '" id="' + filter.id + '" onchange="applyFilters(); showPage(0);"> <img style="height: 24px;" src="' + filter.icon + '" alt=""></label>');
					filter.element = label.find("input");
					$customFiltersP.append(label);
				}
			} else {
				console.log(filter.id, "banned!");
				filters.splice(i, 1);
			}
		}
	}
}

var oldIsRemoved = window.isRemoved;

window.isRemoved = function(card) {
	for (var filterType in filters_data) {
		var filters = filters_data[filterType];
		var switches = [];
		for (var i=0; i < filters.length; i++) {
			var filter = filters[i];
			var ele = filter.element;
			if (ele.prop('checked')) {
				switches[i] = filter.val;
			}
		}
		if (switches.length > 0 && !switches.includes(card[filterType])) {
			return true;
		}
		if (switches.length == 0) {
			for (var i=0; i < filters.length; i++) {
				var filter = filters[i];
				if (filter.notIncludeDefault && card[filterType] == filter.val) {
					return true;
				}
			}
		}
	}
	
	return false;
	
}

export {SetUpFilters};