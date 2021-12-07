
import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

ExecuteWhen("PrettyCards:onPageLoad", function() {
	if (underscript.onPage("CustomCards")) {
		var oldAppendCard = window.appendCard;
		window.appendCard = function(card, container) {
			var element = oldAppendCard(card, container);
			PrettyCards_plugin.events.emit("PC_appendCard", {card: card, element: element});
			return element;
		}
		
		// PrettyCards_plugin.events.on("appendCard()", function(data) { // Cannot use this because Underscript is in zombie mode on custom pages.
		PrettyCards_plugin.events.on("PC_appendCard", function(data) {
			console.log("appendCard", data);
			var card = data.card;
			var $element = data.element;
			
		});
	}
});

export {};