
var frequency = 5;
var audio = new Audio();
var isHigh = true;
var timer = 0;

function startAudioTest(src) {
    audio.src = src;
    audio.play();
    audio.mozPreservesPitch = false;
    setTimeout(function() {
        audio.playbackRate = 0.9;
        setInterval(function() {
            audio.playbackRate = Math.max(audio.playbackRate - 0.01, 0);
        }, frequency);
    }, 2500)
}

function oldStuff() {
    setInterval(function() {
        /*
        if (isHigh) {
            audio.playbackRate = 1.15;
        } else {
            audio.playbackRate = 1.1;
        }
        isHigh = !isHigh;
        */
        //timer++;
        //audio.playbackRate = 1.2 + Math.sin(timer) * 0.1;
        audio.playbackRate = Math.max(audio.playbackRate - 0.01, 0);
        console.log("AUDIO TEST", isHigh);
    }, frequency);
}