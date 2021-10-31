
class AudioDictionary {
	
	constructor() {
		var sounds = {
			"your_turn_start" : "",
			"enemy_turn_start" : "",
			"card_draw": "",
			"monster_buff": "",
			"monster_nerf": ""
		}
		var audio_objects = {}
	}
	
	PlaySoundEffect(name) {
		if (false) { // Insert condition for SFX being turned off here.
			return;
		}
		if (audio_objects[name]) {
			audio_objects[name].stop();
		}
		var musicPath = this.sounds[name];
		var audio = new Audio(musicPath);
		audio.volume = 0.1;
		audio.play();
		audio_objects[name] = audio;
	}
	
}

var audioDictionary = new AudioDictionary();

export {audioDictionary}