import { PrettyCards_plugin } from "./underscript_checker";
import { utility } from "./utility";


PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("PersonaOverlay");
})

function CreateOverlay(card, side) {
    var border = $('<div class="PrettyCards_PersonaBorder"></div>');
    var back = $('<div class="PrettyCards_PersonaBack"></div>');
    border.append(back);
    var image = $(`<img src="images/cards/${card.image}.png">`);
    back.append(image);

    $("body").append(border);
}

window.prettycards.createPersonaOverlay = CreateOverlay;