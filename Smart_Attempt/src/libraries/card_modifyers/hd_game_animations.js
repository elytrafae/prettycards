import { PrettyCards_plugin, settings , addSetting } from "../underscript_checker";
import { utility } from "../utility";

addSetting({
	'key': 'hd_game_animations',
	'name': 'HD Game Animations', // Name in settings page
    'note': "As per the request of the original animator of the game's visual effects, now you can use their new and improved version of the visual effects!",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "controversial"
});

function wrapAnimFunction(funcName, image) {
	var oldFunc = window[funcName];
	window[funcName] = function(a, b, c, d, e) { // Some parameters, just to be sure!
		oldFunc(a, b, c, d, e);
		replaceAnim(image);
	}
}

function replaceAnim(image) {
	var imgs = $(".vfx:not(.PrettyCards_DoneVFX)");
	imgs.attr("src", utility.asset(`img/CardVFX/${image}.png?v=${window.animationCounter}`));
	imgs.addClass("PrettyCards_DoneVFX");
}

if (settings.hd_game_animations.value() && (window.underscript.onPage("Game") || window.underscript.onPage("Spectate"))) {
	// wrapAnimFunction("silenceAnimation", "Silence"); // Activate when animations come!


}