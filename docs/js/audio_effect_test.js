
var frequency = 5;
var audio = new Audio();
var isHigh = true;
var timer = 0;

function startAudioTest(src) {
    audio.src = src;
    audio.play();
    audio.mozPreservesPitch = false;
    setInterval(function() {
        /*
        if (isHigh) {
            audio.playbackRate = 1.15;
        } else {
            audio.playbackRate = 1.1;
        }
        isHigh = !isHigh;
        */
        timer++;
        audio.playbackRate = 1.2 + Math.sin(timer) * 0.1;
        console.log("AUDIO TEST", isHigh);
    }, frequency);
}