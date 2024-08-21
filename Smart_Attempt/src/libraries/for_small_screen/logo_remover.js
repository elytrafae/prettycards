import { loadCSS } from "../css_loader";
import { addSetting } from "../underscript_checker";

loadCSS(`.PrettyCards_HiddenLogo #logo {display: none;} .PrettyCards_HiddenLogo header {height: initial;}`);

var setting = addSetting({
	'key': 'remove_logo',
	'name': 'Remove Logo', // Name in settings page
	'note': "For small devices, like laptops, who need the extra space",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
	'onChange' : HideLogo
});

function HideLogo() {
    if (setting.value()) {
        document.body.classList.add("PrettyCards_HiddenLogo");
    } else {
        document.body.classList.remove("PrettyCards_HiddenLogo");
    }
}

HideLogo();
PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    HideLogo();
});