
import { PrettyCards_plugin, addSetting } from "../underscript_checker";

var craftingInDecksSetting = addSetting({
    'key': 'crafting_in_decks',
    'name': 'Crafting in Decks Page', // Name in settings page
    'note': `An icon on craftable cards will appear. Clicking it will display a menu for crafting. Uncrafting in the Decks page is not supported.`,
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value 
});

if (craftingInDecksSetting.value() && window.underscript.onPage("Decks")) {
    GrabDust();
    AppendCollection();
}

var dust = 0;
var collection = [];
var collectionToAppend = []; // The cards to append to the Deck collection from the Crafting collection that can be crafted, but have none of.
var uncraftableRarities = ["TOKEN", "DETERMINATION"]; // BASE is not here because shinies can be crafted

function GrabDust() {
    window.$.get("/Crafting", {}, function(data) {
        var page$ = window.$(data);
        var dust$ = page$.find("#dust");
        if (dust$[0]) {
            dust = Number(dust$[0].innerHTML);
        }
        console.log("DUST", dust);
        if (dust < underscript.utils.rarity.cost("COMMON", false)) { // If you can't even craft a non-shiny common card, don't bother going on.
            console.warn("Craftuing in Decks page: Insufficient Dust to craft anything. Won't continue forward.");
        } else {
            GrabCraftingCollection();
        }
    })
}

function GrabCraftingCollection() { // I shall play by Onu's rules, IG.
    window.$.getJSON("/CraftConfig", {}, function(data) {
        collection = TrimCollection(JSON.parse(data.collection));
    })
}

// Trims the collection to only contain minimal data, and only for actually craftable cards!
function TrimCollection(collection) {
    var newCollection = [];
    for (var i=0; i < collection.length; i++) {
        var card = collection[i];
        var rarity = card.rarity;
        if ((!uncraftableRarities.includes(rarity)) && card.quantity < underscript.utils.rarity.max(rarity) && dust >= underscript.utils.rarity.cost(rarity, card.shiny)) {
            newCollection.push({
                shiny: card.shiny,
                quantity: card.quantity,
                id: card.id,
                rarity: rarity
            });
            if (card.quantity <= 0) {
                collectionToAppend.push(card);
            }
        }
    }
    PrettyCards_plugin.events.emit.singleton("PrettyCards:DeckCollectionAppendReady");
    return newCollection;
}

function AppendCollection() {
    PrettyCards_plugin.events.on("Deck:Loaded", () => {
        PrettyCards_plugin.events.on("PrettyCards:DeckCollectionAppendReady", () => {
            for (var i=0; i < collectionToAppend.length; i++) {
                window.collection.push(collectionToAppend[i]);
            }

            window.collection.sort((a, b) => {
                if (a.cost == b.cost) {
                    if (window.$.i18n(`card-${a.id}-name`) === window.$.i18n(`card-${b.id}-name`)) {
                        return a.shiny - b.shiny;
                    }
                    return compare(window.$.i18n(`card-${a.id}-name`), window.$.i18n(`card-${b.id}-name`));
                }
                return a.cost - b.cost;
            })

            // Copied code from Onu to actually update the soul collections.
            for (var deckSoul in window.decks) {
                window.deckCollections[deckSoul] = [];
                for (var i = 0; i < window.collection.length; i++) {
                    var card = JSON.parse(JSON.stringify(window.collection[i]));
                    if (card.typeCard === 0 || (card.hasOwnProperty('soul') && card.soul.name === deckSoul) || playground) {
                        card.quantity = card.quantity - window.getQuantityInDeck(card, deckSoul);
                        window.deckCollections[deckSoul].push(card);
                    }
                }
            }
        })
    })
}

