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
            utility.addCustomSimpleTextIconToCard2(ele, 
                "https://media.discordapp.net/attachments/588807965151330322/1082027812904517653/New_Piskel-1.png_27.png?width=256&height=256",
                "UC:O Card", 
                "This is an Undercards Original card, which means that this is in no way canon to Undertale or Deltarune. Think of this as Undercards' own, original AU.",
                "Undercards Original"
            );
        }
    })
})