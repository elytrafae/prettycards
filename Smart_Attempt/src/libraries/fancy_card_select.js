
import { utility } from "./utility";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

var background = null;
var dummyDialogue = { // This is so Onu can properly close this thing.
    close : function() {
        background.remove();
        background == null;
        $("body").removeClass("PrettyCards_LookAt_NoScroll");
    }
}

function LookAtCards(selectCards) {
    //console.log(selectCards);
    //if (background != null) {return;}
    window.selectCardDialog = dummyDialogue;

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
    for (var i=0; i < selectCards.length; i++) {
        var appendedCard = window.appendCard(selectCards[i], $(cardContainer));
        appendedCard.css("margin", "6px");
        /*
        if (selectCards.length <= 5) {
            appendedCard.css("transform", "scale(2)");
            appendedCard.css("width", "352px");
            appendedCard.css("height", "492px");
            appendedCard.css("margin", "12px");
        } else if (selectCards.length <= 7) {
            appendedCard.css("transform", "scale(1.5)");
            appendedCard.css("width", "264px");
            appendedCard.css("height", "369px");
            appendedCard.css("margin", "9px");
        }
        */
        appendedCard.click(function (e) {
            if (e.button === 0) {
                var idCard = $(this).attr('id');
                sendEffectTarget(idCard);
            }
        });;
    }
    container.appendChild(cardContainer);

    document.body.appendChild(background);
}

settings.fancy_card_select = PrettyCards_plugin.settings().add({
    'key': 'fancy_card_select',
    'name': 'Enable Fancy "Choose a card" screen in games.', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'onChange': function(newVal) {
        window.showSelectCards = newVal ? LookAtCards : oldShowSelectCards;
    }
});

var oldShowSelectCards;

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function () {
    oldShowSelectCards = window.showSelectCards;
    utility.loadCSSFromGH("LookAtCards");
    if (settings.fancy_card_select.value()) {
        window.showSelectCards = LookAtCards;
    }
});

