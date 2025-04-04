
import {PrettyCards_plugin, settings, prettycards} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

// This all will assume that Onu will not change anything about this God forsaken page.
// Seriously, if I was in his place, this (and many other things) would have been APIs since the start!

const COSMETIC_TYPES = Object.freeze({
    NULL : Symbol("NULL"),
    AVATAR : Symbol("AVATAR"),
    EMOTE : Symbol("EMOTE"),
    PROFILE_SKIN : Symbol("PROFILE_SKIN")
})

const COSMETIC_TYPE_TO_BUY_NAME = Object.freeze({
    [COSMETIC_TYPES.AVATAR] : "idAvatar",
    [COSMETIC_TYPES.EMOTE] : "idEmote",
    [COSMETIC_TYPES.PROFILE_SKIN] : "idProfileSkin",
    [COSMETIC_TYPES.NULL] : ""
})

// Can also be used to buy cosmetics and get the new page after.
function GetPage(cosmeticType = COSMETIC_TYPES.NULL, id = -1) {
    return new Promise((resolve, reject) => {
        if (cosmeticType === COSMETIC_TYPES.NULL && window.underscript.onPage("CosmeticsShop")) {
            resolve(document.getElementsByClassName("mainContent")[0]);
            return;
        }
        var data = {};
        if (cosmeticType !== COSMETIC_TYPES.NULL && id >= 0) {
            data[COSMETIC_TYPE_TO_BUY_NAME[cosmeticType]] = id;
        }
        $.post("/CosmeticsShop", data, function(data) {
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
        return COSMETIC_TYPES.AVATAR;
    }
    if (ele.classList.contains("emote-bordered")) {
        return COSMETIC_TYPES.EMOTE;
    }
    if (ele.classList.contains("profileSkin")) {
        return COSMETIC_TYPES.PROFILE_SKIN;
    }
    return COSMETIC_TYPES.NULL;
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

// Can also be used to buy a cosmetic item, and then get the new data.
function GetCosmeticShopData(cosmeticType = COSMETIC_TYPES.NULL, id = -1) {
    return new Promise((resolve, reject) => {
        GetPage(cosmeticType, id).then((data) => {
            prettycards.cosmeticShop.isLastReadASuccessfulBuy = false;
            var navbar = data.querySelector(".navbar");
            var footer = data.querySelector("footer");
            var shopItems = [];
            var currentCategory = "";
            var elements = data.querySelectorAll("img,.ucp,:scope > p,form[action=CosmeticsShop]");
            for (var i=0; i < elements.length; i++) {
                /**@type {HTMLElement} */
                var ele = elements[i];
                if (navbar.contains(ele) || footer.contains(ele)) {
                    continue; // If it's part of the navbar or footer, just ignore.
                }
                var mostRecent = shopItems[shopItems.length-1];
                if (ele.tagName === "P") {
                    var ele2 = ele.children[0];
                    if (ele2) {
                        var str = ele2.getAttribute("data-i18n");
                        if (!str) {
                            var str2 = ele2.getAttribute("data-i18n-custom");
                            console.log(ele, ele2, str2)
                            if (str2.endsWith("unlocked")) {
                                // If a "successful purchase" message was detected on this page . . .
                                //PrettyCards_plugin.events.emit("PrettyCards:CosmeticBought", {name: ele3.getAttribute("data-i18n-args")});
                                prettycards.cosmeticShop.isLastReadASuccessfulBuy = true;
                            }
                            // console.warn("Error while reading cosmetic page! str is null", ele);
                            // This usually happens immediately after purchase. Do nothing.
                        } else {
                            currentCategory = str.substring(6);
                        }
                    }
                } else if (ele.tagName === "IMG") {
        
                    if (mostRecent && !mostRecent.cost) {
                        mostRecent.owned = true;
                    } 
        
                    var obj = {
                        imageSrc: ele.getAttribute("src"),
                        name: GetCosmeticNameFromElement(ele),
                        type: GetTypeFromElement(ele),
                        owned: false,
                        category: currentCategory
                    };
                    var rarity = GetCosmeticRarityFromElement(ele);
                    if (rarity) {
                        obj.rarity = rarity;
                    }
                    shopItems.push(obj);
                } else if (ele.tagName === "FORM") {
                    //console.log("FORM!", ele, ele.children);
                    for (var j=0; j < ele.children.length; j++) {
                        var child = ele.children[j];
                        //console.log(child.getAttribute("name").toString());
                        if (child.tagName === "INPUT" && child.hasAttribute("name") && child.getAttribute("name").toString().includes("id")) {
                            mostRecent.id = parseInt(child.getAttribute("value"));
                            //console.log("ID set to", mostRecent.id, "for", mostRecent);
                            break;
                        }
                    }

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
            
            resolve(shopItems);
            //PrettyCards_plugin.events.emit.singleton("PrettyCards:cosmeticShopReaderDone", shopItems);
        })
    })
}

prettycards.cosmeticShop = {};

prettycards.cosmeticShop.isLastReadASuccessfulBuy = false;
prettycards.cosmeticShop.GetPage = GetPage;
prettycards.cosmeticShop.GetData = GetCosmeticShopData;
prettycards.cosmeticShop.COSMETIC_TYPES = COSMETIC_TYPES;
prettycards.cosmeticShop.COSMETIC_TYPE_TO_BUY_NAME = COSMETIC_TYPE_TO_BUY_NAME;

export {GetCosmeticShopData, COSMETIC_TYPES, COSMETIC_TYPE_TO_BUY_NAME};
