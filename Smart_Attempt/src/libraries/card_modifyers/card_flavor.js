
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

var settingsoptions = ["None", "Tooltip", "Description", "Description (simple)"];

settings.card_flavour = PrettyCards_plugin.settings().add({
	'key': 'card_flavour',
	'name': 'Card Flavour Text', // Name in settings page
	'note': "Cards will have flavour text.\nNOTE: Description mode will hide the description of<br>hovered cards in other cards' descriptions, Description (simple) will not.",
	'type': 'select',
	'default': settingsoptions[0], // default value
	'options': settingsoptions, // Options for type 'select'
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
});

function HoverHelper() { // A huge part of the two Hover settings is the same, so I will bundle them into a helper function like this.
	$("head").append(`<style>
		.cardDesc > div + div,.card:hover .cardDesc .PrettyCards_CardFlavor {
			display: none;
		}
		.card:hover .cardDesc > div + div {
			display: table-cell;
		}
	</style>`);
		
	PrettyCards_plugin.events.on("appendCard()", function(data) {
		var html$ = data.element;
		var card = data.card;
				
		var flavorText = window.$.i18n("card-flavor-" + card.id);
		if (flavorText === ("card-flavor-" + card.id)) {
			console.debug("This card doesn't have flavour!", card.name, card);
			//flavorText = window.$.i18n("card-" + card.id);
			return;
		}
				
		var element = document.createElement("DIV");
		element.className = "PrettyCards_CardFlavor";
		element.innerHTML = flavorText;
		html$.find(".cardDesc").prepend(element);
		
		var flavorSize = window.getResizedFontSize($(element), 81);
		$(element).css('font-size', (flavorSize + "px"));
	});
}

ExecuteWhen("PrettyCards:onPageLoad", function() {
	if (settings.card_flavour.value() !== settingsoptions[0]) {
		
		$.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/translation/en/card_flavor.json", {}, function(data) {
			//console.log(data);
			window.$.i18n().load({
				en: data
			});
		});
		
		if (settings.card_flavour.value() === settingsoptions[1]) {
			PrettyCards_plugin.events.on("appendCard()", function(data) {
				var html$ = data.element;
				var card = data.card;
				
				var flavorText = window.$.i18n("card-flavor-" + card.id);
				if (flavorText === ("card-flavor-" + card.id)) {
					console.debug("This card doesn't have flavor!", card.name, card);
					return;
				}
				window.tippy(html$[0], {
					content: flavorText,
					allowHTML: true,
					arrow: true,
					placement: "bottom",
					appendTo: window.document.body,
					boundary: 'window',
					getReferenceClientRect: window.document.body.getBoundingClientRect
				});
			});
		} else if (settings.card_flavour.value() === settingsoptions[2]) {
			HoverHelper();
		} else if (settings.card_flavour.value() === settingsoptions[3]) {
			$("head").append(`<style>
				.card.cardHover .cardDesc div {
					display: table-cell !important;
				}
				.card.cardHover .cardDesc div.PrettyCards_CardFlavor {
					display: none !important;
				}
			</style>`);
			HoverHelper();
		}
		
	}
});