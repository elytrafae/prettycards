
var startButton = document.getElementById("state0");
var mainThing = document.getElementById("state1");

function configureStartButton(musicEle = new Audio(), fadeTimer = 0, fun = () => {}) {
    startButton.onclick = function(e) {
        startButton.classList.add("PrettyCards_Hidden");
    
        mainThing.classList.remove("PrettyCards_Hidden");

        if (fadeTimer <= 0) {
            mainThing.classList.add("stageFadeIn");
            musicEle.volume(1);
            musicEle.play();
        } else {
            mainThing.classList.add("stageFadeIn");
            fadeInAudio(musicEle, fadeTimer);
        }

        fun(e);
    }
}

function fadeInElement(ele = new HTMLElement(), time) {
    tween(ele.style, "opacity", time);
}

function fadeInAudio(audio = new Audio(), time) {
    tween(audio, "volume", time);
    audio.play();
}

function tween(obj, prop, time) {
    obj[prop] = 0;
    var amount = 1/time;
    var tick_time = 50;
    var time = 0;
    function update() {
        time += tick_time;
        obj[prop] = Math.min(time * amount / 1000, 1);
        //console.log(audio.volume);
        if (obj[prop] < 1) {
            setTimeout(update, tick_time);
        }
    }
    update();
}