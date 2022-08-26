import { PrettyCards_plugin, settings , addSetting } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

const FLOWEY_BASE_ATK = 4;
const HEROINE_BASE_ATK = 8;
const HEROINE_ATK_STEP = 2;

addSetting({
	'key': 'multi_theme_songs',
	'name': 'Enable Multiple Card Jingles', // Name in settings page
    'note': 'Also adds some sound effects to certaion token cards.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

class ThemeSongSetting {

    constructor(card) {
        this.cardId = card.fixedId || card.id;
        this.originalUrl = `musics/cards/${card.name.replaceAll(" ", "_")}.ogg`;
        this.replacements = [];
        this.playedBefore = 0; // Only counts at times when it goes in order.
        this.playAsJingle = true;
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
        if (underscript.onPage("Game") || underscript.onPage("Spectate")) {
            utility.preloadAudio(path); // Moving it to whenever a card is rendered, except during Games and Spectating.
        }
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

ExecuteWhen("allCardsReady PrettyCards:baseThemeSongDataReady", function() {
    for (var key in baseThemeSongData) {
        var card = window.getCardWithName(key);
        if (card) {
            var s = registerCard(card);
            s.playAsJingle = card.rarity == "LEGENDARY" || card.rarity == "DETERMINATION" || card.tribes.includes("ROYAL_INVENTION");
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

    var mtt_neo = getThemeSongSettingByCardId(110);
    if (mtt_neo) {
        mtt_neo.getReplacementOnCardData = function(card) {
            this.playedBefore++;
            return this.replacements[Math.min(this.playedBefore-1, this.replacements.length-1)]; // Have to reduce it by one because we increase the "playedBefore" counter before getting this, skipping the first one.
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


if (settings.multi_theme_songs.value()) {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {

        $.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/baseThemeSongData.json", {}, function(data) {
            //console.log(data);
            baseThemeSongData = data;
            PrettyCards_plugin.events.emit.singleton("PrettyCards:baseThemeSongDataReady", data);
        });

        if (window.underscript.onPage("Game") || window.underscript.onPage("Spectate")) {
            cardSoundFX = new Audio();
            PrettyCards_plugin.events.on("getMonsterPlayed getSpellPlayed", function(data) {
                var card = JSON.parse(data.card);
                // Will trigger when a monster's Dust effect triggers.
                // Why would that happen? Well, apparently, for Onu Dust effect = Spell.
                if (card.typeCard == 0 && data.action == "getSpellPlayed") { 
                    return;
                }
                var setting = getThemeSongSettingByCardId(card.fixedId || card.id);
                if (setting) {
                    var name = setting.getReplacementOnCardData(card) || setting.getNextReplacement();
                    if (setting.playAsJingle) {
                        window.playJingle("NON EXISTENT CARD");
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

        // Caching system for non-game pages so that it doesn't load everything at once unnecessarily.
        var cards_preloaded = [];
        PrettyCards_plugin.events.on("appendCard() PC_appendCard", function(data) {
            //var html$ = data.element;
            var card = data.card;
            PrettyCards_plugin.events.on("PrettyCards:themeSongsReady", function() { // This makes sure these don't get appended before the page loads.
                var id = card.fixedId || card.id;
                if (!cards_preloaded.includes(id)) {
                    cards_preloaded.push(id);
                    var setting = getThemeSongSettingByCardId(id);
                    if (setting) {
                        setting.replacements.forEach( (url) => {
                            utility.preloadAudio(url);
                        })
                    }
                }
            })

        })
        
    })

} else {
    PrettyCards_plugin.events.emit.singleton("PrettyCards:themeSongsReady"); // Required for the normal song previews to still appear.
}

export {getThemeSongSettingByCardId, registerCard};
