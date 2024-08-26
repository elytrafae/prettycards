
import { plugin } from "./underscript_checker";

class AudioDictionary {

	constructor() {
		this.sounds = {};
		this.audio_objects = {};
	}

	SetSounds() {
		this.sounds = {
			"your_turn_start": GetSoundPath("Turn_Start"),
			"enemy_turn_start": "",
			"card_draw": "",
			"monster_buff": GetSoundPath("Buff"),
			"monster_nerf": GetSoundPath("Nerf"),
			"paralyze": GetSoundPath("Paralyze"),
			"kr": GetSoundPath("KR"),
			"silence": GetSoundPath("Silence"),
			"crit_spell": GetSoundPath("Spell_Crit")
		};
	}

	PlaySoundEffect(name, volume_setting = 50, volume = 0.4) {
		if (!window.soundEnabled || volume_setting <= 0) {
			return;
		}
		if (this.audio_objects[name]) {
			this.audio_objects[name].pause();
		}
		var musicPath = this.sounds[name];
		var audio = new Audio(musicPath);
		audio.volume = volume * (volume_setting / 100);
		audio.play();
		this.audio_objects[name] = audio;
	}

	GetSoundPath(name) {
		var prefix = "https://raw.githubusercontent.com/MysteryHD/prettycards-assets/master/";
		if (window.PrettyCards_settings) {
			prefix = window.PrettyCards_settings.asset_directory.value();
		}
		return `${prefix}/audio/sfx/${name}.ogg`;
	}

}

var audioDictionary = new AudioDictionary();
plugin.events.on("connect", () => {
	audioDictionary.SetSounds();
})

export { audioDictionary }