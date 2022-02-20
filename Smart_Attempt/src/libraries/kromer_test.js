
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

settings.kromer_test = PrettyCards_plugin.settings().add({
	'key': 'kromer_test',
	'name': 'Kromer Test', // Name in settings page
	'note': 'Changes every instance of UCP to KROMER.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'disabled': false,
	'default': false // default value
});

if (settings.kromer_test.value()) {
	PrettyCards_plugin.events.on('translation:loaded', () => {
		window.$.i18n().load({
			'item-ucp': "KROMER",
			'header-free-ucp': "Free KROMER [[mobile]]",
			'shop-title': "KROMER Shop",
			'quests-ucp': "{{UCP:$1}} KROMER",
			'settings-username-ucp': "You don't have enough KROMER!",
			'packs-error-add': "Couldn't add a pack. Check if you have enough gold/KROMER.",
			'reward-ucp': "KROMER",
			'cardskins-shop-confirm': "Unlock this skin for {{UCP:$1}} KROMER?"
		}, 'en');
		$('.ucp').parent().each((_, e) => e.innerHTML = e.innerHTML.replace('UCP', 'KROMER'));
	});
}
