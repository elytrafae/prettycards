import { PrettyCards_plugin } from "../underscript_checker";

class ThemeSongSetting {

    constructor(cardId, minPitch = 1, maxPitch = 1) {
        this.cardId = cardId;
        this.originalUrl = originalUrl;
        this.minPitch = minPitch;
        this.maxPitch = maxPitch;
        this.replacements = [];
    }

}

var options = {};

PrettyCards_plugin.events.on("allCardsReady", function() {
    
});

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    class AudioSpoofed extends Audio{
        constructor(name) {
            //name = options[Math.floor(Math.random() * array.length)];
            super(name)
        }
    }
})

