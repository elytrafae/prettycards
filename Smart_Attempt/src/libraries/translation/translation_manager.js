
import { rarityIconsHTML } from "../rarity_icons";
import { prettycards, PrettyCards_plugin, settings, addSetting } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

// pc-shops-.*-(dial|(talk(?!-title)))

class TranslationManager {

    constructor() {
        this.allValuesLists = {};
        this.languageSources = [];
        this.previewTypes = [];
        this.addPreviewType("default", /.*/, (str) => {return `<span>${str}</span>`}, 0);
    }

    addLanguageSource(name = "DEFAULT_NAME", urlFunc = (lan) => lan) {
        this.languageSources.push({
            name: name,
            urlFunc: urlFunc
        })
    }

    addPreviewType(name = "DEFAULT_MAME", regex = /.*/, eleFunc = () => {}, priority = 0, onremove = () => {}) {
        var previewType = {
            name: name,
            regex: regex,
            eleFunc: eleFunc,
            priority: priority,
            onremove: onremove
        };
        var index = 0;
        while (index < this.previewTypes.length && this.previewTypes[index].priority > priority) {
            index++;
        }
        this.previewTypes.splice(index, 0, previewType);
        return previewType;
    }

    getStringOrList(key) {
        if (this.allValuesLists[key]) {
            return this.getTranslatedValueList(key);
        }
        return window.$.i18n(key);
    }

    getTranslatedValueList(key) {
        var list = [];
        for (var i=0; i < this.allValuesLists[key]; i++) {
            list.push(this.getFromValueList(key, i));
        }
        return list;
    }

    getFromValueList(key, index) {
        return window.$.i18n(this.getListKeyIndex(key, index));
    }

    getRandomFromValueList(key) {
        return this.getFromValueList(key, utility.randomInt(0, this.allValuesLists[key]));
    }

    getListKeyIndex(key, i) {
        return key + "-" + i;
    }

    getWithFallback(key, fb, param) {
        var t = window.$.i18n(key, param);
        if (t == key) {
            return fb;
        }
        return t;
    }

}

var translationManager = new TranslationManager();

// STUFF RELATED TO APRIL FOOLS

var aprilTranslationSetting = addSetting({
    'key': 'april_fools_wording',
    'name': 'Uglycards Wording', // Name in settings page
    'type': 'select',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true,//(utility.getSeasonNumber() >= 81 && utility.getSeasonMonth() == 3), // default value
    'hidden': utility.getSeasonNumber() < 81,
    'category': "april"
});

PrettyCards_plugin.events.on("PrettyCards:registerTranslationSources", function() {
    console.log("MONTH", utility.getSeasonNumber());
    if (aprilTranslationSetting.value()){ // && utility.getSeasonMonth() == 3) {
        var translationFileSource = (lan) => `https://raw.githubusercontent.com/CMD-God/prettycards/master/json/translation/april/${lan}.json`;
        translationManager.addLanguageSource("PrettyCards:UglyWording", translationFileSource);
    }
    translationManager.addLanguageSource("PrettyCards:Core", (lan) => `https://raw.githubusercontent.com/CMD-God/prettycards/master/json/translation/${lan}.json`);
})

///////////////////////////////

var languagesToLoad = 0;

function processJSON(lan, data) {
    //$.i18n.messageStore.set(lan, {[key]: processString(messages[key])});
    for (var key in data) {
        var entry = data[key];
        if (typeof(data[key]) == "string") {
            window.$.i18n.messageStore.set(lan, {[key]: entry});
        } else {
            if (entry.ifEqual && window.$.i18n.messageStore.get(lan, key) != entry.ifEqual) {
                continue;
            }
            if (entry.values) {
                translationManager.allValuesLists[key] = entry.values.length;
                for (var i=0; i < entry.values.length; i++) {
                    window.$.i18n.messageStore.set(lan, {[translationManager.getListKeyIndex(key, i)]: entry.values[i]});
                }
            } else {
                window.$.i18n.messageStore.set(lan, {[key]: entry.value});
            }
        }
    }
    progressLanguagesToLoad();
}

function progressLanguagesToLoad() {
    languagesToLoad--;
    if (languagesToLoad <= 0) {
        PrettyCards_plugin.events.emit.singleton("PrettyCards:TranslationExtReady");
    }
}

function loadLanguage(lan = 'en') {
    translationManager.languageSources.forEach((source) => {
        $.getJSON(source.urlFunc(lan), {}, function(data) {
            processJSON(lan, data);
        }).fail(function() {
            console.warn(`Language file from source "${source.name}" for language "${lan}", from address "${source.urlFunc(lan)}" could not be loaded!`);
            progressLanguagesToLoad();
        })
    })
}

function switchPartHelper(nodes, className) {
    var opacity = Number(nodes[0]);
    if (isNaN(opacity)) {
        opacity = 1;
    }
    var classPart = `class="PrettyCards_SwitchHighlight_${className}" `;
    if (!settings.switch_highlight.value()) {
        classPart = "";
    }
    var text = nodes[1];
    return `<span ${classPart}style="opacity:${opacity}; ${opacity <= 0 ? "display:none;" : ""}">${text}</span>`;
}

function registerCustomExtensions() {
    window.$.extend(window.$.i18n.parser.emitter, {
        pc_artifacts: function(nodes) {
            var text = nodes[0];
            var idArray = [];
            for (var i=1; i < nodes.length; i++) {
                idArray.push(Number(nodes[i]));
            }
            //prettycards.viewArtifactsInfoForIdArray
            return `<span class="helpPointer underlined" oncontextmenu="prettycards.viewArtifactsInfoForIdArray([${idArray.join(",")}]);">${text}</span>`
        },
        pc_switch_cyan: function(nodes) {
            return switchPartHelper(nodes, "Cyan");
        },
        pc_switch_red: function(nodes) {
            return switchPartHelper(nodes, "Red");
        },
        /*
        pc_switch: function(nodes) {
            var text = nodes[0];
            text = text.replaceAll("SWITCH", window.$.i18n("{{KW:SWITCH}}"));
            text = `<span class="PrettyCards_SwitchHighlight_Start">${text}</span>`;
            text += `<span class="PrettyCards_SwitchHighlight_Cyan">${nodes[1]}</span>`;
            text += `<span class="PrettyCards_SwitchHighlight_Middle">${nodes[2]}</span>`;
            text += `<span class="PrettyCards_SwitchHighlight_Red">${nodes[3]}</span>`;
            return text;
        },*/
        pc_raricon: function(nodes) {
            var ext = nodes[0];
            var rarity = nodes[1];
            return rarityIconsHTML[ext][rarity];
        },
        pc_shiny: function(nodes) {
            var text = nodes[0];
            return `<span class="rainbowText">${text}</span>`;
        },
        pc_tc: function(nodes) {
            var cmdName = nodes[0].toLowerCase();
            if (nodes.length == 1) {
                return "[" + cmdName + "]"
            }
            nodes.splice(0, 1);
            return "[" + cmdName + ":" + nodes.join("|") + "]";
        },
        pc_en_poss: function(nodes) {
            if (nodes[0].endsWith('s')) {
                return nodes[0] + "'";
            }
            return nodes[0] + "'s";
        }
    })
}

function prePageLoadStuff() {
    var lan = window.localStorage.getItem("language");
    if (!lan) { // Should never happen, but . . . 
        lan = window.getLanguage();
    }
    PrettyCards_plugin.events.on('translation:loaded', () => {
        registerCustomExtensions();
        PrettyCards_plugin.events.emit.singleton("PrettyCards:registerTranslationSources");
        PrettyCards_plugin.events.emit.singleton("PrettyCards:translationSourcesDone");
        if (lan != "en") {
            languagesToLoad = translationManager.languageSources.length*2;
            loadLanguage('en');
            loadLanguage(lan);
        } else {
            languagesToLoad = translationManager.languageSources.length;
            loadLanguage('en');
        }
    })
}

prePageLoadStuff();

prettycards.translationManager = translationManager;

export {translationManager};