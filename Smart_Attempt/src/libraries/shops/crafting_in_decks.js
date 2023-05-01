
import { PrettyCards_plugin, addSetting, prettycards } from "../underscript_checker";
import { utility } from "../utility";
import "../card_modifyers/basic_universal_card_additions";

// Note: The reason I need to keep a copy of the collection is so that cards in a 
// specific deck won't skrew stuff up + faster than searching in the global collection variable

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
    console.log("TRIMMED COLLECTION", trimmedCollection);
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
function SearchInCraftableCollection(id, shiny = false) {
    for (var i=0; i < collection.length; i++) {
        var card = collection[i];
        if (card.id === id && card.shiny === shiny) {
            return card;
        }
    }
    return null;
}

prettycards.test_SearchInCraftableCollection = SearchInCraftableCollection;

function SetUpCardEvent() {
    PrettyCards_plugin.events.on("func:appendCardDeck", function(card, element) {
        var craftData = SearchInCraftableCollection(card.id, card.shiny);
        console.log(card, element, craftData);
        //if (carftData && CanCraftMore(carftData)) {
        if ((!craftData) && card.quantity < 3) {
            console.log("M A U S   D E T E C T E D", card, craftData);
        }
        if (craftData) {
            var dustIcon = `<img style="height:1.6em;" src="/images/icons/dust.png">`;
            var shinyText = craftData.shiny ? `<span class="rainbowText">S</span> ` : '';
            var name = shinyText + $.i18n('card-name-' + card.id, 1);
            var dust$ = window.$(`<p style="font-size: 1.2em;">${dustIcon} ${dust}</p>`);

            var maxCraftCount = MaxCraftCount(craftData);
            if (maxCraftCount <= 0) {
                return;
            }
            console.log("I'm in!");

            var oneButton = window.$(`<button class="btn btn-success">Craft One (-${underscript.utils.rarity.cost(craftData.rarity, craftData.shiny)} ${dustIcon})</button>`);
            var moreButton = window.$(`<button class="btn btn-success" style="margin-left: 0.6em">Craft x${maxCraftCount} (-${underscript.utils.rarity.cost(craftData.rarity, craftData.shiny)*maxCraftCount} ${dustIcon})</button>`);
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
            if (maxCraftCount > 1) {
                craftingUI.append(moreButton);
            }
            
            utility.addCustomSimpleTextIconToCard2(element, "/images/icons/dust.png", "Craft!", craftingUI, window.$.i18n('crafting-title', name));
            console.log("Peekaboo!");
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
    var errors = [];
    var countLeft = count;
    var successes = 0;
    for (var i=0; i < count; i++) {
        SilentCraft(craftData.id, craftData.shiny).then((data) => {
            successes++;
            countLeft--;
            dust = data.dust;
            craftData.quantity++;
            CraftMoreEnd(successes, errors, countLeft, craftData);
        }).catch((data) => {
            if (data instanceof Error) { console.error(data); return; }
            countLeft--;
            errors.push(getErrorMessage(data));
            CraftMoreEnd(successes, errors, countLeft, craftData);
        })
    }
}

function CraftMoreEnd(successes, errors = [], countLeft = 0, craftData) {
    if (countLeft > 0) {
        return;
    }

    collection = RefreshTrimmedCollection(collection);
    updateCardQuantities(craftData.id, craftData.shiny, successes);
    window.applyFilters();
    window.showPage(window.currentPage);

    window.BootstrapDialog.closeAll();
    var total = successes + errors.length;
    var type = successes > 0 ? window.BootstrapDialog.TYPE_SUCCESS : window.BootstrapDialog.TYPE_DANGER;
    var shinyText = craftData.shiny ? `<span class="rainbowText">S</span> ` : '';
    var name = shinyText + $.i18n('card-name-' + craftData.id, total);
    var message = `<p style="font-size:1.2em" class="green">${successes}/${total} ${name} Crafted successfully!</p>`;
    if (errors.length > 0) {
        message += `<h2 class="red">Errors: </h2><ul>${"<li>" + errors.join("</li><li>") + "</li>"}</ul>`;
    }
    window.BootstrapDialog.show({
        type: type,
        title: "Multi Craft Results",
        message: message,
        buttons: [{
            label: $.i18n('dialog-ok'),
            cssClass: 'btn-primary',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
}

function CraftOne(craftData) {
    SilentCraft(craftData.id, craftData.shiny).then((data) => {
        dust = data.dust;

        // Update Optimized Craft List
        craftData.quantity++;
        collection = RefreshTrimmedCollection(collection);

        // Update Card List
        updateCardQuantities(craftData.id, craftData.shiny);
        window.applyFilters();
        window.showPage(window.currentPage);

        // Pop-up windows
        window.BootstrapDialog.closeAll();
        var shinyText = craftData.shiny ? `<span class="rainbowText">S</span> ` : '';
        var name = shinyText + $.i18n('card-name-' + craftData.id, 1);
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
        if (data instanceof Error) { console.error(data); return; }
        window.BootstrapDialog.closeAll();
        window.BootstrapDialog.show({
            type: window.BootstrapDialog.TYPE_DANGER,
            title: window.$.i18n('dialog-error'),
            message: getErrorMessage(data),
            buttons: [{
                label: $.i18n('dialog-ok'),
                cssClass: 'btn-primary',
                action: function(dialog) {
                    dialog.close();
                }
            }]
        });
    })
}

function SilentCraft(id, shiny) {
    // Am I just flexing the fact that I could do this manually, while using far less resources to generate the JSON text? Yes.
    var JSON_data = `{"action": "craft", "idCard": ${id}, "isShiny": ${shiny ? "true" : "false"}}`;
    return new Promise((resolve, reject) => {
        window.$.post(`/CraftConfig`, JSON_data, function(data) {
            if (data.status === "success") {
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
    allCollections.forEach((coll) => {
        for (var i=0; i < coll.length; i++) {
            var card = coll[i];
            if (card.id === cardId && card.shiny === shiny) {
                card.quantity += addAmount;
                break;
            }
        }
    })
}

function getErrorMessage(data) {
    if (data.status === "errorMaintenance") {
        return translateFromServerJson(data.message);
    }
    return "An unexpected error occurred!";
}
