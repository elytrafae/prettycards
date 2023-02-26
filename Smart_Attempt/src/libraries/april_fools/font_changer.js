
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

const defaultAprilFoolsFont = "Arial, Helvetica, sans-serif";
const aprilFoolsGuestFonts = [
    `"Times New Roman", Times, serif`,
    `"Courier New", monospace`,
    `"Brush Script MT"`,
    `"Comic Sans MS", "Comic Sans", cursive`,
    `Papyrus, fantasy`
];
const defaultAprilFoolsFontName = "Arial";
const aprilFoolsFontNames = [
    "TimesNewRoman",
    "CourierNew",
    "BrushScriptMT",
    "ComicSansMS",
    "Papyrus"
];

var aprilFontSetting = addSetting({
    'key': 'april_fools_font',
    'name': 'April Fools Font', // Name in settings page
    'type': 'select',
    'options': ["RANDOM", "OFF", defaultAprilFoolsFontName].concat(aprilFoolsFontNames),
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': (utility.getSeasonNumber() < 81 || utility.getSeasonMonth() != 3) ? "OFF" : "RANDOM", // default value
    'hidden': utility.getSeasonNumber() < 81
});

if (aprilFontSetting.value() != "OFF") {
    var chosenFont;
    if (aprilFontSetting.value() == "RANDOM") {
        chosenFont = defaultAprilFoolsFont;
        var nonArialChance = underscript.utils.rand(10, 1, true);
        if (nonArialChance <= 2) {
            chosenFont = aprilFoolsGuestFonts[underscript.utils.rand(aprilFoolsGuestFonts.length)];
        }
    } else {
        if (aprilFontSetting.value() == defaultAprilFoolsFontName) {
            chosenFont = defaultAprilFoolsFont;
        } else {
            var index = aprilFoolsFontNames.findIndex((e) => e == aprilFontSetting.value());
            chosenFont = aprilFoolsGuestFonts[index];
        }
    }
    
    //document.body.style.fontFamily = "Arial";
    changeFont();
    plugin.events.on("PrettyCards:onPageLoad", changeFont);
}

function changeFont() {
    if (document.getElementById("PrettyCards_AprilFoolsFonts")) {
        return;
    }
    var ele = document.createElement("STYLE");
    ele.id = "PrettyCards_AprilFoolsFonts";
    ele.innerHTML = `
        body {
            font-family: ${chosenFont}!important;
        }

        div.chat-box {
            font-family: ${chosenFont}!important;
        }

        .mono .modal-body { font-family: ${chosenFont}!important; }

        .underscript-dialog legend { font-family: ${chosenFont}!important; }
    `;
    document.head.appendChild(ele);
}