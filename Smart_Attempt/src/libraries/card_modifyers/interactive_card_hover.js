import { addSetting, PrettyCards_plugin } from "../underscript_checker";

var cardHoverSetting = addSetting({
    'key': 'interactive_card_hover',
    'name': 'Interactive card Hover Helper', // Name in settings page
    'note': `Hovering over a card's name to see what it is is not moved over to an interractive tippy hover, which lets you click on things on that card as well. Useful for nested TOKEN references.`,
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': false,//true, // default value
    'hidden': true,
    'category': "card"
});

var overwritten = false;
var oldFn;

function overrideCardHover() {
    if (overwritten || !window.displayCardHelp) {
        return;
    }
    overwritten = true;
    oldFn = window.displayCardHelp;

    window.displayCardHelp = function(element, cardId, shiny = false) {
        if (!cardHoverSetting.value()) {
            return oldFn(...arguments);
        }
        if (!window.cardHoverEnabled) {
            return;
        }
        var card = window.getCard(cardId);
        if (!card) {
            console.warn("No card is registered with the ID of ", cardId);
            return;
        }
        var parent$ = window.$("<div></div>");
        var oldShiny = card.shiny; // Trash, but theoretically most efficient way of temporarily changing the card's shiny status for rendering.
        card.shiny = shiny;
        var card$ = window.appendCard(card, parent$);
        card.shiny = oldShiny;
        window.tippy(element, {
            content: parent$[0],
            arrow: false,
            animation: false,
            interactive: true,
            placement: "left-end",
            appendTo: window.document.body,
            boundary: 'window',
            getReferenceClientRect: window.document.body.getBoundingClientRect,
        });
    }
}

overrideCardHover();
PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    overrideCardHover();
})
