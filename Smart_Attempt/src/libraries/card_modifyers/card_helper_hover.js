
// Currently will be taken out of the code because this would be way too complicated to implement with my tight schedule!

// IMPORTANT: Always put this AFTER card_description_corrections !

import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

settings.card_number_colors = PrettyCards_plugin.settings().add({
	'key': 'card_helpers_hover',
	'name': 'Card Helpers Hover', // Name in settings page
	'note': "Hovering over helpers on cards now displays the text they would display otherwise in a dialogue box. (You can still click them, though)",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

//tippy($0, {content: $.i18n('status-transparency')})

if (settings.card_number_colors.value()) {
	
	PrettyCards_plugin.events.on("appendCard() PC_appendCard", function(data) {
		var element = data.element;
		var card = data.card;
		
		// This line is very likely to break in the future if Onu decides to change something in the game.
		// . . .
		// HAHAHAHAHAHAHAHAHAH!
		// Like that's ever gonna happen!
		var helpers = element.find(".helpPointer"); 
		//console.log(helpers);
		helpers.each(function (i, e) {
			var funcString = e.getAttribute("oncontextmenu");
			//console.log(funcString);
		});
	});
	
}