import { prettycards, PrettyCards_plugin } from "../underscript_checker";

prettycards.defaultMentions = {};

prettycards.defaultMentions.card = function(nameOrId, quantity = 1) {
    var id = Number(nameOrId);
    if (isNaN(id)) {
        var card = window.getCardWithName(nameOrId);
        id = card.fixedId || card.id;
    }
    return `{{CARD:${id}|${quantity}}}`
}

PrettyCards_plugin.events.on("translation:loaded", function() {

})