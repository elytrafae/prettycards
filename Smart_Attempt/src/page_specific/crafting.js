import { artifactDisplay } from "../libraries/artifact_display";
import { pagegetters } from "../libraries/page_getters";
import { PrettyCards_plugin, settings, addSetting } from "../libraries/underscript_checker";
import { utility } from "../libraries/utility";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/MassCrafting.css";
loadCSS(css);

const minDeckCodeLength = 50; // Original result was 132, but I decided to not have that many bugs today . . .

var prevDial;
var whatToBuy = [];
var missingArtifacts = [];
var missingDTCount = 0;
var lastArtifactIds = [];

addSetting({
	'key': 'sktimacraft',
	'name': 'Enable Mass Crafting input', // Name in settings page
	'note': "Also known as \"Sktimacraft\".",
	'type': 'boolean',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

// Test Deck Code: eyJzb3VsIjoiUEFUSUVOQ0UiLCJjYXJkSWRzIjpbNzMsNzQsMTgyLDI2MCw3MzcsNTUwLDcyLDE0NCw3NSw1NCwxNDcsMTg1LDUwMyw1MDMsNjk4LDI3OSw1Miw1ODQsNDMsMjAxLDIyNywyNjUsNTQ4LDUwNSw2M10sImFydGlmYWN0SWRzIjpbOSwxN119
// eyJzb3VsIjoiUEFUSUVOQ0UiLCJjYXJkSWRzIjpbNzMsMTgyLDI2MCwzMDksMjg1LDMwLDc1LDcxMCw2NTYsMjQ2LDE4NSwxODUsNjk4LDU5Miw1MiwyMDIsNTE3LDQ3Miw1MDUsNTUsOCwyNTQsNDQ0LDU4MSw2M10sImFydGlmYWN0SWRzIjpbMjAsMTRdfQ==

function convertCollection() {
    var convColl = {};
    window.collection.forEach((card) => {
        if (!convColl[card.id]) {
            convColl[card.id] = {normal: 0, shiny: 0};
        }
        convColl[card.id][(card.shiny ? "shiny" : "normal")] = card.quantity;
    })
    return convColl;
}

PrettyCards_plugin.events.on("craftcard", function(data) {
    //console.log("craftcard event procced", data);
    if (!prevDial || !prevDial.opened) {
        return;
    }
    $(`#PrettyCards_MassCraft_CardContainer #${data.id}${data.shiny ? ".shiny" : ""}.PrettyCards_MassCraft_NotHave:first-of-type`).removeClass("PrettyCards_MassCraft_NotHave");
    for (var i=0; i < whatToBuy.length; i++) {
        var buy = whatToBuy[i];
        if (buy.id == data.id && buy.shiny == data.shiny) {
            whatToBuy.splice(i, 1);
            refreshDustCost();
            break;
        }
    }
})

PrettyCards_plugin.events.on("PrettyCards:artBuySuccess", function(data) {
    if (!prevDial || !prevDial.opened) {
        return;
    }
    generateArtifactsSection($("#PrettyCards_MassCraft_Artifacts"), lastArtifactIds);
    refreshDustCost();
})

function buyAll() {
    whatToBuy.forEach( (e) => {
        window.craft(e.id, e.shiny);
    });
    missingArtifacts.forEach( (e) => {
        artifactDisplay.BuyArtifact(e.id);
    })
}

/* MODES:
    0 - Normal Only
    1 - Shiny Only
    2 - Mixed (Normal)
    3 - Mixed (Shiny)
*/

function generateCardsSection(cardIds, mode = 0) {
    var convColl = convertCollection();
    var parent = $(`<div id="PrettyCards_MassCraft_CardContainer"></div>`);
    whatToBuy = [];
    missingDTCount = 0;

    function appendCard(id, shiny, doHave) {
        var card = { ...window.getCard(id) };
        card.shiny = shiny;
        var $card = window.appendCard(card, parent);
        if (doHave) {
            convColl[id][(shiny ? "shiny" : "normal")]--;
        } else {
            $card.addClass("PrettyCards_MassCraft_NotHave");
            if (card.rarity !== "DETERMINATION") {
                whatToBuy.push({id : id, shiny : shiny, cost: window.underscript.utils.rarity.cost(card.rarity, shiny)});
                $card.click(function() {window.craft(id, shiny)});
            } else {
                missingDTCount++;
                $card.addClass("transparent");
            }
        }
    }

    function appendNormal(id, doHave = true) {
        appendCard(id, false, doHave);
    }
    function appendShiny(id, doHave = true) {
        appendCard(id, true, doHave);
    }

    cardIds.forEach((id) => {
        var counts = convColl[id] || {normal: 0, shiny: 0};
        if ((mode == 0 || mode == 2) && counts.normal > 0) {
            appendNormal(id);
        } else if ((mode == 1 || mode == 3) && counts.shiny > 0) {
            appendShiny(id);
        } else if (mode == 2 && counts.shiny > 0) {
            appendShiny(id);
        } else if (mode == 3 && counts.normal > 0) {
            appendNormal(id);
        } else {
            if (mode == 0 || mode == 2) {
                appendNormal(id, false);
            } else {
                appendShiny(id, false);
            }
        }
    })
    return parent;
}

function getRarityClass(rarity) {
    var c = 'normal';
    if (rarity !== "COMMON") {
        c = rarity.toLowerCase();
    }
    return c + "Artifact";
}

// eyJzb3VsIjoiREVURVJNSU5BVElPTiIsImNhcmRJZHMiOls2Niw2Niw2MDAsNjAwLDI3MywyNTYsMjU2LDMwOCwzMDgsNTA4LDEyOSwxMjksMTI5LDYwMyw1OTksNTk5LDU5OSwyMCw0NjUsNDY1LDQ2NSwxNzksMTc5LDI2Myw3OTFdLCJhcnRpZmFjdElkcyI6WzExLDU0XX0=

function generateArtifactsSection(artifacts, artifactIds) {
    if (!artifacts || artifactIds.length <= 0) {
        return;
    }
    missingArtifacts = [];
    artifacts.empty();
    artifactIds.forEach((artId) => {
        var artifact = artifactDisplay.GetArtifactById(artId);
        var ownedClass = artifact.owned ? "" : "PrettyCards_MassCraft_MissingArtifact";
        var rarityClass = getRarityClass(artifact.rarity);
        //console.log(artifact);
        var artSlot = document.createElement("DIV");
        artSlot.className = `PrettyCards_MassCraft_ArtifactSlot pointer ${ownedClass} ${artifact.rarity}`;
        artSlot.appendChild(utility.getArtifactImage(artifact.image));
        artSlot.appendChild(document.createTextNode(" " + $.i18n("artifact-name-" + artId)));
        artifacts.append(artSlot);
        if (!artifact.owned) {
            missingArtifacts.push(artifact);
        }
    })
}

function refreshDustCost() {
    $("#PrettyCards_MassCraft_DustCount").html(pagegetters.dust);
    var totalCost = 0;
    whatToBuy.forEach( (e) => {
        totalCost += e.cost;
    })
    var totalGold = 0;
    missingArtifacts.forEach( (a) => {
        totalGold += a.cost;
    })
    var costText = totalCost > 0 ? `${totalCost} <img src="images/icons/dust.png" class="height-32">` : "";
    var goldText = totalCost > 0 ? `<span class="yellow">${totalGold}</span> <img src="images/icons/gold.png" class="height-32">` : "";
    var combinedText = "";
    if (totalCost > 0) {
        combinedText += costText;
    }
    if (totalGold > 0) {
        if (totalCost > 0) {
            combinedText += " ";
        }
        combinedText += goldText;
    }
    var totalText = window.$.i18n("pc-masscraft-buyall", combinedText);
    $("#PrettyCards_MassCraft_BuyAllBtn").removeClass("PrettyCards_Hidden");
    $("#PrettyCards_MassCraft_BuyAllBtn").addClass("btn-success");
    $("#PrettyCards_MassCraft_BuyAllBtn").removeClass("btn-danger");
    $("#PrettyCards_MassCraft_BuyAllBtn").attr("disabled", false);
    if (totalCost == 0 && totalGold == 0) {
        totalText = `<span class='green'>${window.$.i18n("pc-masscraft-allgood")}</span>`;
        $("#PrettyCards_MassCraft_BuyAllBtn").addClass("PrettyCards_Hidden");
        if (missingDTCount > 0) {
            totalText = `<span class='yellow'>${window.$.i18n("pc-masscraft-allgood-nodt", missingDTCount)}</yellow>`;
        }
    }
    if (totalCost > pagegetters.dust || totalGold > pagegetters.gold) {
        $("#PrettyCards_MassCraft_BuyAllBtn").addClass("btn-danger");
        $("#PrettyCards_MassCraft_BuyAllBtn").removeClass("btn-success");
        $("#PrettyCards_MassCraft_BuyAllBtn").attr("disabled", true);
    }
    $("#PrettyCards_MassCraft_Cost").html(totalText);
}

function generateContent(jsonDeck) {
    var soulName = jsonDeck.soul;

    var cont = $(`<div id="PrettyCards_MassCraft_Preview"></div>`);
    var row1 = $(`<div id="PrettyCards_MassCraft_SoulDeckRow"></div>`);

    var soul = $(`<div class="${soulName} pointer" onclick="soulInfo('${soulName}')"><img src="https://github.com/elytrafae/prettycards/raw/master/img/Souls/${soulName}.png"> ${$.i18n("soul-" + soulName.toLowerCase())}</div>`);

    lastArtifactIds = jsonDeck.artifactIds;
    var artifacts = $(`<div id="PrettyCards_MassCraft_Artifacts"></div>`);
    generateArtifactsSection(artifacts, lastArtifactIds);

    row1.append(soul);
    row1.append(artifacts);

    var row2 = $(`
        <div id="PrettyCards_MassCraft_ModeSelectRow">
            <div class="PrettyCards_MassCraft_ModeSelectBtn">${window.$.i18n("pc-masscraft-menu-nonly")}</div>
            <div class="PrettyCards_MassCraft_ModeSelectBtn">${window.$.i18n("pc-masscraft-menu-sonly")}</div>
            <div class="PrettyCards_MassCraft_ModeSelectBtn">${window.$.i18n("pc-masscraft-menu-nmixed")}</div>
            <div class="PrettyCards_MassCraft_ModeSelectBtn">${window.$.i18n("pc-masscraft-menu-smixed")}</div>
        </div>
    `);

    var cardSlot = $(`<div id="PrettyCards_MassCraft_CardSlot"></div>`);

    function refreshCards(mode = 0, force = false) {
        //console.log("SWITCHING MODE", mode);
        var currBtn = $(`.PrettyCards_MassCraft_ModeSelectBtn:nth-child(${mode+1})`);
        if (currBtn.hasClass("PrettyCards_MassCraft_ModeSelected") && !force) {
            //console.log("MODE ALREADY SELECTED");
            return;
        }
        $(`.PrettyCards_MassCraft_ModeSelectBtn`).removeClass("PrettyCards_MassCraft_ModeSelected");
        currBtn.addClass("PrettyCards_MassCraft_ModeSelected");
        cardSlot.empty().append(generateCardsSection(jsonDeck.cardIds, mode));
        refreshDustCost();
    }

    var buttons = row2.find(".PrettyCards_MassCraft_ModeSelectBtn");
    for (var i=0; i < buttons.length; i++) {
        const index = i;
        const func = function() {refreshCards(index);}
        buttons[i].onclick = func;
        console.log(buttons[i], index, func);
    }

    var row4 = $(`
        <div id="PrettyCards_MassCraft_BuyRow">
            <div>
                <img src="images/icons/dust.png" class="height-32">
                <span id="PrettyCards_MassCraft_DustCount">[A LOT!]</span>
            </div>
            <div>
                <span id="PrettyCards_MassCraft_Cost"></span> <button class="btn btn-success" id="PrettyCards_MassCraft_BuyAllBtn">${window.$.i18n("pc-masscraft-buyallbtn")}</button>
            </div>
        </div>
    `);

    refreshCards(0, true);
    $(buttons[0]).addClass("PrettyCards_MassCraft_ModeSelected"); // This is done because the buttons are not yet part of the page itself.

    row4.find("#PrettyCards_MassCraft_BuyAllBtn").click(buyAll);

    cont.append(row1);
    cont.append(row2);
    cont.append(cardSlot);
    cont.append(row4);

    return cont;
}

function displayDeck(e) {
    var string = e.value;
    if (string.length <= minDeckCodeLength) {
        return;
    }
    if (prevDial && prevDial.opened) {
        return;
    }
    var jsonDeck;
    try {
        jsonDeck = JSON.parse(atob(string));
    } catch(e) {
        console.warn("DECK CODE ERROR", e);
        return;
    }
    //console.log(jsonDeck);
    if ((typeof(jsonDeck.soul) != "string") || (typeof(jsonDeck.cardIds) != "object" || jsonDeck.cardIds.length != 25) || (typeof(jsonDeck.artifactIds) != "object" || jsonDeck.artifactIds.length > 2) ) {
        return;
    }
    e.value = "";
    prevDial = window.BootstrapDialog.show({
        title: window.$.i18n("pc-masscraft-title"),
        message: generateContent(jsonDeck),
        size: window.BootstrapDialog.SIZE_WIDE,
        onshown: function(dial) {
            refreshDustCost()
        },
        buttons: [
            {
                label: window.$.i18n("dialog-ok"),
                cssClass: 'btn-primary',
                action: function(dialog) {
                    dialog.close();
                }
            }
        ]
    });
    //console.log(jsonDeck);
}


function InitCrafting() {
    if (settings.sktimacraft.value()) {
        PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
            var myTD = $(`<td><input type="text" class="form-control" placeholder=". . ."></input></td>`);
            var td = $("#dust").closest("td");
            td.css("width", "unset").after(myTD);
            td.closest("tr").css({
                display: "flex",
                ["flex-wrap"]: "nowrap", 
                ["justify-content"]: "space-between",
                width: "100%"
            });
            td.closest("table").css("width", "100%");
            myTD.find("input").keyup(function() {
                displayDeck(this);
            })

            PrettyCards_plugin.events.on("PrettyCards:TranslationExtReady", function() {
                myTD.find("input").attr("placeholder", window.$.i18n("pc-masscraft-inserthere"));
            })
        })
    }
}

export {InitCrafting};