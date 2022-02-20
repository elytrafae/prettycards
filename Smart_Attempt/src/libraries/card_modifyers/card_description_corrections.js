
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

settings.card_number_colors = PrettyCards_plugin.settings().add({
	'key': 'card_number_colors',
	'name': 'Card Number Colors', // Name in settings page
	'note': "Stats in card descriptions in an <span class='atk-color'>ATK</span>/<span class='hp-color'>HP</span> or <span class='cost-color'>COST</span>/<span class='atk-color'>ATK</span>/<span class='hp-color'>HP</span> format will have the numbers colored after the stat they represent.",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

settings.non_dt_inconsistency = PrettyCards_plugin.settings().add({
	'key': 'non_dt_inconsistency',
	'name': 'Fix Non-DT inconsistency.', // Name in settings page
	'note': "Fixes any inconsistent version of the phrase \"non-<span class='DETERMINATION'>DT</span>\" on card descriptions.",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

var card_numbers_regex = /[+-]?(\d+)\/[+-]?(\d+)(?:\/[+-]?(\d+))?/gm;
var color_classes = ['cost-color', 'atk-color', 'hp-color'];

var non_dt_regex = /non[-\s]dt/gmi;

function NonDTCorrector(full) { // Why not throw this in here, too?
	return 'non-' + window.$.i18n("{{RARITY:DETERMINATION}}");
}

function RegexProcessor(full, stat1, stat2, stat3) {
	//console.log(full, stat1, stat2, stat3);
	var parts = full.split("/");
	
	for (var i=0; i < parts.length; i++) {
		var color_class = color_classes[i + (color_classes.length - parts.length)];
		//console.log("Color class: ", color_class);
		var prefix = '';
		if (parts[i][0] == "+" || parts[i][0] == "-") {
			prefix = parts[i][0];
			parts[i] = parts[i].substr(1);
		}
		parts[i] = prefix + '<span class="' + color_class + '">' + parts[i] + '</span>';
		//console.log("parts[i]", i, parts[i]);
	}
	//console.log(parts);
	return parts.join("/");
}

if (settings.card_number_colors.value() || settings.non_dt_inconsistency.value()) {
	
	PrettyCards_plugin.events.on("appendCard() PC_appendCard", function(data) {
		var html$ = data.element;
		var card = data.card;
		
		var text = $.i18n("card-" + (card.fixedId || card.id));
		
		if (settings.card_number_colors.value()) {
			text = text.replaceAll(card_numbers_regex, RegexProcessor);
		}
		if (settings.non_dt_inconsistency.value()) {
			text = text.replaceAll(non_dt_regex, NonDTCorrector);
		}
		html$.find(".cardDesc div").html(text);
		//console.log(html$.find(".cardDesc div"));
	});
	
}