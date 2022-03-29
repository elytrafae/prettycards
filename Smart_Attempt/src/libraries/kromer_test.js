
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

var translationKeys = ["item-ucp", "header-free-ucp", "shop-title", "quests-ucp", "settings-username-ucp", "packs-error-add", "reward-ucp", "cardskins-shop-confirm"];

function toLocale(key, locale, data = []) {
	const l = window.$.i18n().locale;
	window.$.i18n().locale = locale;
	let text;
	try {
		text = window.$.i18n(key, ...data);
	} catch (e) {
		text = 'ERROR';
	}
	window.$.i18n().locale = l;
	return text;
}

function kromerify(lan) {
	var obj = {};
	for (var j=0; j < translationKeys.length; j++) {
		var key = translationKeys[j];
		obj[key] = toLocale(key, lan).replaceAll("UCP", "KROMER");
	}
	//console.log("Translation changed!", obj, lan);
	window.$.i18n().load(obj, lan);
}

if (settings.kromer_test.value()) {
	PrettyCards_plugin.events.on('translation:loaded', (data) => {
		kromerify("en");
		var lan = window.localStorage.getItem("language");
		if (!lan) { // Should never happen, but . . . 
			lan = window.getLanguage();
		}
		if (lan != "en") {
			kromerify(lan);
		}
		$('.ucp').parent().each((_, e) => e.innerHTML = e.innerHTML.replace('UCP', 'KROMER'));
	});
}