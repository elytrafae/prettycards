
import { utility } from "./utility";
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";

addSetting({
	'key': 'kromer_test',
	'name': 'Kromer Test', // Name in settings page
	'note': 'Changes every instance of UCP to KROMER.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'disabled': false,
	'default': false, // default value
	'category': "controversial"
});

var translationKeys = ["item-ucp", "header-free-ucp", "shop-title", "quests-ucp", "settings-username-ucp", "packs-error-add", "reward-ucp", "cardskins-shop-confirm"];

function kromerify(lan) {
	var obj = {};
	for (var j=0; j < translationKeys.length; j++) {
		var key = translationKeys[j];
		obj[key] = utility.toLocale(key, lan).replaceAll("UCP", "KROMER");
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
		//$('[data-i18n="[html]item-ucp"]').parent().each((_, e) => e.innerHTML = e.innerHTML.replace('UCP', 'KROMER'));
		$('body').i18n();
		$('[data-i18n-custom],[data-i18n-value],[data-i18n-title],[data-i18n-placeholder]').each(function () {translateElement($(this))});

		if (window.underscript.onPage("CosmeticsShop")) {
			$('.ucp').parent().each(function() {
				[...this.childNodes]
					.filter(el => el.nodeType === 3) // Text nodes
					.each((el) => el.textContent = el.textContent.replace(ucp, kromer))
			});
		}
	});
}