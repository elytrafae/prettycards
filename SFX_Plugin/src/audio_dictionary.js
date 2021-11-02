
class AudioDictionary {
	
	constructor() {
		this.sounds = {
			"your_turn_start" : "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Turn_Start.ogg",
			"enemy_turn_start" : "",
			"card_draw": "",
			"monster_buff": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Buff.ogg",
			"monster_nerf": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Nerf.ogg",
			"paralyze": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Paralyze.ogg",
			"kr": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/KR.ogg",
			"silence": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Silence.ogg",
			"crit_spell": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Spell_Crit.ogg"
		}
		this.audio_objects = {}
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
		audio.volume = volume * (volume_setting/100);
		audio.play();
		this.audio_objects[name] = audio;
	}
	
}

var audioDictionary = new AudioDictionary();

export {audioDictionary}