
import {plugin, settings} from "/src/underscript_checker.js";
import {audioDictionary} from "/src/audio_dictionary.js";
import {WrapWithEvent} from "/src/wrap_with_event.js";

console.log("PrettyCards Audio!");

if (window.underscript.onPage("Game")) {
	plugin.events.on("getTurnStart", function(data) {
		//console.log("DATA", data);
		if (settings.turn_start.value() && (window.userId == data.idPlayer)) {
			audioDictionary.PlaySoundEffect("your_turn_start", 0.5);
		}
	});
	
	WrapWithEvent("attackBuffAnimation");
	plugin.events.on("attackBuffAnimation", function(data) {
		console.log("ATK_BUFF_DATA", data);
		if (settings.buff.value()) {
			audioDictionary.PlaySoundEffect("monster_buff");
		}
	});
	
	WrapWithEvent("hpBuffAnimation");
	plugin.events.on("hpBuffAnimation", function(data) {
		console.log("HP_BUFF_DATA", data);
		if (settings.buff.value()) {
			audioDictionary.PlaySoundEffect("monster_buff");
		}
	});
	
	WrapWithEvent("attackDebuffAnimation");
	plugin.events.on("attackDebuffAnimation", function(data) {
		console.log("ATK_NERF_DATA", data);
		if (settings.nerf.value()) {
			audioDictionary.PlaySoundEffect("monster_nerf");
		}
	});
	
	WrapWithEvent("hpDebuffAnimation");
	plugin.events.on("hpDebuffAnimation", function(data) {
		console.log("HP_NERF_DATA", data);
		if (settings.nerf.value()) {
			audioDictionary.PlaySoundEffect("monster_nerf");
		}
	});
	
	WrapWithEvent("freezeAnimation");
	plugin.events.on("freezeAnimation", function(data) {
		console.log("FREEZE_DATA", data);
		if (settings.nerf.value()) {
			audioDictionary.PlaySoundEffect("paralyze");
		}
	});
}