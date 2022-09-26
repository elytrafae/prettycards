import { PrettyCards_plugin } from "../underscript_checker";
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
            console.log("SKIN FOR A CARD YOU ALREADY HAVE A SKIN FOR: ", skin);
            var icon = document.createElement("IMG");
            icon.src = "/images/friendship.png";
            element.find(".PrettyCards_CardBottomLeftInfo").append(icon);
    
            window.tippy(icon, {
                content: `You already own a card skin for <span style="white-space: nowrap;">${window.$.i18n(`card-name-${skin.cardId}`, 1)}</span>!`,
                allowHTML: true,
                arrow: true,
                inertia: true,
                placement: "top",
                appendTo: window.document.body,
                boundary: 'window',
                getReferenceClientRect: window.document.body.getBoundingClientRect
            });
        }
    });
})