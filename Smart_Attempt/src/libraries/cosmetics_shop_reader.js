
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

// This all will assume that Onu will not change anything about this God forsaken page.
// Seriously, if I was in his place, this (and many other things) would have been APIs since the start!

function GetPage() {
    return new Promise((resolve, reject) => {
        if (window.underscript.onPage("CosmeticsShop")) {
            resolve(document.getElementsByClassName("mainContent")[0]);
            return;
        }
        $.get("/CosmeticsShop", {}, function(data) {
            var $page = $(data);
            // I am officially dead inside.
            // Shout out to my dad for figuring out that doing it with fancy JQuery stuff is not gonna cut it, no matter what we try.
            for (var i=0; i < $page.length; i++) {
                var element = $page[i];
                if (element && element.className && element.classList.contains('mainContent')) {
                    resolve(element);
                    return;
                }
            }
            reject("ELEMENT_NOT_FOUND_ERROR");
        });
    })
}

function GetTypeFromElement(ele) {
    if (ele.classList.contains("avatar")) {
        return "AVATAR";
    }
    if (ele.classList.contains("emote-bordered")) {
        return "EMOTE";
    }
    if (ele.classList.contains("profileSkin")) {
        return "PROFILE_SKIN";
    }
    return "UNKNOWN";
}

function GetCosmeticNameFromElement(ele) {
    var name = ele.getAttribute("data-i18n-tips");
    var index = name.indexOf("|");
    if (index < 0) {
        return name;
    }
    var name = name.substring(index+1, name.length-2);
    return name;
}

const RARITIES = ["BASE", "COMMON", "RARE", "EPIC", "LEGENDARY", "DETERMINATION", "MYTHIC", "TOKEN"];
function GetCosmeticRarityFromElement(ele) {
    for (var i=0; i < RARITIES.length; i++) {
        var rarity = RARITIES[i];
        if (ele.classList.contains(rarity)) {
            return rarity;
        }
    }
    //return undefined; // If there is none, then don't define the rarity tag.
}

GetPage().then((data) => {
    var copy = $(data.outerHTML)[0]; // I'll do some terraforming, so I need a deep copy first.
    console.log(copy);
    copy.querySelector(".navbar").remove();
    copy.querySelector("footer").remove();
    var shopItems = [];
    var elements = copy.querySelectorAll("img,.ucp");
    for (var i=0; i < elements.length; i++) {
        var ele = elements[i];
        var mostRecent = shopItems[shopItems.length-1];
        if (ele.tagName === "IMG") {

            if (mostRecent && !mostRecent.cost) {
                mostRecent.owned = true;
            } 

            var obj = {
                name: GetCosmeticNameFromElement(ele),
                type: GetTypeFromElement(ele),
                owned: false
            };
            var rarity = GetCosmeticRarityFromElement(ele);
            if (rarity) {
                obj.rarity = rarity;
            }
            shopItems.push(obj);
        } else {
            
            var number = Number(ele.innerHTML);
            if (!mostRecent.cost) {
                mostRecent.cost = number;
            } else if (!mostRecent.discountPercent) {
                mostRecent.discountPercent = number;
            } else {
                console.warn(`A THIRD (or more) NUMBER ASSIGNED TO THE COSMETIC ${mostRecent.name}. PLEASE INVESTIGATE!`);
            }
        }
    }

    console.log(shopItems);
})

