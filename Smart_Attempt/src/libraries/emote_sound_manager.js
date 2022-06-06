import { PrettyCards_plugin, settings } from "../underscript_checker";
import { utility } from "../utility";


settings.emote_sounds = PrettyCards_plugin.settings().add({
	'key': 'emote_sounds',
	'name': 'Enable Emote Sounds', // Name in settings page
	'type': 'boolean',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

var emoteAudio = new Audio();

function playEmoteSound(emote) {
    emoteAudio.pause();
}

if (window.underscript.onPage("Game") || window.underscript.onPage("Spectate")) {
    PrettyCards_plugin.events.on("getEmote", function(data) {
        var isYou = window.userId == data.idUser;
        var image = data.emoteImage;
        if (window.gameEmotesEnabled) { // This if chain is the same as Onu's, for the sake of integrity.
            if (isYou && !window.youDoingEmote) {
                
            } else if (!isYou && !window.enemyDoingEmote && !window.enemyMute) {
                
            }
        }
    })
}
