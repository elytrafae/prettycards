import { PrettyCards_plugin, settings } from "../underscript_checker";
import { utility } from "../utility";

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

class ThemeSongSetting {

    constructor(card, minPitch = 1, maxPitch = 1) {
        this.cardId = card.fixedId || card.id;
        this.originalUrl = `${card.name.replaceAll(" ", "_")}.ogg`;
        this.minPitch = minPitch;
        this.maxPitch = maxPitch;
        this.replacements = [];
        this.playedBefore = 0; // Only counts at times when it goes in order.
    }

    getNextReplacement() {
        this.playedBefore++;
        return this.replacements[(this.playedBefore-1) % this.replacements.length]; // Have to reduce it by one because we increase the "playedBefore" counter before getting this, skipping the first one.
    }

    getRandomReplacement() {
        return this.replacements[Math.floor(Math.random() * this.replacements.length)];
    }

    addFile(path) {
        utility.preloadAudio(path);
        this.replacements.push(path);
    }

}

var options = [];
var baseThemeSongData = {};

function getThemeSongSettingByOriginalUrl(url) {
    if (!url) {
        return null;
    }
    for (var i=0; i < options.length; i++) {
        var e = options[i];
        //console.log(e, url, e.originalUrl, url.includes(e.originalUrl));
        if (url.includes(e.originalUrl)) {
            return e;
        }
    }
    return null;
}

function getThemeSongSettingByCardId(id) {
    for (var i=0; i < options.length; i++) {
        var e = options[i];
        if (e.cardId == id) {
            return e;
        }
    }
    return null;
}

function registerCard(card) {
    var s = getThemeSongSettingByCardId(card.fixedId || card.id);
    if (s) {
        return s;
    }
    s = new ThemeSongSetting(card);
    options.push(s);
    return s;
}

window.$.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/baseThemeSongData.json", {}, function(data) {
    //console.log(data);
    baseThemeSongData = data;
    PrettyCards_plugin.events.emit.singleton("PrettyCards:baseThemeSongDataReady", data);
});

ExecuteWhen("allCardsReady PrettyCards:baseThemeSongDataReady", function() {
    for (var key in baseThemeSongData) {
        var card = window.getCardWithName(key);
        if (card) {
            var s = registerCard(card);
            for (var i=1; i <= baseThemeSongData[key]; i++) {
                s.addFile(`https://github.com/CMD-God/prettycards/raw/master/audio/cards/${card.name.replaceAll(" ", "_")}/intro_${i}.ogg`);
            }
        }
    }
    //console.log(options);
});

var originalAudio;

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    originalAudio = window.Audio;

    class AudioSpoofed extends Audio{
        constructor(name) {
            var setting = getThemeSongSettingByOriginalUrl(name);
            //console.log(name, setting);
            if (setting) {
                if (window.underscript.onPage("Game")) {
                    name = setting.getNextReplacement();
                } else {
                    name = setting.getRandomReplacement();
                }
            }
            //console.log("NAME", name);
            super(name);
        }
    }

    window.Audio = AudioSpoofed;
})

export {getThemeSongSettingByCardId};