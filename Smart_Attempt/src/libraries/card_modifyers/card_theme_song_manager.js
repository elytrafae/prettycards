import { PrettyCards_plugin, settings , addSetting } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

const FLOWEY_BASE_ATK = 4;
const HEROINE_BASE_ATK = 7;
const HEROINE_ATK_STEP = 1;
const SNOELLE_BASE_ATK = 2;
const SNOELLE_ATK_STEP = 1;

addSetting({
	'key': 'multi_theme_songs',
	'name': 'Enable Multiple Card Jingles', // Name in settings page
    'note': 'Also adds some sound effects to certain token cards.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
    'category': "card"
});

var randomnessSetting = addSetting({
	'key': 'theme_song_logic',
	'name': 'Theme Song Randomness Logic', // Name in settings page
    'note': `
        If Multiple Card Jingles is on alongside this and you are in a match, this setting will define the logic of how theme songs will be played.<br>
        - DEFAULT: All cards will play their available theme songs sequentially. Cards with defined logic will play their themes based on said logic<br>
        - RANDOM: All cards will play their available themes in random order. Cards with defined logic will still play their themes based on said logic.<br>
        - TRUE RANDOM: All cards will play their themes randomly, regardless of other logic<br>
        NOTE that due to preloading concerns, the order is randomized only once, and that order is kept until the page is reloaded`,
	'type': 'select',
    'options': ["DEFAULT", "RANDOM", "TRUE RANDOM"],
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
    'category': "card"
});

var themePreloadSetting = addSetting({
	'key': 'theme_song_preload',
	'name': 'Card Theme Song Preload', // Name in settings page
	'note': "If Multiple Card Jingles is on alongside this, songs will be preloaded to prevent delays between the action and the song actually playing",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "card"
});

class ThemeSongSetting {

    constructor(card) {
        this.cardId = card.fixedId || card.id;
        this.originalUrl = `musics/cards/${card.name.replaceAll(" ", "_")}.ogg`;
        this.replacements = [];
        this.randomreplacementorder = []; // Order used if the random setting is used!
        this.playedBefore = 0; // Only counts at times when it goes in order.
        this.playAsJingle = true;
        this.preloadedNr = -1; // This is only taken mid-game!
    }

    getNextReplacement() {
        var index = this.playedBefore % this.replacements.length;
        if (this.shouldUseMidGameRandomSystem()) {
            index = this.randomreplacementorder[index];
        }
        this.playedBefore++;
        return this.replacements[index];
    }

    getRandomReplacement() {
        return this.replacements[Math.floor(Math.random() * this.replacements.length)];
    }

    getReplacementOnCardData(card) {
        return null;
    }

    addFile(path) {
        this.replacements.push(path);
    }

    finishFileSetup() {
        for (var i=0; i < this.replacements.length; i++) {this.randomreplacementorder[i] = i;}
        utility.shuffleArray(this.randomreplacementorder);
    }

    // THIS IS ONLY FOR MID-GAME PRELOADING!
    preloadNext() {
        if (!themePreloadSetting.value()) {
            return;
        }
        this.preloadedNr++;
        if (this.preloadedNr >= this.replacements.length) {
            return; // All variants got loaded!
        } 
        var replacementIndex = this.shouldUseMidGameRandomSystem() ? this.randomreplacementorder[this.preloadedNr] : this.preloadedNr;
        // The error is usually just "yOu ShOuLd NoT pLaY aUdIo BeFoRe InTeRaCtInG wItH tHe PaGe"
        utility.preloadAudio(this.replacements[replacementIndex]).catch((e) => {});
    }

    shouldUseMidGameRandomSystem() {
        return randomnessSetting.value() == "TRUE RANDOM" || (randomnessSetting.value() == "RANDOM" && !this.getReplacementOnCardData(window.getCard(this.cardId)));
    }

    preloadAllIfInGame() {
        if ((underscript.onPage("Game") || underscript.onPage("Spectate")) && themePreloadSetting.value()) {
            for (var i=this.preloadedNr+1; i < this.replacements.length; i++) {
                // The error is usually just "yOu ShOuLd NoT pLaY aUdIo BeFoRe InTeRaCtInG wItH tHe PaGe"
                utility.preloadAudio(this.replacements[i]).catch((e) => {}); // Moving it to whenever a card is rendered, except during Games and Spectating.
            }
            this.preloadedNr = this.replacements.length;
        }
    }

}

/** @type {Array<ThemeSongSetting>} */
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

/**
 * Fetches the list of disabled cards in terms of theme songs for the currect season.
 * The list is empty if the season has no disabled cards.
 * @returns {String[]}
 */
function returnDisabledNameList() {
    if (!baseThemeSongData["_Disabled_Themes"]) {
        return [];
    }
    for (var i=0; i < baseThemeSongData["_Disabled_Themes"].length; i++) {
        var data = baseThemeSongData["_Disabled_Themes"][i];
        if (data.season_nr == utility.getSeasonNumber()) {
            return data.cards;
        }
    }
    return [];
}

ExecuteWhen("allCardsReady PrettyCards:baseThemeSongDataReady PrettyCards:TranslationExtReady", function() { // Has to wait for translations because season number for disabled check.
    var disabledNameList = returnDisabledNameList();
    for (var key in baseThemeSongData) {
        if (key == "_Disabled_Themes" || disabledNameList.includes(key)) {
            continue;
        }
        var isGame = underscript.onPage("Game") || underscript.onPage("Spectate");
        var card = window.getCardWithName(key);
        if (card) {
            var s = registerCard(card);
            s.playAsJingle = card.rarity == "LEGENDARY" || card.rarity == "DETERMINATION" || card.tribes.includes("ROYAL_INVENTION");
            for (var i=1; i <= baseThemeSongData[key]; i++) {
                s.addFile(utility.asset(`audio/cards/${card.name.replaceAll(" ", "_")}/intro_${i}.ogg`));
            }
            s.finishFileSetup();
            if (isGame) {
                s.preloadNext(); // Preload first theme to play, second one will follow when the first is played etc.
            }
        }
    }
    hardCodedCardInteractions();
    PrettyCards_plugin.events.emit.singleton("PrettyCards:customCardsSongsAppend");
    PrettyCards_plugin.events.emit.singleton("PrettyCards:themeSongsReady");
});

function hardCodedCardInteractions() {
    var snoelle = getThemeSongSettingByCardId(710);
    if (snoelle) {
        snoelle.getReplacementOnCardData = function(card) {
            if (card.originalAttack < 1) {
                return null;
            }
            return this.replacements[(card.originalAttack - SNOELLE_BASE_ATK)/SNOELLE_ATK_STEP];
        }
        snoelle.preloadAllIfInGame();
    }

    var flowey = getThemeSongSettingByCardId(54);
    if (flowey) {
        flowey.getReplacementOnCardData = function(card) {
            if (card.originalAttack < 1) {
                return null;
            }
            return this.replacements[(FLOWEY_BASE_ATK - card.originalAttack) % this.replacements.length];
        }
        flowey.preloadAllIfInGame();
    }

    var heroine = getThemeSongSettingByCardId(106);
    if (heroine) {
        heroine.getReplacementOnCardData = function(card) {
            if (card.originalAttack < 1) {
                return null;
            }
            return this.replacements[(HEROINE_BASE_ATK - card.originalAttack)/HEROINE_ATK_STEP];
        }
        heroine.preloadAllIfInGame();
    }

    /*
    var mtt_neo = getThemeSongSettingByCardId(110);
    if (mtt_neo) {
        mtt_neo.getReplacementOnCardData = function(card) {
            this.playedBefore++;
            return this.replacements[Math.min(this.playedBefore-1, this.replacements.length-1)]; // Have to reduce it by one because we increase the "playedBefore" counter before getting this, skipping the first one.
        }
    }
    */
}

var originalAudio;
var cardSoundFX;

function playSoundFX(address) {
    if (window.soundEnabled) {
        cardSoundFX = new Audio(address);
        cardSoundFX.volume = utility.getUnderscriptVolumeSettingValue("jingle");
        cardSoundFX.play();
    }
    
}


if (settings.multi_theme_songs.value()) {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {

        $.getJSON(utility.asset("json/baseThemeSongData.json"), {}, function(data) {
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
                    var name = randomnessSetting.value() == "TRUE RANDOM" ? null : setting.getReplacementOnCardData(card);
                    if (name == null) {
                        name = setting.getNextReplacement();
                    }
                    if (setting.playAsJingle) {
                        window.playJingle("NON EXISTENT CARD");
                        window.jingle.src = name;
                        window.jingle.play();
                    } else {
                        playSoundFX(name);
                    }
                    setting.preloadNext();
                }
            }) 
        } else {
            originalAudio = window.Audio;
            class AudioSpoofed extends Audio{
                constructor(name) {
                    var setting = getThemeSongSettingByOriginalUrl(name);
                    if (setting) {
                        name = setting.getRandomReplacement();
                    }
                    super(name);
                }
            }
            window.Audio = AudioSpoofed;
        }

        if (themePreloadSetting.value()) {
            // Caching system for non-game pages so that it doesn't load everything at once unnecessarily.
            var cards_preloaded = [];
            PrettyCards_plugin.events.on("func:appendCard PC_appendCard", function(card, element) {
                //var html$ = data.element;
                PrettyCards_plugin.events.on("PrettyCards:themeSongsReady", function() { // This makes sure these don't get appended before the page loads.
                    var id = card.fixedId || card.id;
                    if (!cards_preloaded.includes(id)) {
                        cards_preloaded.push(id);
                        var setting = getThemeSongSettingByCardId(id);
                        if (setting) {
                            setting.replacements.forEach( (url) => {
                                // The error is usually just "yOu ShOuLd NoT pLaY aUdIo BeFoRe InTeRaCtInG wItH tHe PaGe"
                                utility.preloadAudio(url).catch(()=>{});
                            })
                        }
                    }
                })

            })
        }
        
        
    })

} else {
    PrettyCards_plugin.events.emit.singleton("PrettyCards:themeSongsReady"); // Required for the normal song previews to still appear.
}

export {getThemeSongSettingByCardId, registerCard};
