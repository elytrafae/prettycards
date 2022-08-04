import { PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "/src/libraries/utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";
//import gify from "/src/third_party/gify.min.js";

var allCardSkins = [];
var allArtists = [];

/*
function toEncodedHTML(input) {
    return $('<span>').text(input).html();
}
*/

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    window.$("body").append(`<script src="https://raw.githubusercontent.com/CMD-God/prettycards/master/Smart_Attempt/src/third_party/gify.min.js"></script>`);
})

function InitCustomArtistConsole() {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        $(".mainContent").html("<h1>Please wait until you're logged into chat . . .</h1>");
        PrettyCards_plugin.events.on("PC_Chat:getSelfInfos", function() {
            if (utility.featuresAccessForGroupOnly("Artist")) {
                StartVerified();
            } else {
                $(".mainContent").html("<h1 class='red'>You don't have access to this page!</h1>");
            }
        })
    })

}

function StartVerified() {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        utility.loadCSSFromGH("ArtistConsole");
        window.$("title").html("PrettyCards - Custom Artist Console");
        //utility.loadCSSFromGH("CustomTranslations");
        $(".mainContent").html(`
            <h1>PrettyCards Artist Console</h1>
            <select id="PrettyCards_AC_ArtistSelector" class="form-control Artist"></select>
            <div id="PrettyCards_AC_IdChecker"></div>
            <div id="PrettyCards_AC_ZipMaker"></div>
        `);

        $("#PrettyCards_AC_ArtistSelector").change(onArtistChange);

    })

    fetchSkins();
}

function fetchSkins() {
    $.get("/CardSkinsConfig?action=shop", {}, function(data) {
        //console.log(data);
        allCardSkins = JSON.parse(data.cardSkins);
        allArtists = getListOfArtists();
        processArtistSelect();
        onArtistChange();
        //console.log(allCardSkins, allArtists);
    });
}

function getListOfArtists() {
    var artists = [];
    allCardSkins.forEach((s) => {
        var artist = s.authorName;
        if (!artists.includes(artist)) {
            artists.push(artist);
        }
    })
    return artists.sort();
}

function processArtistSelect() {
    var txt = `<option value=""></option>`;
    allArtists.forEach((artist) => {
        txt += `<option value="${artist}">${artist}</option>`
    })
    $("#PrettyCards_AC_ArtistSelector").html(txt);
    if (allArtists.includes(window.selfUsername)) {
        $("#PrettyCards_AC_ArtistSelector").val(window.selfUsername);
    }
}

function onArtistChange() {
    var artist = $("#PrettyCards_AC_ArtistSelector").val();
    PrettyCards_plugin.events.on("PrettyCards:hdSkinsFetched", function(data) {
        var skins = data[0].skins;
        //console.log(skins);
        processSkins(artist, skins);
        processZipMaker(artist, skins);
    });
}

function getUnlistedSkins(artist, skins) {
    var unlistedSkins = [];
    allCardSkins.forEach((skin) => {
        if (artist == "" || skin.authorName == artist) {
            if (!skins.includes(skin.image)) {
                unlistedSkins.push(skin);
            }
        }
    })
    return unlistedSkins;
}

function processSkins(artist, skins) {
    var unlistedSkins = getUnlistedSkins(artist, skins);
    if (unlistedSkins.length == 0) {
        $("#PrettyCards_AC_IdChecker").html(`<h2 class="KINDNESS">All of this artist's skins are registered!</h2>`);
    } else {
        var text = "<li>" + unlistedSkins.map((e) => {return e.image;}).join("</li><li>") + "</li>";
        $("#PrettyCards_AC_IdChecker").html(`<div id="PrettyCards_AC_MissingSkinList"><ul>${text}</ul></div>`)
    }
}

function processZipMaker(artist, skins) {
    var unlistedSkins = getUnlistedSkins(artist, skins);
    var selectHTML = "";
    unlistedSkins.forEach((skin) => {
        selectHTML += `<option value="${skin.image}">${skin.name}</option>`;
    })
    $("#PrettyCards_AC_ZipMaker").html(`<table id="PrettyCards_AC_ZipMakerTable"><tbody></tbody></table>`);
    var tBody = $("#PrettyCards_AC_ZipMaker").find("tbody");
    function imageUploadEvent(e) {
        var element = e.currentTarget;
        var file = element.files[0];
        console.log(file);
        var label = document.querySelector("label[for=" + element.id + "]");
        if (label.innerHTML === "") {
            addRow(tBody.find("tr").length);
        }
        label.innerHTML = `<img src="${URL.createObjectURL(file)}">`;
        if (file.type == "image/gif") {
            gifToFrames(file);
        } else {
            imageToPng(label.firstChild.src); // This is only for debugging!
        }
    }
    function addRow(rowNr) {
        var uploaderId = `PrettyCards_AC_ImageUpload_${rowNr}`;
        tBody.append(`
            <tr>
                <td><div style="display:flex;"><label class="PrettyCards_AC_ImageUploadLabel" for="${uploaderId}"></label></div><input type="file" class="PrettyCards_Hidden" id="${uploaderId}" accept="image/*"></td>
                <td><select class="PrettyCards_AC_ImageUploadSelect form-control white">${selectHTML}</select></td>
            </tr>
        `);
        tBody.find(`#${uploaderId}`).change(imageUploadEvent);
    }
    addRow(0);
}

function imageToPng(src) {
    var imageElement = document.createElement("IMG");
    imageElement.onload = function() {
        var canvas = document.createElement("CANVAS");
        canvas.setAttribute("height", imageElement.height);
        canvas.setAttribute("width", imageElement.width);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
        $(".mainContent").append(canvas);
    }
    imageElement.src = src;
}

function gifToFrames(file) {
    console.log(gify);
    if (gify.isAnimated(file)) {
        var gif = new GIF(file);
        framesArray = gif.decompressFrames(true);
        totalFrames = framesArray.length;
        console.log("GIF", gif);
    } else {
        console.error("THIS IS NOT AN ANIMATED GIF!");
    }
}


export {InitCustomArtistConsole};