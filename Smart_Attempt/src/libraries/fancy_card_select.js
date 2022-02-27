
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

var background = null;
var dummyDialogue = { // This is so Onu can properly close this thing.
    close : function() {
        background.remove();
        background == null;
    }
}

function LookAtCards(selectCards) {
    console.log(selectCards);
    if (background != null) {return;}

    document.body.className += " PrettyCards_LookAt_NoScroll";

    background = document.createElement("DIV");
    background.className = "PrettyCards_LookAt_Background";

    var container = document.createElement("DIV");
    container.className = "PrettyCards_LookAt_Container";
    background.appendChild(container);

    var title = document.createElement("DIV");
    title.className = "PrettyCards_LookAt_Title";
    title.innerHTML = window.$.i18n('game-select-card');
    container.appendChild(title);

    var cardContainer = document.createElement("DIV");
    cardContainer.className = "PrettyCards_LookAt_CardContainer";
    container.appendChild(cardContainer);
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function () {
    window.showSelectCards = LookAtCards;
});