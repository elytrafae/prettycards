
import {plugin, settings} from "/src/underscript_checker.js";
import {audioDictionary} from "/src/audio_dictionary.js";
import {WrapWithEvent} from "/src/wrap_with_event.js";

console.log("PrettyCards Audio!");

if (window.underscript.onPage("Game")) {
	plugin.events.on("getTurnStart", function(data) {
		//console.log("DATA", data);
		if (window.userId == data.idPlayer) {
			audioDictionary.PlaySoundEffect("your_turn_start", settings.turn_start.value(), 1);
		}
	});
	
	WrapWithEvent("attackBuffAnimation");
	plugin.events.on("attackBuffAnimation", function(data) {
		//console.log("ATK_BUFF_DATA", data);
		audioDictionary.PlaySoundEffect("monster_buff", settings.buff.value());
	});
	
	WrapWithEvent("hpBuffAnimation");
	plugin.events.on("hpBuffAnimation", function(data) {
		//console.log("HP_BUFF_DATA", data);
		audioDictionary.PlaySoundEffect("monster_buff", settings.buff.value());
	});
	
	WrapWithEvent("attackDebuffAnimation");
	plugin.events.on("attackDebuffAnimation", function(data) {
		//console.log("ATK_NERF_DATA", data);
		audioDictionary.PlaySoundEffect("monster_nerf", settings.nerf.value());
	});
	
	WrapWithEvent("hpDebuffAnimation");
	plugin.events.on("hpDebuffAnimation", function(data) {
		//console.log("HP_NERF_DATA", data);
		audioDictionary.PlaySoundEffect("monster_nerf", settings.nerf.value());
	});
	
	WrapWithEvent("freezeAnimation");
	plugin.events.on("freezeAnimation", function(data) {
		//console.log("FREEZE_DATA", data);
		audioDictionary.PlaySoundEffect("paralyze", settings.paralyze.value());
	});
	
	WrapWithEvent("poisonAnimation");
	plugin.events.on("poisonAnimation", function(data) {
		//console.log("KR_DATA", data);
		audioDictionary.PlaySoundEffect("kr", settings.kr.value());
	});
	
	WrapWithEvent("silenceAnimation");
	plugin.events.on("silenceAnimation", function(data) {
		//console.log("SILENCE_DATA", data);
		audioDictionary.PlaySoundEffect("silence", settings.silence.value());
	});
	
	/*
	WrapWithEvent("hpStatAnimation"); // Would have really wanted to do this, but I don't want to torture myself.
	plugin.events.on("hpStatAnimation", function(data) {
		//console.log("SILENCE_DATA", data);
		if (settings.crit_spell.value() && data[2] <= -7) {
			audioDictionary.PlaySoundEffect("crit_spell");
		}
	});
	*/
	
	/*
	plugin.events.on("getFight getFightPlayer", function(data) {
		console.log("FIGHT_DATA", data);
		var attacker = data.attack_monster;
	})
	*/
	
	/*
	plugin.events.on("updateMonster", function(data) {
		console.log("updateMonster Data", data);
	})*/
}