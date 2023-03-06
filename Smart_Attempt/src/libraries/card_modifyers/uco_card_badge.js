import { PrettyCards_plugin } from "../underscript_checker";
import { utility } from "../utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";


$.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/ucoCardIds.json", {}, function(data) {
    var set = new Set(data);
    PrettyCards_plugin.events.emit.singleton("PrettyCards:ucoCardListFetched", set);
}).fail(function(err) {
    console.error("ERROR FETCHING UCO CARD LIST! ", err);
    PrettyCards_plugin.events.emit.singleton("PrettyCards:ucoCardListFetched", new Set());
})

PrettyCards_plugin.events.on("appendCard()", function(data) {
    var card = data.card;
    var ele = data.element;
    PrettyCards_plugin.events.on("PrettyCards:ucoCardListFetched", function(idList) {
        console.log(data, idList);
        if (idList.has(card.fixedId || card.id)) {
            PrettyCards_plugin.events.on("PrettyCards:TranslationExtReady", function() {
                utility.addCustomSimpleTextIconToCard2(ele, 
                    "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardPowers/uco.png",
                    window.$.i18n("pc-cardbadge-uco-short"), 
                    window.$.i18n("pc-cardbadge-uco-desc"),
                    window.$.i18n("pc-cardbadge-uco-title")
                );
            });
        }
    })
})