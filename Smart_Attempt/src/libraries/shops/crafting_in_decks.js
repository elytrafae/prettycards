
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
    var trimmedCollection = RefreshTrimmedCollection(collection, false);
    collection.forEach((card) => {
        if ((!uncraftableRarities.includes(card.rarity)) || (card.quantity > 0)) {
            newCollection.push(card);
        }
    })
    PrettyCards_plugin.events.emit.singleton("PrettyCards:DeckCollectionAppendReady");
    return trimmedCollection;
}

// Collection can be both trimmed and untrimmed
function RefreshTrimmedCollection(collection, alreadyTrimmed = true) {
    var trimmedCollection = [];
    for (var i=0; i < collection.length; i++) {
        var card = collection[i];
        if (CanCraftMore(card)) {
            if (alreadyTrimmed) {
                trimmedCollection.push(card);
            } else {
                trimmedCollection.push({
                    shiny: card.shiny,
                    quantity: card.quantity,
                    id: card.id,
                    rarity: card.rarity
                });
            }
        }
    }
    return trimmedCollection;
}

function AppendCollection() {
    PrettyCards_plugin.events.on("Deck:Loaded", () => {
        PrettyCards_plugin.events.on("PrettyCards:DeckCollectionAppendReady", () => {
            window.collection = newCollection;

            // Copied code from Onu to actually update the soul collections.
            for (var deckSoul in window.decks) {
                window.deckCollections[deckSoul] = [];
                for (var i = 0; i < window.collection.length; i++) {
                    var card = JSON.parse(JSON.stringify(window.collection[i]));
                    if (card.typeCard === 0 || (card.hasOwnProperty('soul') && card.soul.name === deckSoul) || window.playground) {
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
        var craftData = SearchInCraftableCollection(card.id, card.shiny);
        //if (carftData && CanCraftMore(carftData)) {
        if (craftData) {
            var dustIcon = `<img style="height:1.6em;" src="/images/icons/dust.png">`;
            var shinyText = craftData.shiny ? `<span class="rainbowText">S</span> ` : '';
            var name = shinyText + $.i18n('card-name-' + card.id, 1);
            var dust$ = window.$(`<p style="font-size: 1.2em;">${dustIcon} ${dust}</p>`);

            var maxCraftCount = MaxCraftCount(craftData);
            if (maxCraftCount <= 0) {
                return;
            }

            var oneButton = window.$(`<button class="btn btn-success">Craft One (-${underscript.utils.rarity.cost(craftData.rarity, craftData.shiny)} ${dustIcon})</button>`);
            var moreButton = window.$(`<button class="btn btn-success">Craft x${maxCraftCount} (-${underscript.utils.rarity.cost(craftData.rarity, craftData.shiny)*maxCraftCount} ${dustIcon})</button>`);
            oneButton.click(() => {
                oneButton.prop('disabled', true);
                moreButton.prop('disabled', true);
                CraftOne(craftData);
            });

            moreButton.click(() => {
                oneButton.prop('disabled', true);
                moreButton.prop('disabled', true);
                CraftMore(craftData, maxCraftCount);
            });

            var craftingUI = $(`<div></div>`);
            craftingUI.append(dust$);
            craftingUI.append(oneButton);
            craftingUI.append(moreButton);
            
            utility.addCustomSimpleTextIconToCard2(element, "/images/icons/dust.png", "Craft!", craftingUI, window.$.i18n('crafting-title', name));
        }
    })
}

function MaxCraftCount(craftData) {
    var maxCraft = underscript.utils.rarity.max(craftData.rarity) - craftData.quantity;
    if (maxCraft <= 0) {
        return 0;
    }
    var cost = underscript.utils.rarity.cost(craftData.rarity, craftData.shiny);
    if (dust < cost*maxCraft) {
        maxCraft = Math.floor(dust/cost);
    }
    return maxCraft;
}

function CraftMore(craftData, count) {

    SilentCraft(craftdata.id, craftData.shiny).then((data) => {
        window.BootstrapDialog.closeAll();
    }).catch((data) => {

    })
}

function CraftOne(craftData) {
    SilentCraft(craftdata.id, craftData.shiny).then((data) => {
        window.BootstrapDialog.closeAll();
        var shinyText = craftData.shiny ? `<span class="rainbowText">S</span> ` : '';
        var name = shinyText + $.i18n('card-name-' + card.id, 1);
        window.BootstrapDialog.show({
            type: window.BootstrapDialog.TYPE_SUCCESS,
            title: $.i18n('crafting-title', name),
            message: $.i18n('crafting-craft-success', name),
            buttons: [{
                label: $.i18n('dialog-ok'),
                cssClass: 'btn-primary',
                action: function(dialog) {
                    dialog.close();
                }
            }]
        });
    }).catch((data) => {
        window.BootstrapDialog.closeAll();
    })
}

function SilentCraft(id, shiny, updateCardList = true) {
    // Am I just flexing the fact that I could do this manually, while using far less resources to generate the JSON text? Yes.
    var JSON_data = `{"action": "craft", "idCard": ${id}, "isShiny": ${shiny ? "true" : "false"}}`;
    return new Promise((resolve, reject) => {
        window.$.post(`/CraftConfig`, JSON_data, function(data) {
            if (data.status === "success") {
                if (updateCardList) {
                    dust = data.dust;

                    // Update Optimized Craft List
                    craftData.quantity++;
                    collection = RefreshTrimmedCollection(collection);

                    // Update Card List
                    updateCardQuantities(craftData.id, craftData.shiny);
                    window.applyFilters();
                    window.showPage(window.currentPage);
                }
                resolve(data);
            } else {
                reject(data);
            }
        })
    });
}

function updateCardQuantities(cardId, shiny, addAmount = 1) {
    var allCollections = [window.collection];
    for (var deck in deckCollections) { // wInDoW.dEcKcOlLeCtIoNs Is NoT iTeRaBlE
        allCollections.push(deckCollections[deck]);
    }
    console.log(allCollections);
    allCollections.forEach((coll) => {
        for (var i=0; i < coll.length; i++) {
            var card = coll[i];
            if (card.id === cardId && card.shiny === shiny) {
                console.log("Found card: ", card);
                card.quantity += addAmount;
                break;
            }
        }
    })
}


