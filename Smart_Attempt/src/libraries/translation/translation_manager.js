
import { PrettyCards_plugin } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

class TranslationManager {

    constructor() {
        this.allValuesLists = {};
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

    getWithFallback(key, fb) {
        var t = window.$.i18n(key);
        if (t == key) {
            return fb;
        }
        return t;
    }

}

var translationManager = new TranslationManager();

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
    PrettyCards_plugin.events.emit("PrettyCards:TranslationExtReady", {language: lan});
}

function loadLanguage(lan = 'en') {
    $.getJSON(`https://raw.githubusercontent.com/CMD-God/prettycards/master/json/translation/${lan}.json`, {}, function(data) {
        PrettyCards_plugin.events.on('translation:loaded', () => {
            processJSON(lan, data);
        })
    })
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
        pc_switch_start: function(nodes) {
            var text = window.$.i18n("pc-switch-start");
            var overrideText = window.checkOverride(nodes);
            if (overrideText) {
                text = overrideText;
            }
            text = text.replaceAll("SWITCH", window.$.i18n("{{KW:SWITCH}}"));
            return `<span class="PrettyCards_SwitchHighlight_Start">${text}</span>`;
        },
        pc_switch_cyan: function(nodes) {
            var text = nodes[0];
            return `<span class="PrettyCards_SwitchHighlight_Cyan">${text}</span>`;
        },
        pc_switch_middle: function(nodes) {
            var text = nodes[0];
            return `<span class="PrettyCards_SwitchHighlight_Middle">${text}</span>`;
        },
        pc_switch_red: function(nodes) {
            var text = nodes[0];
            return `<span class="PrettyCards_SwitchHighlight_Red">${text}</span>`;
        },
        pc_switch: function(nodes) {
            var text = nodes[0];
            text = text.replaceAll("SWITCH", window.$.i18n("{{KW:SWITCH}}"));
            text = `<span class="PrettyCards_SwitchHighlight_Start">${text}</span>`;
            text += `<span class="PrettyCards_SwitchHighlight_Cyan">${nodes[1]}</span>`;
            text += `<span class="PrettyCards_SwitchHighlight_Middle">${nodes[2]}</span>`;
            text += `<span class="PrettyCards_SwitchHighlight_Red">${nodes[3]}</span>`;
            return text;
        }
    })
}

function prePageLoadStuff() {
    loadLanguage('en');
    var lan = window.localStorage.getItem("language");
    if (!lan) { // Should never happen, but . . . 
        lan = window.getLanguage();
    }
    if (lan != "en") {
        loadLanguage(lan);
    }
    PrettyCards_plugin.events.on('translation:loaded', () => {
        registerCustomExtensions();
    })
}

prePageLoadStuff();

export {translationManager};