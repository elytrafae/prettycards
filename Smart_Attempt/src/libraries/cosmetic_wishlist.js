import { PrettyCards_plugin } from "./underscript_checker"
import { utility } from "./utility";


function SetUpCosmeticsShopPage() {
    var imgs = $(".mainContent img:not(nav *):not(footer *)");
    console.log("IMGS", imgs);
    imgs.each(function(i, e) {
        $(e).parent().append(`<span class="glyphicon glyphicon-star-empty PrettyCards_CosmeticsStar"></span>`);
    })
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("Cosmetics");
    if (window.underscript.onPage("CosmeticsShop")) {
        SetUpCosmeticsShopPage();
    }
})
