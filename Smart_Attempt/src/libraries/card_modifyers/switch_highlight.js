import { prettycards, PrettyCards_plugin } from "../underscript_checker";

var switchStart = "{{KW:SWITCH}}:";
var switchSeparators = {
    en: " or "
}
var switchEnders = {
    en: "."
}


function switchifyCard(card, lan = "en") {
    var text = $.i18n.messageStore.get(lan, "card-" + card.fixedId);
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

    $.i18n.messageStore.set(lan, {["card-" + card.fixedId]: text});
    console.log(startPos, sepPos, endPos, text);
}

PrettyCards_plugin.events.on('translation:loaded', (data) => {
    console.log("Translation Value", data);
    //kromerify("en");
    var lan = window.localStorage.getItem("language");
    if (!lan) { // Should never happen, but . . . 
        lan = window.getLanguage();
    }
    //if (lan != "en") {
    //    kromerify(lan);
    //}
});

window.prettycards.switchifyCard = switchifyCard;