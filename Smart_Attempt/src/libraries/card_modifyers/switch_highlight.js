import { prettycards, PrettyCards_plugin } from "../underscript_checker";
import {utility} from "/src/libraries/utility.js";

var switchStart = "{{KW:SWITCH}}:";
var switchSeparators = {
    en: " or "
}
var switchEnders = {
    en: "."
}


function switchifyCard(cardId, lan = "en") {
    var text = $.i18n.messageStore.get(lan, "card-" + cardId);
    var startPos = text.indexOf(switchStart);

    if (startPos < 0) {return;}
    var sepPos = text.indexOf(switchSeparators[lan], startPos);

    if (sepPos < 0) {return;}
    var endPos = text.indexOf(switchEnders[lan], sepPos);

    if (endPos < 0) {return;}
    // Has to be in a reverse order, since we are adding things to the "character array".
    text = text.splice(endPos, `</span>`);
    text = text.splice(sepPos + switchSeparators[lan].length, `<span class="PrettyCards_SwitchRight">`);
    text = text.splice(sepPos + switchSeparators[lan].length, `</span>`);
    text = text.splice(sepPos, `<span class="PrettyCards_SwitchSeparator">`);
    text = text.splice(sepPos, `</span>`);
    text = text.splice(startPos + switchStart.length + 1, `<span class="PrettyCards_SwitchLeft">`);

    $.i18n.messageStore.set(lan, {["card-" + cardId]: text});
    console.log(startPos, sepPos, endPos, text);
}

function switchifyLanguage(lan = 'en') {
    var messages = $.i18n.messageStore.messages[lan];
    for (var key in messages) {
        if (key.startsWith("card-") && !key.startsWith("card-name-")) {
            var id = Number(key.substring(5));
            switchifyCard(id, lan);
        }
    }
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function () {
    utility.loadCSSFromGH("SwitchHighlight");
})

// Feature temporarily disabled
/*
PrettyCards_plugin.events.on('translation:loaded', (data) => {
    console.log("Translation Value", data);
    switchifyLanguage('en');
    var lan = window.localStorage.getItem("language");
    if (!lan) { // Should never happen, but . . . 
        lan = window.getLanguage();
    }
    if (lan != "en") {
        switchifyLanguage(lan);
    }
});
*/

window.prettycards.switchifyCard = switchifyCard;