import { PrettyCards_plugin, settings, addSetting } from "/src/libraries/underscript_checker";
import { utility } from "/src/libraries/utility";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/Cosmetics.css";
import { prettycards } from "./underscript_checker";
loadCSS(css);


addSetting({
	'key': 'emote_sounds',
	'name': 'Enable Emote Sounds', // Name in settings page
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

var emoteAudio = new Audio();
emoteAudio.volume = 0.7;

function playEmoteSound(emote, onerror = function() {}, muteBGM = false) {
    if (muteBGM) {
        PrettyCards_plugin.events.emit("PrettyCards:pauseBGM");
    }
    emoteAudio.pause();
    emoteAudio.src = utility.asset(`audio/emotes/${emote}.ogg`);
    emoteAudio.onerror = function() {
        onerror();
        PrettyCards_plugin.events.emit("PrettyCards:resumeBGM");
    };
    emoteAudio.onended = function() {
        PrettyCards_plugin.events.emit("PrettyCards:resumeBGM");
    }
    emoteAudio.play();
}

if (window.underscript.onPage("Game") || window.underscript.onPage("Spectate")) {
    PrettyCards_plugin.events.on("getEmote:before", function(data) {
        if (!settings.emote_sounds.value()) {return;}
        var isYou = window.userId == data.idUser;
        var image = data.emoteImage;
        if (window.gameEmotesEnabled) { // This if chain is the same as Onu's, for the sake of integrity.
            if (isYou && !window.youDoingEmote) { // Left these separated like this so I can potentially do different things for enemies and allies easier.
                playEmoteSound(image);
            } else if (!isYou && !window.enemyDoingEmote && !window.enemyMute) {
                playEmoteSound(image);
            }
        }
    })
}

if (settings.emote_sounds.value() && window.underscript.onPage("CosmeticsShop")) {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        document.querySelectorAll(".emote-bordered").forEach(function(e) {
            var url = new URL(e.src).pathname;
            const emote = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));; // Crops the image name from the src.
            const speaker = $(`<div class="glyphicon glyphicon-volume-up PrettyCards_EmoteSoundPlayer"></div>`)[0];
            speaker.onclick = function() {
                playEmoteSound(emote, function() {
                    speaker.style.color = "red";
                    speaker.onclick = function() {};
                }, true);
            }
            e.parentElement.appendChild(speaker);
        });
    })
}

prettycards.playEmoteSound = playEmoteSound;