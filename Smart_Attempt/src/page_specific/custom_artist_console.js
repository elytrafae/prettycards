import { PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "/src/libraries/utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var allCardSkins = [];
var allArtists = [];

/*
function toEncodedHTML(input) {
    return $('<span>').text(input).html();
}
*/

function InitCustomArtistConsole() {

    PrettyCards_plugin.events.on("PC_Chat:getSelfInfos", function() {
        if (utility.featuresAccessForGroupOnly("Artist")) {
            StartVerified();
        } else {
            $(".mainContent").html("<h1 class='red'>You don't have access to this page!</h1>");
        }
    })

}

function StartVerified() {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        window.$("title").html("PrettyCards - Custom Artist Console");
        //utility.loadCSSFromGH("CustomTranslations");
        $(".mainContent").html(`
            <h1>PrettyCards Artist Console</h1>
        `);

    })

    fetchSkins();
}

function fetchSkins() {
    $.get("/CardSkinsConfig?action=shop", {}, function(data) {
        console.log(data);
        allCardSkins = JSON.parse(data.cardSkins);
        allArtists = getListOfArtists();
        processSkins();
        console.log(allCardSkins, allArtists);
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

function processSkins() {

}

export {InitCustomArtistConsole};