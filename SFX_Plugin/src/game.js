
import {plugin, settings} from "/src/underscript_checker.js";
import {audioDictionary} from "/src/audio_dictionary.js";
import {WrapWithEvent} from "/src/wrap_with_event.js";

console.log("PrettyCards Audio!");

var damage_type = ""; // Can be "ATTACK" or "SPELL"
var damager_id = 0; // The damager id
var player_id = 0; // In case of souls and artifacts

function CritSpellAnimation() {
	if (!settings.crit_spell_anim.value()) {
		return;
	}
	var $mainContent = window.$('.mainContent');
	$mainContent.effect("shake", {direction: "up", times: 1, distance: 5}, 25);
	$mainContent.effect("shake", {direction: "right", times: 1, distance: 5}, 25);
	$mainContent.effect("shake", {direction: "up", times: 1, distance: 5}, 25);
	$mainContent.effect("shake", {direction: "right", times: 1, distance: 5}, 25);
	
	audioDictionary.PlaySoundEffect("crit_spell", settings.crit_spell.value());
}

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
	
	plugin.events.on("getFight getFightPlayer", function(data) {
		//console.log("FIGHT_DATA", data);
		damage_type = "ATTACK";
		damager_id = data.attackMonster;
	})
	
	plugin.events.on("getDoingEffect", function(data) {
		//console.log("CARD_EFFECT_DATA", data);
		damage_type = "CARD_EFFECT";
		damager_id = data.monsterId || data.spellId;
	})
	
	plugin.events.on("getArtifactDoingEffect", function(data) {
		//console.log("ARTIFACT_EFFECT_DATA", data);
		damage_type = "ARTIFACT_EFFECT";
		damager_id = data.artifactId;
		player_id = data.playerId;
	})
	
	plugin.events.on("getSoulDoingEffect", function(data) {
		//console.log("SOUL_EFFECT_DATA", data);
		damage_type = "SOUL_EFFECT";
		damager_id = data.playerId;
		player_id = data.playerId;
	})
	
	WrapWithEvent("hpStatAnimation");
	plugin.events.on("hpStatAnimation", function(data) {
		//console.log("HP_SET_ANIMATION_DATA", data);
		//console.log("HP_CHANGE_SOURCE: ", damage_type, damager_id, player_id);
		if (data[2] <= -7 && damage_type.endsWith("_EFFECT")) {
			CritSpellAnimation()
		}
	});
	
	/*
	plugin.events.on("updateMonster", function(data) {
		console.log("updateMonster Data", data);
	})*/
	
	
	
}