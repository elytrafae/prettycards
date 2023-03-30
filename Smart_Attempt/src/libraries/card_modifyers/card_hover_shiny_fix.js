
// This script aims to solve the issue of hovered cards being non-shiny on shiny cards.

import { PrettyCards_plugin, addSetting } from "../underscript_checker";

var shinyHoverFix = addSetting({
    'key': 'shiny_hover_fix',
    'name': 'Card Hover Helper Shiny Fix', // Name in settings page
    'note': `Hovering over a card's name to see what it is SHOULD now have proper shiny status based on the parent card.`,
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'category': "card"
});

var isShiny = true;

if (shinyHoverFix.value()) {
    PrettyCards_plugin.events.on("translation:loaded", function() {
        $.extend($.i18n.parser.emitter, {
            card: function(nodes) { // Mostly optimized version of Onu's code, with the exact same level of security.
                if (nodes.length <= 0) {
                    return;
                }
                var idCard = parseInt(nodes[0]);
                var text = checkOverride(nodes);
                if (text === null) {
                    var quantity = 1;
                    if (nodes.length > 1) {
                        var arg = nodes[1];
                        if (!isNaN(arg)) {
                            quantity = parseInt(arg);
                        }
                    }
                    text = $.i18n('card-name-' + idCard, quantity);
                }
                return '<span onmouseover="displayCardHelp(this, ' + idCard + ', '+ isShiny.toString() +');" onmouseleave="removeCardHover();" class="PATIENCE">' + text + '</span>';
            }
        })
    })

    PrettyCards_plugin.events.on("pre:func:appendCard", function(card) {
        isShiny = card.shiny; 
        console.log("isShiny UPDATED:" , isShiny);
    })

    PrettyCards_plugin.events.on("func:appendCard", function(data) {
        isShiny = false;
    })
}
