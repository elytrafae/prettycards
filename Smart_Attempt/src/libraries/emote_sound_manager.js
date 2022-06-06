import { PrettyCards_plugin, settings } from "/src/libraries/underscript_checker";
import { utility } from "/src/libraries/utility";


settings.emote_sounds = PrettyCards_plugin.settings().add({
	'key': 'emote_sounds',
	'name': 'Enable Emote Sounds', // Name in settings page
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

var emoteAudio = new Audio();
emoteAudio.volume = 0.7;

function playEmoteSound(emote) {
    emoteAudio.pause();
    emoteAudio.src = `https://github.com/CMD-God/prettycards/raw/master/audio/emotes/${emote}.ogg`;
    emoteAudio.play();
}

if (window.underscript.onPage("Game") || window.underscript.onPage("Spectate")) {
    PrettyCards_plugin.events.on("getEmote:before", function(data) {
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

if (window.underscript.onPage("CosmeticsShop")) {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        $(".emote-bordered").each(function(i, e) {
            var url = new URL(e.src).pathname;
            const emote = url.substring(15, url.length - 4); // Crops the image name from the src\
            var speaker = $(`<div class="glyphicon glyphicon-volume-up PrettyCards_EmoteSoundPlayer"></div>`)[0];
            speaker.onclick = onclick = function() {
                playEmoteSound(emote);
            }
            e.parentElement.appendChild(speaker);
        });
    })
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("Cosmetics");
})