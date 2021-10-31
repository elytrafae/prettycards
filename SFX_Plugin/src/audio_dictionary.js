
class AudioDictionary {
	
	constructor() {
		this.sounds = {
			"your_turn_start" : "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Turn_Start.ogg",
			"enemy_turn_start" : "",
			"card_draw": "",
			"monster_buff": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Buff.ogg",
			"monster_nerf": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Nerf.ogg",
			"paralyze": "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Paralyze.ogg"
		}
		this.audio_objects = {}
	}
	
	PlaySoundEffect(name, volume = 0.2) {
		if (!window.soundEnabled) {
			return;
		}
		if (this.audio_objects[name]) {
			this.audio_objects[name].pause();
		}
		var musicPath = this.sounds[name];
		var audio = new Audio(musicPath);
		audio.volume = volume;
		audio.play();
		this.audio_objects[name] = audio;
	}
	
}

var audioDictionary = new AudioDictionary();

export {audioDictionary}