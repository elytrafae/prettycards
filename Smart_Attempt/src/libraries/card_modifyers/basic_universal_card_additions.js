
import { utility } from "../utility";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

import { loadCSS } from "../../libraries/css_loader";
import css from "../../css/CardAdditions.css";
loadCSS(css);

const CARD_INFO_CLASS = "PrettyCards_CardBottomLeftInfo";

PrettyCards_plugin.events.on("func:appendCard PC_appendCard", function(card, element) {
    
    getOrCreateCardBottomLeftInfo(element);
})

function getOrCreateCardBottomLeftInfo(cardElem) {
    if (cardElem[0]) {
        cardElem = cardElem[0];
    }
    var infoArea = cardElem.querySelector("." + CARD_INFO_CLASS);
    if (!infoArea) {
        infoArea = document.createElement("DIV");
        infoArea.className = CARD_INFO_CLASS;
        cardElem.appendChild(infoArea);
    }
    return infoArea;
}

export {getOrCreateCardBottomLeftInfo};