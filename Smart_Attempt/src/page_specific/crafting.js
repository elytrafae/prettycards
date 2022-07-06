import { artifactDisplay } from "../libraries/artifact_display";
import { PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "../libraries/utility";

const minDeckCodeLength = 120; // Original result was 132, but I decided to not have that many bugs today . . .

var prevDial;

// Test Deck Code: eyJzb3VsIjoiUEFUSUVOQ0UiLCJjYXJkSWRzIjpbNzMsNzQsMTgyLDI2MCw3MzcsNTUwLDcyLDE0NCw3NSw1NCwxNDcsMTg1LDUwMyw1MDMsNjk4LDI3OSw1Miw1ODQsNDMsMjAxLDIyNywyNjUsNTQ4LDUwNSw2M10sImFydGlmYWN0SWRzIjpbOSwxN119

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

/* MODES:
    0 - Normal Only
    1 - Shiny Only
    2 - Mixed (Normal)
    3 - Mixed (Shiny)
*/

function generateCardsSection(cardIds, mode = 0) {
    var convColl = convertCollection();
    var parent = $(`<div id="PrettyCards_MassCraft_CardContainer"></div>`);

    function appendNormal(id, doHave = true) {
        var card = window.getCard(id);
        var $card = window.appendCard(card, parent);
        if (doHave) {
            convColl[id].normal--;
        } else {
            $card.addClass("PrettyCards_MassCraft_NotHave");
        }
    }
    function appendShiny(id, doHave = true) {
        var card = { ...window.getCard(id) };
        card.shiny = true;
        var $card = window.appendCard(card, parent);
        if (doHave) {
            convColl[id].shiny--;
        } else {
            $card.addClass("PrettyCards_MassCraft_NotHave");
        }
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

function generateContent(jsonDeck) {
    var soulName = jsonDeck.soul;

    var cont = $(`<div id="PrettyCards_MassCraft_Preview"></div>`);
    var row1 = $(`<div id="PrettyCards_MassCraft_SoulDeckRow"></div>`);

    var soul = $(`<div class="${soulName}" onclick="soulInfo('${soulName}')"><img src="https://github.com/CMD-God/prettycards/raw/master/img/Souls/${soulName}.png"> ${$.i18n("soul-" + soulName.toLowerCase())}</div>`);

    var artifacts = $(`<div id="PrettyCards_MassCraft_Artifacts"></div>`);
    jsonDeck.artifactIds.forEach((artId) => {
        var artifact = artifactDisplay.GetArtifactById(artId);
        var ownedClass = artifact.owned ? "" : "PrettyCards_MassCraft_MissingArtifact";
        var rarityClass = artifact.rarity == "COMMON" ? "normalArtifact" : "legendaryArtifact";
        console.log(artifact);
        artifacts.append(`<div class="PrettyCards_MassCraft_ArtifactSlot ${ownedClass} ${artifact.rarity}" onclick="artifactInfo(${artId})"><img class="${rarityClass} ${ownedClass}" src="${utility.getArtifactImageLink(artifact.image)}"> ${$.i18n("artifact-name-" + artId)}</div>`);
    })

    row1.append(soul);
    row1.append(artifacts);

    var row2 = $(`
        <div id="PrettyCards_MassCraft_ModeSelectRow">
            <div class="PrettyCards_MassCraft_ModeSelectBtn">Normal Only</div>
            <div class="PrettyCards_MassCraft_ModeSelectBtn"><span class="rainbowText">Shiny</span> Only</div>
            <div class="PrettyCards_MassCraft_ModeSelectBtn">Mixed (Normal)</div>
            <div class="PrettyCards_MassCraft_ModeSelectBtn">Mixed <span class="rainbowText">(Shiny)</span></div>
        </div>
    `);

    var cardSlot = $(`<div id="PrettyCards_MassCraft_CardSlot"></div>`)
    cardSlot.append(generateCardsSection(jsonDeck.cardIds, 0))

    cont.append(row1);
    cont.append(row2);
    cont.append(cardSlot);

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
        title: "Mass Crafting",
        message: generateContent(jsonDeck),
        //onshow: this.OnShow
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
    console.log(jsonDeck);
}


function InitCrafting() {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        utility.loadCSSFromGH("MassCrafting");
        var myTD = $(`<td><input type="text" class="form-control" placeholder="Insert Deck Code Here!"></input></td>`);
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
    })
}

export {InitCrafting};