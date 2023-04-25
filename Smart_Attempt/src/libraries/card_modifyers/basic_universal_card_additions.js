
import { utility } from "../utility";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("CardAdditions");
});

PrettyCards_plugin.events.on("func:appendCard PC_appendCard", function(card, element) {
    
    if (element.find(`.PrettyCards_CardBottomLeftInfo`).length > 0) { // If it triggered already, don't do it again;
        return;
    }

    element.append(`<div class="PrettyCards_CardBottomLeftInfo"></div>`);
})