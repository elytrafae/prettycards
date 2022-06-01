
import $ from "/src/third_party/jquery-3.6.0.min.js";

var allValuesLists = {};

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
                allValuesLists[key] = entry.values.length;
                for (var i=0; i < entry.values.length; i++) {
                    window.$.i18n.messageStore.set(lan, {[(key + "-" + i)]: entry.values[i]});
                }
            } else {
                window.$.i18n.messageStore.set(lan, {[key]: entry.value});
            }
        }
    }
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