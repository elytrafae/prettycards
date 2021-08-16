
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

settings.card_flavour = PrettyCards_plugin.settings().add({
	'key': 'card_flavour',
	'name': 'Card Flavour Text', // Name in settings page
	'note': "Cards will have flavour text.",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
});

if (settings.card_flavour.value()) {
	
	//console.log("");
	
	PrettyCards_plugin.events.on("appendCard()", function(data) {
		var html$ = data.element;
		var card = data.card;
		
		var flavourText = window.$.i18n("card-flavour-" + card.id);
		if (flavourText === ("card-flavor-" + card.id)) {
			console.debug("This card doesn't have flavour!", card.name, card);
			return;
		}
		window.tippy(html$, {
			content: flavourText,
			allowHTML: true,
			arrow: true,
			placement: "bottom",
			appendTo: window.document.body,
			boundary: 'window',
			getReferenceClientRect: window.document.body.getBoundingClientRect,
			onShow(instance) {
				//console.log(instance, el._tippy, instance == el._tippy);
				//const { popperInstance, options } = el._tippy;
				//options.placement = popperInstance.options.placement = 'right'
				//popperInstance.update()
			},
		});
	});
}