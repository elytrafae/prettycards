
import $ from "/src/third_party/jquery-3.6.0.min.js";

function LoadLanguage(lan = 'en') {
    $.getJSON("")
}

PrettyCards_plugin.events.on('translation:loaded PrettyCards:customCardsAfter', () => {
    //console.log("CARD CORRECTIONS LOADED!");
    processLanguage('en');
    var lan = window.localStorage.getItem("language");
    if (!lan) { // Should never happen, but . . . 
        lan = window.getLanguage();
    }
    if (lan != "en") {
        processLanguage(lan);
    }
});