
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    window.$(document).ajaxComplete((event, xhr, s) => {
        //console.log(event, xhr, s);
        if (s.url === "CardSkinsConfig?action=shop") {
            PrettyCards_plugin.events.emit.singleton("PrettyCards:onCardSkinShopConfig");
            return;
        }
        if (s.url === "CardSkinsConfig") {
            PrettyCards_plugin.events.emit("PrettyCards:onCardSkinBought"); // Sadly, I dunno how to check which one :(
        }
        // Do stuff here
    });
});
