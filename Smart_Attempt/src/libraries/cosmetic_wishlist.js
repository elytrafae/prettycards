import { PrettyCards_plugin } from "./underscript_checker"
import { utility } from "./utility";


function SetUpCosmeticsShopPage() {
    var imgs = $(".mainContent img:not(nav *):not(footer *)");
    console.log("IMGS", imgs);
    imgs.each(function(i, e) {
        //var rect = e.getBoundingClientRect();
        //console.log(rect);
        //var left = rect.left + rect.width - 24;
        //var top = rect.top + 4;
        //var html = `<div class="glyphicon glyphicon-star-empty PrettyCards_CosmeticsStar" style="left: ${left}px; top: ${top}px"></div>`;
        //$("body").append(html);
        $(e).parent().append(`<div class="glyphicon glyphicon-star-empty PrettyCards_CosmeticsStar"></div>`);
    })
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    if (window.underscript.onPage("CosmeticsShop")) {
        SetUpCosmeticsShopPage();
    }
})
