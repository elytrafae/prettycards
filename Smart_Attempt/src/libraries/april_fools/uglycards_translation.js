import { PrettyCards_plugin, addSetting } from "../underscript_checker";
import {utility} from "/src/libraries/utility.js";


var aprilTranslationSetting = addSetting({
    'key': 'april_fools_wording',
    'name': 'Uglycards Wording', // Name in settings page
    'type': 'select',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true,//(utility.getSeasonNumber() >= 81 && utility.getSeasonMonth() == 3), // default value
    'hidden': utility.getSeasonNumber() < 81,
    'category': "april"
});

PrettyCards_plugin.events.on("PrettyCards:registerTranslationSources", function() {
    if (aprilTranslationSetting.value() && utility.getSeasonMonth() == 3) {
        translationFileSource = (lan) => `https://raw.githubusercontent.com/PrettyCards/wording/main/json/translation/aprilFools/${lan}.json`;
        window.prettycards.translationManager.addLanguageSource("PrettyCards:UglyWording", translationFileSource);
    }
})
