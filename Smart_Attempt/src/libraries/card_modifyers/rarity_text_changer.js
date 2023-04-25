
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";
import { rarityIconsHTML } from "../rarity_icons";

var optionList = ["Text", "Adapt", "Undertale", "Deltarune"];

addSetting({
	'key': 'rarity_text_change',
	'name': 'Change Rarity Text', // Name in settings page
    'note': function() {
        return "Change every mention of a rarity into their respective icons.";
    },
	'type': 'select',
    'options': optionList,
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': optionList[0], // default value
    'category': "card"
});

function DisplayToSystem(str) {
    //console.log("STR", str);
    var ret = "WHY DOES THIS KEEP HAPPENING!?";
    switch (str) {
        case optionList[0]: ret = "TEXT"; break;
        case optionList[1]: ret = "ADAPT"; break;
        case optionList[2]: ret = "BASE"; break;
        case optionList[3]: ret = "DELTARUNE"; break;
    }
    return ret;
}

var mode = "TEXT";

//if (settings.rarity_text_change.disabled()) {
    PrettyCards_plugin.events.on("translation:loaded", function() {
        $.extend($.i18n.parser.emitter, {
            rarity: function(nodes) {
                if (nodes.length >= 1) {
                    var rarity = nodes[0];
                    var stringKey = 'rarity-' + rarity.replace(/_/g, '-').toLowerCase();
                    var overrideText = checkOverride(nodes);
                    var text = overrideText || $.i18n(stringKey);
                    if (mode == "TEXT") { 
                        return '<span class="' + rarity + '">' + text + '</span>';
                    }
                    var icon = rarityIconsHTML[mode][rarity];
                    icon = $(icon).css({height: "1.5em"})[0].outerHTML;
                    return icon;
                }
            }
        });
    })

    PrettyCards_plugin.events.on('pre:func:appendCard pre:viewArtifacts() pre:viewArtifact() pre:viewSoul()', (card) => {
        if (window.underscript.onPage("CustomCards")) {mode = "TEXT"; return;} // Feature currently disabled on the Custom Cards page due to technical issues.
        const value = settings.rarity_text_change.value();
        //console.log("Setting Value: ", value);
        if (value === 'Text') return;
        if (card.extension) { // If the received data is actually a card . . .
            mode = value === 'Adapt' ? card.extension : DisplayToSystem(value); // convert value to appropriate extension
        } else { // If it's something else . . .
            mode = value === 'Adapt' ? "TEXT" : DisplayToSystem(value); 
        }
        //console.log("Translating something . . .", mode);
    });
    PrettyCards_plugin.events.on('func:appendCard viewArtifacts() viewArtifact() viewSoul()', () => {
        mode = "TEXT";
    });
//}