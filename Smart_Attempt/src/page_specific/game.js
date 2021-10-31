
function InitGame() {
	var oldPlayBackgroundMusic = window.playBackgroundMusic;
	window.playBackgroundMusic = function(musicName) {
		if (true) { // Testing purposes
			var musicPath = 'https://github.com/CMD-God/prettycards/raw/master/audio/bgms/spamton_neo_mix_ex_wip.ogg';
			window.music = new Audio(musicPath);
			window.music.volume = 0.1;
			//window.music.controls = true;
			window.music.addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
			window.music.play();
			//$(".mainContent").append(window.music);
		} else {
			oldPlayBackgroundMusic(musicName);
		}
	}
}

export {InitGame};