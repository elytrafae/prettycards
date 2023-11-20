import { allCardSkins } from "../libraries/decks/card_skin_selector";
import { FlippableCard } from "../libraries/flippable_card";
import { translationManager } from "../libraries/translation/translation_manager";
import { PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "../libraries/utility";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/SmashOrPass.css";
loadCSS(css);

const rarityInputList = ["baseRarityInput", "commonRarityInput", "rareRarityInput", "epicRarityInput", "legendaryRarityInput", "determinationRarityInput", "tokenRarityInput", "baseGenInput:not(:disabled)"];
var cards = [];
var cardIndex = -1;
var currentFlipCard;
var alreadyTakingScreenshot = false;

function shuffleArray(array) { // From Stack Overflow: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initStuff() {
    //console.log("ALL CARDS: ", window.allCards);
}

function addButtonSettingItem(name, style) {
    var parent = $("#PrettyCards_SOP_ButtonSettingsContainer");
    var item = window.$(`
        <div style="padding: 5px;" class="PrettyCards_SOP_ButtonData">
            <span class="handle glyphicon glyphicon-sort" style="cursor:grab;"></span> 
            <label>
                <span>${window.$.i18n("pc-sop-name")}: </span>
                <input type="text" value="${name}" id="PrettyCards_SOP_ButtonNameInput"></input>
            </label>
            <label>
                <span>${window.$.i18n("pc-sop-style")}: </span>
                <select id="PrettyCards_SOP_ButtonStyleInput">
                    <option value="btn-primary" class="text-primary">${window.$.i18n("pc-sop-stylelist-0")}</option>
                    <option value="btn-info" class="text-info">${window.$.i18n("pc-sop-stylelist-1")}</option>
                    <option value="btn-success" class="text-success">${window.$.i18n("pc-sop-stylelist-2")}</option>
                    <option value="btn-danger" class="text-danger">${window.$.i18n("pc-sop-stylelist-3")}</option>
                    <option value="btn-warning" class="text-warning">${window.$.i18n("pc-sop-stylelist-4")}</option>
                </select>
            </label>
            <button class="btn btn-danger" onclick="this.parentElement.remove()">${window.$.i18n("pc-sop-remove")}</button>
        </div>
    `);
    item.find("#PrettyCards_SOP_ButtonStyleInput").val(style);
    parent.append(item);
    return item;
}

function refreshSortables() {
    $("#PrettyCards_SOP_ButtonSettingsContainer").sortable( {
        appendTo: parent,
        axis: "y",
        cursor: "grabbing",
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        handle: ".handle"
    })
}

function populateSkins(card) {
    var skins = [{
        cardId: card.fixedId,
        name: card.name,
        id: -22,
        image: card.image,
        typeSkin: 0
    }];
    for (var i=0; i < allCardSkins.length; i++) {
        var skin = allCardSkins[i];
        if (skin.cardId == card.id) {
            skins.push(skin);
        }
    }
    console.log(card, skins);
    var skinCont = $("#PrettyCards_SOP_Phase3_Skins");
    skinCont.html("");
    if (skins.length <= 1) {return};
    for (var i=0; i < skins.length; i++) {
        const skin = skins[i];
        var elem = $(`
            <div class="PrettyCards_SOP_SkinDisplay ${i==0 ? "selected" : ""}">
                <img src="${utility.getCardImageLink(skin.image)}">
            </div>
        `);
        elem.click(function() {
            var front = $(currentFlipCard.front);
            front.removeClass("full-skin").removeClass("breaking-skin").removeClass("standard-skin");
            if (skin.typeSkin == 0) {
                front.addClass("standard-skin");
            } else if (skin.typeSkin == 1) {
                front.addClass("full-skin");
            } else {
                front.addClass("breaking-skin");
            }
            front.find(".cardImage").css("backgroundImage", "url("+ utility.getCardImageLink(skin.image) + ")");
            $(".PrettyCards_SOP_SkinDisplay").removeClass("selected");
            $(this).addClass("selected");
        });
        skinCont.append(elem);
    }
}

function spawnNextCard() {
    if (cardIndex >= cards.length) {return;}
    if (cardIndex >= 0) {
        currentFlipCard.glideTo(window.innerWidth/2, window.innerHeight + 500, 500, function() {
            //console.log("Erasing card #", cardIndex, " out of ", cards.length);
            if (cardIndex >= cards.length) {
                startPhase4();
            }
            this.remove();
        })
    }
    cardIndex++;
    if (cardIndex >= cards.length) {return;}
    //console.log("SPAWNING CARD: ", cards[cardIndex]);
    if ( (!$("#PrettyCards_SOP_BlindModeSetting").prop('checked')) && $("#PrettyCards_SOP_ViewSkinsSetting").prop('checked')) {
        populateSkins(cards[cardIndex]);
    }
    currentFlipCard = new FlippableCard(cards[cardIndex], false, false, false);
    var cardSpace = document.getElementById("PrettyCards_SOP_Phase3_CardSpace");
    var spaceBoundingBox = cardSpace.getBoundingClientRect();
    currentFlipCard.appendTo(document.getElementById("PrettyCards_SOP_Phase3_CardContainer")); // This is an element specifically made to contain cards so that the scrollbar won't appear.
    currentFlipCard.moveTo(-300, spaceBoundingBox.top + spaceBoundingBox.height/2);
    currentFlipCard.flipToFace(500);
    currentFlipCard.glideTo(window.innerWidth/2, spaceBoundingBox.top + spaceBoundingBox.height/2, 500, function() {});
    if ($("#PrettyCards_SOP_BlindModeSetting").prop('checked')) {
        currentFlipCard.back.style.backgroundImage = "url(https://github.com/elytrafae/prettycards/raw/master/img/CardBackMystery.png)";
        var front = $(currentFlipCard.front);
        front.removeClass("monster").addClass("spell");
        front.removeClass("full-skin").removeClass("breaking-skin").addClass("standard-skin");
        front.find(".cardATK").remove();
        front.find(".cardHP").remove();
        front.find(".cardName").html("???");
        front.find(".cardTribes").html("");
        front.find(".cardStatus").html("");
        front.find(".cardCost").html("?");
        front.find(".cardName")[0].className = "cardName";
        // utility.getRandomFromArray(mysteryDescriptions)
        front.find(".cardDesc > div").html(translationManager.getRandomFromValueList("pc-sop-mysterydescriptions"));
        front.find(".cardImage").css("background-image", "url(https://github.com/elytrafae/prettycards/raw/master/img/MysteryCard.png)");
        front.find(".cardRarity").css("background-image", "url(https://github.com/elytrafae/prettycards/raw/master/img/MysteryRarity.png)");
        front.find(".PrettyCards_CardThemeSongPlayer").remove();

        var cardNameDiv$ = front.find('.cardName div');
		var cardDescDiv$ = front.find('.cardDesc div');
				
		cardNameDiv$.css('font-size', '');
		cardDescDiv$.css('font-size', '');

		//console.log(getResizedFontSize(cardNameDiv$, 25) + "px");
		var nameSize = window.getResizedFontSize(cardNameDiv$, 25);
		cardNameDiv$.css('font-size', (nameSize + "px"));
				
		var descSize = window.getResizedFontSize(cardDescDiv$, 81);
		cardDescDiv$.css('font-size', (descSize + "px"));
    }
}

function makeVerdict(verdict_id) {
    window.appendCard(cards[cardIndex], $("#PrettyCards_SOP_Cards_" + verdict_id));
    spawnNextCard();
}

function getEligibleCardList() {
    var rarities = $(".rarityInput:checked").map(function(){
        return this.getAttribute('rarity');
    }).get();
    if (rarities.length == 0) {
        rarities = ["COMMON", "RARE", "EPIC", "LEGENDARY", "DETERMINATION"]
    }

    var cardTypes = $(".typeCardInput:checked").map(function(){
        return this.getAttribute('typeCard');
    }).get();
    if (cardTypes.length == 0) {
        cardTypes = $(".typeCardInput").map(function(){
            return this.getAttribute('typeCard');
        }).get();
    }
    cardTypes.forEach((e, i) => {cardTypes[i] = Number(e);})

    var extensions = $(".extensionInput:checked").map(function(){
        return this.getAttribute('extension');
    }).get();
    if (extensions.length == 0) {
        extensions = $(".extensionInput").map(function(){
            return this.getAttribute('extension');
        }).get();
    }

    var cards = [];
    window.allCards.forEach(card => {
        if (rarities.includes(card.rarity) && cardTypes.includes(card.typeCard) && extensions.includes(card.extension)) {
            cards.push(card);
        }
    });
    return cards;
}

function startPhase4() {
    window.$("#PrettyCards_SOP_Phase3").addClass("PrettyCards_Hidden");
    window.$("#PrettyCards_SOP_Phase4").removeClass("PrettyCards_Hidden");
}

function startPhase3() {
    var buttonContainer = $("#PrettyCards_SOP_Buttons");
    var buttonData = $(".PrettyCards_SOP_ButtonData");
    if (buttonData.length == 0) {
        return;
    }
    cards = getEligibleCardList();
    if (cards.length <= 0) {
        return;
    }
    if ($("#PrettyCards_SOP_RandomizeSetting").prop('checked') || $("#PrettyCards_SOP_BlindModeSetting").prop('checked')) {
        shuffleArray(cards);
    }
    //allCardSkins
    var ownerText = window.$.i18n("pc-sop-results-title-nouser");
    if (window.selfUsername) {
        ownerText = window.$.i18n("pc-sop-results-title", window.selfUsername);
    }
    var p4 = "<h1 style='text-align:center;'>" + ownerText + "</h1>";
    buttonContainer.html("");
    buttonData.each((i, element) => {
        var e = $(element);
        var name = e.find("#PrettyCards_SOP_ButtonNameInput").val();
        const categoryId = name.replace(/[^\w]/gi, '_');
        var style = e.find("#PrettyCards_SOP_ButtonStyleInput").val();
        p4 += `<h2>${e.find("#PrettyCards_SOP_ButtonNameInput").val()}</h2><div id="PrettyCards_SOP_Cards_${categoryId}" class="PrettyCards_SOP_CardResults"></div>`;
        var button = $(`<button class="btn ${style}">${name}</button>`); // TODO: Add onclick event to this!
        button.click(function() {
            makeVerdict(categoryId);
        });
        buttonContainer.append(button);
    })
    $("#PrettyCards_SOP_Phase4_ScreenshotArea").html(p4);

    window.$("#PrettyCards_SOP_Phase2").addClass("PrettyCards_Hidden");
    window.$("#PrettyCards_SOP_Phase3").removeClass("PrettyCards_Hidden");

    spawnNextCard();
}

function InitSmashOrPass() {
    ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function() {
        $("title").html("PrettyCards - Smash or Pass");
        localStorage["prettycards.top_advert_closed"] = true; // Makes the advert disappear now that the user visited this page.

        if (window.allCards && window.allCards.length > 0) {
            initStuff();
        } else {
            window.document.addEventListener('allCardsReady', function() {
                initStuff();
            });
        }

        document.getElementsByClassName("mainContent")[0].innerHTML = `
            <div id="PrettyCards_SOP_Phase1">
                <h1>${window.$.i18n("pc-sop-welcome")}</h1>
                <h2>${window.$.i18n("pc-sop-q1")}</h2>
                <p>${window.$.i18n("pc-sop-a1-p1")}</p>
                <p>${window.$.i18n("pc-sop-a1-p2")}</p>
                <p>${window.$.i18n("pc-sop-a1-p3")}</p>
                <h2>${window.$.i18n("pc-sop-q2")}</h2>
                <p>${window.$.i18n("pc-sop-a2-p1")}</p>
                <p>${window.$.i18n("pc-sop-a2-p2")}</p>
                <h2>${window.$.i18n("pc-sop-q3")}</h2>
                <p>${window.$.i18n("pc-sop-a3-p1")}</p>
                <br>
                <button class="btn btn-success" id="PrettyCards_SOP_ToPhase2">${window.$.i18n("pc-sop-onwards")}</button>
                <button class="btn btn-danger" onclick="window.location.href = '/';">${window.$.i18n("pc-sop-retreat")}</button>
            </div>
            <div id="PrettyCards_SOP_Phase2" class="PrettyCards_Hidden">
                <h1>${window.$.i18n("pc-sop-settings")}</h1>
                <h2>${window.$.i18n("pc-sop-filters")}</h2>
                <p style="font-size: 16px;">
                    <label>
                        <input type="checkbox" id="baseRarityInput" checked class="rarityInput customRarityInput" rarity="BASE"> <img src="images/rarity/BASE_BASE.png">
                    </label>
                    <label>
                        <input type="checkbox" id="commonRarityInput" checked class="rarityInput" rarity="COMMON"> <img src="images/rarity/BASE_COMMON.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="rareRarityInput" checked class="rarityInput" rarity="RARE"> <img src="images/rarity/BASE_RARE.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="epicRarityInput" checked class="rarityInput" rarity="EPIC"> <img src="images/rarity/BASE_EPIC.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="legendaryRarityInput" checked class="rarityInput" rarity="LEGENDARY"> <img src="images/rarity/BASE_LEGENDARY.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="determinationRarityInput" checked class="rarityInput" rarity="DETERMINATION"> <img src="images/rarity/BASE_DETERMINATION.png" alt="">
                    </label>
                </p>
                <p style="font-size: 16px;">
                    <label>
                        <input type="checkbox" id="monsterInput" class="typeCardInput" checked typeCard="0"> <img src="images/souls/MONSTER.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="spellInput" class="typeCardInput" typeCard="1"> <img style="height: 24px;" src="images/artifacts/Arcane_Scepter.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="undertaleInput" class="extensionInput" extension="BASE" checked> <img src="images/rarity/BASE.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="deltaruneInput" class="extensionInput" extension="DELTARUNE" checked> <img src="images/rarity/DELTARUNE.png" alt="">
                    </label>
                    <label>
                        <input type="checkbox" id="tokenRarityInput" checked class="rarityInput customRarityInput" rarity="TOKEN"> <img src="images/rarity/BASE_TOKEN.png">
                    </label>
                    <label>
                        <input type="checkbox" id="everyRarityInput" checked> <img style="height: 24px;" src="https://github.com/elytrafae/prettycards/raw/master/img/RarityIcons/ALL_RARITIES.png" alt="Za Filter">
                    </label>
                </p>
                <h2 style="display:inline-block;">${window.$.i18n("pc-sop-answers")}</h2>
                <button class="btn btn-success" id="PrettyCards_SOP_AddButton">${window.$.i18n("pc-sop-add")}</button>
                <div id="PrettyCards_SOP_ButtonSettingsContainer"></div>
                <h2>${window.$.i18n("pc-sop-other")}</h2>
                <div style="margin-bottom: 1em;">
                    <label><input type="checkbox" id="PrettyCards_SOP_ViewSkinsSetting" checked> <span>${window.$.i18n("pc-sop-skins")}</span></label><br>
                    <label><input type="checkbox" id="PrettyCards_SOP_BlindModeSetting"> <span>${window.$.i18n("pc-sop-blind")}</span></label><br>
                    <label><input type="checkbox" id="PrettyCards_SOP_RandomizeSetting"> <span>${window.$.i18n("pc-sop-random")}</span></label><br>
                </div>
                <button class="btn btn-success" id="PrettyCards_SOP_ToPhase3">${window.$.i18n("pc-sop-start")}</button>
            </div>
            <div id="PrettyCards_SOP_Phase3" class="PrettyCards_Hidden">
                <div id="PrettyCards_SOP_Phase3_CardContainer"></div>
                <div id="PrettyCards_SOP_Phase3_Main">
                    <div id="PrettyCards_SOP_Phase3_CardSpace"></div>
                    <div id="PrettyCards_SOP_Phase3_Skins"></div>
                </div>
                <div id="PrettyCards_SOP_Buttons"></div>
            </div>
            <div id="PrettyCards_SOP_Phase4" class="PrettyCards_Hidden">
                <div id="PrettyCards_SOP_Phase4_ButtonContainer">
                    <button class="btn btn-primary" id="PrettyCards_SOP_TakeScreenshot"><span class="glyphicon glyphicon-camera"></span></button>
                </div>
                <div id="PrettyCards_SOP_Phase4_ScreenshotArea"></div>
            </div>
        `;

        document.getElementById("PrettyCards_SOP_ToPhase2").onclick = function() {
            window.$("#PrettyCards_SOP_Phase1").addClass("PrettyCards_Hidden");
            window.$("#PrettyCards_SOP_Phase2").removeClass("PrettyCards_Hidden");
        }

        document.getElementById("everyRarityInput").onchange = function() {
            var checked = $("#everyRarityInput").prop("checked");
            $('#'+rarityInputList.join(', #')).prop("checked", checked); // Credit goes to Feildmaster for the optimized version.
        }

        addButtonSettingItem(window.$.i18n("pc-sop-smash"), "btn-success");
        addButtonSettingItem(window.$.i18n("pc-sop-smashobj"), "btn-warning");
        addButtonSettingItem(window.$.i18n("pc-sop-pass"), "btn-danger");
        refreshSortables();

        document.getElementById("PrettyCards_SOP_AddButton").onclick = function() {
            addButtonSettingItem("", "btn-success");
        }

        document.getElementById("PrettyCards_SOP_ToPhase3").onclick = startPhase3;

        document.getElementById("PrettyCards_SOP_TakeScreenshot").onclick = function() {
            if (alreadyTakingScreenshot) {return;}
            alreadyTakingScreenshot = true;
            $("#PrettyCards_SOP_Phase4_ScreenshotArea").addClass("PrettyCards_SOP_Screenshot");
            window.html2canvas(document.getElementById("PrettyCards_SOP_Phase4_ScreenshotArea")).then((data) => {
                alreadyTakingScreenshot = false;
                utility.saveCanvasAsImage(data, "sop_results");
                var message = $(`<div><p>The screenshot should have started downloading! If not, you can save it from here!</p></div>`);
                $(data).css("height", "");
                $(data).css("width", "100%");
                message.append(data);
                $("#PrettyCards_SOP_Phase4_ScreenshotArea").removeClass("PrettyCards_SOP_Screenshot");
                window.BootstrapDialog.show({
                    title: "Successful Screenshot!",
                    message: message,
                    buttons: [{
                        label: 'Close',
                        cssClass: 'btn-primary',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
            });
        }
    });
}

export {InitSmashOrPass};