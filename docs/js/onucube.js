
var startButton = document.getElementById("state0");
var onucube = document.getElementById("state1");

var cube = document.getElementById("cube");
var freeBird = document.getElementById("free_bird");

startButton.onclick = function() {
    startButton.classList.add("PrettyCards_Hidden");

    cube.classList.add("cube");
    onucube.classList.remove("PrettyCards_Hidden");
    onucube.classList.add("stageFadeIn");

    fadeInAudio(freeBird, 5);
}

function fadeInAudio(audio = new Audio(), time) {
    audio.volume = 0;
    var amount = 1/time;
    var tick_time = 50;
    var time = 0;
    function update() {
        time += tick_time;
        audio.volume = Math.min(time * amount / 1000, 1);
        console.log(audio.volume);
        if (audio.volume < 1) {
            setTimeout(update, tick_time);
        }
    }
    update();
    audio.play();
}