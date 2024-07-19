import { prettycards, PrettyCards_plugin } from "../underscript_checker";
import { utility } from "../utility";

var ids_with_owned_card_skins = new utility.SortedUniqueEntryHolder();

PrettyCards_plugin.events.on("PrettyCards:onCardSkinShopConfig", function() {
    window.cardSkins.forEach((skin) => {
        if (skin.owned) {
            ids_with_owned_card_skins.insert(skin.cardId);
        }
    })
    //var debug_names = ids_with_owned_card_skins.arr.map((val) => window.getCard(val).name);
    //console.log(ids_with_owned_card_skins.arr, debug_names);
    PrettyCards_plugin.events.emit.singleton("PrettyCards:cardSkinShop:idsWithOwnedCardSkins");
})

PrettyCards_plugin.events.on("appendCardCardSkinShop()", function(data) {
    var skin = data.cardSkin;
    var element = data.element;
    PrettyCards_plugin.events.on("PrettyCards:cardSkinShop:idsWithOwnedCardSkins", function() {
        if (ids_with_owned_card_skins.includes(skin.cardId)) {
            utility.addCustomSimpleTextIconToCard(
                element, 
                utility.asset("img/CardPowers/already_have.png"), 
                `You already own a card skin for <span style="white-space: nowrap;">${window.$.i18n(`card-name-${skin.cardId}`, 1)}</span>!`
            );
        }
    });
})

// Only works on the card skins page.
prettycards.ids_with_owned_card_skins = ids_with_owned_card_skins;