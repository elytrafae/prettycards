
import Tesseract from 'tesseract.js';
import Fuse from 'fuse.js';
import {artifactDisplay} from "../artifact_display.js";
import { PrettyCards_plugin, prettycards } from '../underscript_checker';
import { utility } from "../utility.js";

import { loadCSS } from "../../libraries/css_loader";
import css from "../../css/DeckImageImport.css";
loadCSS(css);

const SOULS = [
    "DETERMINATION",
    "BRAVERY",
    "JUSTICE",
    "KINDNESS",
    "PATIENCE",
    "INTEGRITY",
    "PERSEVERANCE",
    "MONSTER"
];

function openDialogue() {
    var $content = window.$(`<div class="PrettyCards_DeckImageImport_Parent">
        <p1 class="gray">Note: The feature is far from perfect, and some things may be missing from the imported deck. I apologize for the inconvenience, but that's just how image recognition is sometimes.</p1>
        <input id="PrettyCards_DeckImageImport_File" class="PrettyCards_Hidden" type="file" accept="image/*">
        <label for="PrettyCards_DeckImageImport_File" class="PrettyCards_DeckImageImport_FileBtnFancy">Upload Image</label>
        <p>. . . Or enter an image URL:</p><input type="text" id="PrettyCards_DeckImageImport_ImageLink" class="form-control">
        <p class="red" id="PrettyCards_DeckImageImport_Status">
        </div>`);
    var statusParagraph = $content.find("#PrettyCards_DeckImageImport_Status")[0];
    function printStatus(str, c) {
        statusParagraph.innerHTML = str;
        statusParagraph.className = c;
    }
    function printError(str) {printStatus(str, "red")}; 
    function printProgress(str) {printStatus(str, "")}; 
    function printSuccess(str) {printStatus(str, "green")}; 
    $content.find("#PrettyCards_DeckImageImport_File").change(function(e) {
        var files = e.target.files;
        var file = files[0];
        if (!file.type.startsWith("image")) {
            printError("The uploaded file is not an image! Please choose a deck image file and try again!");
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function(fre) {
            //console.log( fre, fre.target.result );
            var url = fre.target.result;
            utility.isImgUrl(url).catch(() => {
                printError("The uploaded file is not an image! Please choose a deck image file and try again!");
            }).then(() => {
                decodeAndDisplayDeck(url);
            });
        };
        fileReader.readAsDataURL(file);
        console.log("A file has been selected.", files);
    });
    $content.find("#PrettyCards_DeckImageImport_ImageLink").keyup(function(e) {
        var url = e.target.value;
        if ((!url) || url.length <= 0) {
            return;
        }
        utility.isImgUrl(url).catch(() => {
            printError("Not valid image URL!");
        }).then(() => {
            printProgress("Valid image URL!");
            decodeAndDisplayDeck(url);
        });
    });
    BootstrapDialog.show({
        title: "Deck Image Import",
        message: $content,
        buttons: [{
            label: window.$.i18n('dialog-cancel'),
            cssClass: 'btn-danger',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
}

function textToDeck(text) {
    console.log(text);
    var soul;
    var artifacts = [];
    var cards = [];
    var list = text.split("\n");
    //console.log(list);
    for (var i=0; i < list.length; i++) {
        var line = list[i];
        if ((!line) || line.length <= 0) {
            continue;
        }
        //console.log(line);
        if (!soul) {
            var fuse = new Fuse(SOULS);
            var results = fuse.search(line);
            if (results.length > 0) {
                soul = results[0].item;
                continue;
            }
        }
        if (artifacts.length < 1 || (artifacts.length == 1 && artifacts[0].rarity != "LEGENDARY")) {
            var fuse = new Fuse(artifactDisplay.artifacts, {keys: ["name"]});
            var results = fuse.search(line);
            if (results.length > 0) {
                artifacts.push(results[0].item);
                continue;
            }
        }
        var fuse = new Fuse(window.allCards, {keys: ["name"]});
        var results = fuse.search(line);
        if (results.length > 0) {
            cards.push(results[0].item);
            continue;
        }
        console.log("Could not find any matches for line (ignoring): ", line);
    }
    console.log("DECK: ", soul, artifacts, cards);
    return {soul: soul, artifacts: artifacts, cards: cards};
}

function toOnuJSONFormat(deck) {
    return {
        soul: deck.soul, 
        artifactIds: deck.artifacts.map((art) => {return art.id;}),
        cardIds: deck.cards.map((card) => {return card.fixedId || card.id;})
    }
}

function decodeAndDisplayDeck(link = "https://media.discordapp.net/attachments/904110195867803669/1110045770679337030/zkVln3lpvtLAAAAAElFTkSuQmCC.png?width=225&height=740") {
    Tesseract.recognize(
        link, 
        "eng", 
        {}
    ).then(
        ({ data: { text } }) => {
            window.showDeckLoad(toOnuJSONFormat(textToDeck(text)));
        }
    );
}

prettycards.testDeckImageImport = decodeAndDisplayDeck;
prettycards.testDeckImageImportDialogue = openDialogue;