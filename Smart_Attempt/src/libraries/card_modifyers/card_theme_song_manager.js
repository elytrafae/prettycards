import { PrettyCards_plugin, settings } from "../underscript_checker";
import { utility } from "../utility";

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

const FLOWEY_BASE_ATK = 4;
const HEROINE_BASE_ATK = 8;
const HEROINE_ATK_STEP = 2;

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

    getReplacementOnCardData(card) {
        return null;
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
    hardCodedCardInteractions();
    PrettyCards_plugin.events.emit.singleton("PrettyCards:customCardsSongsAppend");
    PrettyCards_plugin.events.emit.singleton("PrettyCards:themeSongsReady");
    //console.log(options);
});

function hardCodedCardInteractions() {
    var snoelle = getThemeSongSettingByCardId(710);
    if (snoelle) {
        snoelle.getReplacementOnCardData = function(card) {
            if (card.originalAttack < 1) {
                return null;
            }
            return this.replacements[card.originalAttack - 1];
        }
    }

    var flowey = getThemeSongSettingByCardId(54);
    if (flowey) {
        flowey.getReplacementOnCardData = function(card) {
            if (card.originalAttack < 1) {
                return null;
            }
            return this.replacements[(FLOWEY_BASE_ATK - card.originalAttack) % this.replacements.length];
        }
    }

    var heroine = getThemeSongSettingByCardId(106);
    if (heroine) {
        heroine.getReplacementOnCardData = function(card) {
            if (card.originalAttack < 1) {
                return null;
            }
            return this.replacements[(HEROINE_BASE_ATK - card.originalAttack)/HEROINE_ATK_STEP];
        }
    }
}

var originalAudio;
var cardSoundFX;

function playSoundFX(address) {
    cardSoundFX = new Audio(address);
    cardSoundFX.volume = 0.2;
    cardSoundFX.play();
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {

    if (window.underscript.onPage("Game")) {
        cardSoundFX = new Audio();
        PrettyCards_plugin.events.on("getMonsterPlayed getSpellPlayed", function(data) {
            var card = JSON.parse(data.card);
            var setting = getThemeSongSettingByCardId(card.fixedId || card.id);
            if (setting) {
                var name = setting.getReplacementOnCardData(card) || setting.getNextReplacement();
                if (card.rarity == "LEGENDARY" || card.rarity == "DETERMINATION") {
                    window.jingle.src = name;
                    window.jingle.play();
                } else {
                    playSoundFX(name);
                }
            }
        }) 
    } else {
        originalAudio = window.Audio;
        class AudioSpoofed extends Audio{
            constructor(name) {
                var setting = getThemeSongSettingByOriginalUrl(name);
                //console.log(name, setting);
                if (setting) {
                    name = setting.getRandomReplacement();
                }
                //console.log("NAME", name);
                super(name);
            }
        }
        window.Audio = AudioSpoofed;
    }

    
})

export {getThemeSongSettingByCardId};