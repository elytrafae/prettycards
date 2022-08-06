import { PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "/src/libraries/utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";
import { parseGIF, decompressFrames } from 'gifuct-js';

var allCardSkins = [];
var allArtists = [];

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    window.$("body").append(`
        <script src="https://cdn.jsdelivr.net/gh/CMD-God/prettycards@c21e2752003c48dd20b097ffb97c577ef5677f47/put_on_page_libs/pako.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/CMD-God/prettycards@c21e2752003c48dd20b097ffb97c577ef5677f47/put_on_page_libs/UPNG.js"></script>
    `);
})

function getCheckableName(file) {
    var name = file.name.replace(/\.[^/.]+$/, "");
    name = name.replaceAll(" ", "_").toUpperCase();
    return name;
}

function returnmatchedValue(file, selectElement) {
    var name = getCheckableName(file);
    var options = selectElement.children;
    for (var i=0; i < options.length; i++) {
        var option = options[i];
        if (option.value.toUpperCase() === name) {
            return option.value;
        }
    }
    return null;
}

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
        var selectElement = element.parentElement.parentElement.children[1].firstChild; // I feel disgusted, but I am making this in a hurry anyway.
        var value = returnmatchedValue(file, selectElement); 
        if (value != null) {
            selectElement.value = value;
        }
        if (file.type == "image/gif") {
            gifToApng(file);
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

function getImageAndSize(src, cb) {
    var imageElement = document.createElement("IMG");
    imageElement.onload = function() {
        cb(imageElement.width, imageElement.height, imageElement);
    }
    imageElement.src = src;
}

function imageToPng(src) {
    getImageAndSize(src, (width, height, element) => {
        var canvas = document.createElement("CANVAS");
        canvas.setAttribute("height", height);
        canvas.setAttribute("width", width);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(element, 0, 0, width, height);
        $(".mainContent").append(canvas);
    })
}

function gifToApng(file) {
    file.arrayBuffer().then( (arrayBuffer) => {
        var gif = parseGIF(arrayBuffer);
        frames = decompressFrames(gif, true);
        console.log("GIF", frames);
        var width = frames.dims.width;
        var height = frames.dims.height;
        frames.forEach((frame) => {
            var canvas = document.createElement("CANVAS");
            canvas.setAttribute("height", height);
            canvas.setAttribute("width", width);
            var ctx = canvas.getContext("2d");
            var imageData = ctx.createImageData(width, height);
            frame.patch.forEach((p, i) => {
                imageData.data[i] = p;
            })
            console.log(imageData);
            ctx.putImageData(imageData, 0, 0);
            $(".mainContent").append(canvas);
        });
        var framePixels = frames.map((e) => {return new Uint8Array(e.pixels);});
        var dels = frames.map((e) => {return e.delay;});
        console.log(framePixels);
        console.log(dels);
        var png = window.UPNG.encode(framePixels, width, height, 0, dels);
        var pngArray = new Uint8Array(png);
        var blobUrl = URL.createObjectURL(new Blob([pngArray], {type: "image/png"}));
        console.log(png);
        console.log(pngArray);
        console.log(blobUrl);
        utility.downloadFile(pngArray, "test.png", "image/png");
        //const decoder = new TextDecoder('utf8');
        //const b64encoded = btoa(decoder.decode(png));
        $(".mainContent").append(`<img src="${blobUrl}">`);
    });
}


export {InitCustomArtistConsole};