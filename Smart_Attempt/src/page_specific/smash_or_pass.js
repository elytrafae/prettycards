import { allCardSkins } from "../libraries/card_skin_selector";
import { PrettyCards_plugin } from "../libraries/underscript_checker";

const rarityInputList = ["baseRarityInput", "commonRarityInput", "rareRarityInput", "epicRarityInput", "legendaryRarityInput", "determinationRarityInput", "tokenRarityInput", "baseGenInput:not(:disabled)"];
var cards = [];

function initStuff() {
    //console.log("ALL CARDS: ", window.allCards);
}

function addButtonSettingItem(name, style) {
    var parent = $("#PrettyCards_SOP_ButtonSettingsContainer");
    var item = window.$(`
        <div style="padding: 5px;" class="PrettyCards_SOP_ButtonData">
            <span class="handle glyphicon glyphicon-sort" style="cursor:grab;"></span> 
            <label>
                <span>Name: </span>
                <input type="text" value="${name}" id="PrettyCards_SOP_ButtonNameInput"></input>
            </label>
            <label>
                <span>Button Style: </span>
                <select id="PrettyCards_SOP_ButtonStyleInput">
                    <option value="btn-primary" class="text-primary">Blue</option>
                    <option value="btn-info" class="text-info">Light Blue</option>
                    <option value="btn-success" class="text-success">Green</option>
                    <option value="btn-danger" class="text-danger">Red</option>
                    <option value="btn-warning" class="text-warning">Yellow</option>
                </select>
            </label>
            <button class="btn btn-danger" onclick="this.parentElement.remove()">Remove</button>
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

function startPhase3() {
    var buttonContainer = $("#PrettyCards_SOP_Buttons");
    var buttonData = $(".PrettyCards_SOP_ButtonData");
    if (buttonData.length == 0) {
        return;
    }
    cards = getEligibleCardList();
    //allCardSkins
    var p4 = "<h1>Results!</h1>";
    buttonContainer.html("");
    buttonData.each((i, element) => {
        var e = $(element);
        var name = e.find("#PrettyCards_SOP_ButtonNameInput").val();
        var categoryId = name.replace(/[^\w]/gi, '_');
        var style = e.find("#PrettyCards_SOP_ButtonStyleInput").val();
        p4 += `<h2>${e.find("#PrettyCards_SOP_ButtonNameInput").val()}</h2><div id="PrettyCards_SOP_Cards_${categoryId}"></div>`;
        var button = $(`<button class="btn ${style}">${name}</button>`); // TODO: Add onclick event to this!
        button.click(function() {

        });
        buttonContainer.append(button);
    })
    $("#PrettyCards_SOP_Phase4").html(p4);

    window.$("#PrettyCards_SOP_Phase2").addClass("PrettyCards_Hidden");
    window.$("#PrettyCards_SOP_Phase3").removeClass("PrettyCards_Hidden");
}

function InitSmashOrPass() {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        if (window.allCards && window.allCards.length > 0) {
            initStuff();
        } else {
            window.document.addEventListener('allCardsReady', function() {
                initStuff();
            });
        }

        document.getElementsByClassName("mainContent")[0].innerHTML = `
            <div id="PrettyCards_SOP_Phase1">
                <h1>Welcome to Undercards Smash or Pass!</h1>
                <h2>What is Smash or Pass?</h2>
                <p>In case you have been living under a rock, Smash or Pass is a game where characters from a certain media are presented, one by one, and the player has to decide whether or not they would "smash" it. Interpret that as you will.</p>
                <p>Newer variations of the game can also include other categories, such as "befriend", but the main concept is this.</p>
                <p>After all the characters have been given a verdict, statistics follow, which can be analized, shared with friends or just posted online for the whole world to judge you!</p>
                <h2>Why do this with Undercards?</h2>
                <p>Because it's fun, and certain cards can spark interesting discussions in a civil and understanding environment.</p>
                <p>I recommend everyone take this in a light-hearted, fun way.</p>
                <h2>Are you sick in the head?!</h2>
                <p>Yes. :3</p>
                <br>
                <button class="btn btn-success" id="PrettyCards_SOP_ToPhase2">Onto the settings!</button>
                <button class="btn btn-danger" onclick="window.location.href = '/';">I wanna chicken out!</button>
            </div>
            <div id="PrettyCards_SOP_Phase2" class="PrettyCards_Hidden">
                <h1>Game Settings</h1>
                <h2>Card Filters</h2>
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
                        <input type="checkbox" id="everyRarityInput" checked> <img style="height: 24px;" src="https://github.com/CMD-God/prettycards/raw/master/img/RarityIcons/ALL_RARITIES.png" alt="Za Filter">
                    </label>
                </p>
                <h2 style="display:inline-block;">Answer Options</h2>
                <button class="btn btn-success" id="PrettyCards_SOP_AddButton">Add Button</button>
                <div id="PrettyCards_SOP_ButtonSettingsContainer"></div>
                <h2>Other Settings</h2>
                <div style="margin-bottom: 1em;">
                    <label><input type="checkbox" id="PrettyCards_SOP_ViewSkinsSetting" checked> <span>View other skins next to cards during game (will still count as one verdict)</span></label><br>
                    <label><input type="checkbox" id="PrettyCards_SOP_BlindModeSetting"> <span>Activate blind mode</span></label><br>
                </div>
                <button class="btn btn-success" id="PrettyCards_SOP_ToPhase3">Let's Rock!</button>
            </div>
            <div id="PrettyCards_SOP_Phase3" class="PrettyCards_Hidden">
                <div id="PrettyCards_SOP_Buttons"></div>
            </div>
            <div id="PrettyCards_SOP_Phase4" class="PrettyCards_Hidden"></div>
        `;

        document.getElementById("PrettyCards_SOP_ToPhase2").onclick = function() {
            window.$("#PrettyCards_SOP_Phase1").addClass("PrettyCards_Hidden");
            window.$("#PrettyCards_SOP_Phase2").removeClass("PrettyCards_Hidden");
        }

        document.getElementById("everyRarityInput").onchange = function() {
            var checked = $("#everyRarityInput").prop("checked");
            $('#'+rarityInputList.join(', #')).prop("checked", checked); // Credit goes to Feildmaster for the optimized version.
        }

        addButtonSettingItem("SMASH", "btn-success");
        addButtonSettingItem("SMASH IN/ON/NEAR etc.", "btn-warning");
        addButtonSettingItem("PASS", "btn-danger");
        refreshSortables();

        document.getElementById("PrettyCards_SOP_AddButton").onclick = function() {
            addButtonSettingItem("", "#000000", "#FFFFFF");
        }

        document.getElementById("PrettyCards_SOP_ToPhase3").onclick = startPhase3;
    });
}

export {InitSmashOrPass};