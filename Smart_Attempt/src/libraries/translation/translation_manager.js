
import $ from "/src/third_party/jquery-3.6.0.min.js";

function processJSON(lan, data) {
    //$.i18n.messageStore.set(lan, {[key]: processString(messages[key])});
    for (var key in data) {
        if (typeof(data[key]) == "string") {
            window.$.i18n.messageStore.set(lan, {[key]: data[key]});
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

function prePageLoadStuff() {
    loadLanguage('en');
    var lan = window.localStorage.getItem("language");
    if (!lan) { // Should never happen, but . . . 
        lan = window.getLanguage();
    }
    if (lan != "en") {
        loadLanguage(lan);
    }
}

prePageLoadStuff();