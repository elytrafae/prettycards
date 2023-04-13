
import { PrettyCards_plugin, addSetting } from "../underscript_checker";
import { utility } from "../utility";

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
    SetUpCardEvent();
}

var dust = 0;
var collection = []; // Optimized collection data.
var newCollection = []; // Basically Crafting Collection except TOKENS and non-owned DTs
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

function CanCraftMore(card) {
    var rarity = card.rarity;
    return (!uncraftableRarities.includes(rarity)) && card.quantity < underscript.utils.rarity.max(rarity) && dust >= underscript.utils.rarity.cost(rarity, card.shiny);
}

// Trims the collection to only contain minimal data, and only for actually craftable cards!
function TrimCollection(collection) {
    var trimmedCollection = [];
    for (var i=0; i < collection.length; i++) {
        var card = collection[i];
        var rarity = card.rarity;
        if (CanCraftMore(card)) {
            trimmedCollection.push({
                shiny: card.shiny,
                quantity: card.quantity,
                id: card.id,
                rarity: rarity
            });
        }
        if ((!uncraftableRarities.includes(rarity)) || (card.quantity > 0)) {
            newCollection.push(card);
        }
    }
    PrettyCards_plugin.events.emit.singleton("PrettyCards:DeckCollectionAppendReady");
    return trimmedCollection;
}

function AppendCollection() {
    PrettyCards_plugin.events.on("Deck:Loaded", () => {
        PrettyCards_plugin.events.on("PrettyCards:DeckCollectionAppendReady", () => {
            window.collection = newCollection;
            /*
            for (var i=0; i < collectionToAppend.length; i++) {
                window.collection.push(collectionToAppend[i]);
            }*/

            /*
            window.collection.sort((a, b) => {
                if (a.cost == b.cost) {
                    if (window.$.i18n(`card-${a.id}-name`) === window.$.i18n(`card-${b.id}-name`)) {
                        return a.shiny - b.shiny;
                    }
                    return compare(window.$.i18n(`card-${a.id}-name`), window.$.i18n(`card-${b.id}-name`));
                }
                return a.cost - b.cost;
            })*/

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

// Maybe I should somehow make this work with binary search, but the optional presence of shiny/nonshiny cards mess it up . . .
function SearchInCraftableCollection(id, shiny) {
    for (var i=0; i < collection.length; i++) {
        var card = collection[i];
        if (card.id === id && card.shiny === shiny) {
            return card;
        }
    }
    return null;
}

function SetUpCardEvent() {
    PrettyCards_plugin.events.on("func:appendCardDeck", function(card, element) {
        //console.log(card, element);
        var carftData = SearchInCraftableCollection(card.id, card.shiny);
        //if (carftData && CanCraftMore(carftData)) {
        if (carftData) {
            utility.addCustomSimpleTextIconToCard2(element, "/images/icons/dust.png", "Craft!", "Crafting UI here!", `Craft ${card.shiny ? "Shiny " : ""}${window.$.i18n(`card-name-${card.id}`)}`);
        }
    })
}