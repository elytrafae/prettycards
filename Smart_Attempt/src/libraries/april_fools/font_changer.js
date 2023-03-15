
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
    'options': ["SEASONAL", "RANDOM", "OFF", defaultAprilFoolsFontName].concat(aprilFoolsFontNames),
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': "SEASONAL", // default value
    'hidden': function() {return utility.getSeasonNumber() < 81},
    'category': "april"
});

var settingVal = aprilFontSetting.value();
if (settingVal == "SEASONAL") {
    PrettyCards_plugin.events.on("PrettyCards:seasonNumber", function() {
        settingVal = utility.getSeasonMonth() != 3 ? "OFF" : "RANDOM";
        performFontLogic();
    })
} else {
    performFontLogic();
}

function performFontLogic() {
    if (settingVal != "OFF") {
        var chosenFont;
        if (settingVal == "RANDOM") {
            chosenFont = defaultAprilFoolsFont;
            var nonArialChance = underscript.utils.rand(10, 1, true);
            if (nonArialChance <= 2) {
                chosenFont = aprilFoolsGuestFonts[underscript.utils.rand(aprilFoolsGuestFonts.length)];
            }
        } else {
            if (settingVal == defaultAprilFoolsFontName) {
                chosenFont = defaultAprilFoolsFont;
            } else {
                var index = aprilFoolsFontNames.findIndex((e) => e == settingVal);
                chosenFont = aprilFoolsGuestFonts[index];
            }
        }
        
        //document.body.style.fontFamily = "Arial";
        changeFont();
        PrettyCards_plugin.events.on("PrettyCards:onPageLoad", changeFont);
    }
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