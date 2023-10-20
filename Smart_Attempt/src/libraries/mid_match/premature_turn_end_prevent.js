import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";

var selectSetting = addSetting({
    'key': 'no_turn_end_while_select',
    'name': 'Prevent Ending Turn while Selecting a Target', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'category': "noob_help"
});

/*
var dealSetting = addSetting({
    'key': 'no_turn_end_while_deal',
    'name': 'Turn End warning with [FREE KROMER]', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'category': "noob_help"
});
*/

var wasWarned = false;
if (window.underscript.onPage("Game")) {
    PrettyCards_plugin.events.on("player:endTurn", function() {
        // The feature had to be disabled :/
        var dealCondition = false; //(dealSetting.value() && !!document.querySelector('#handCards [fixedid="719"]') && !!document.querySelector('#yourArtifacts [artifactid="46"]'));
        if (dealCondition && !wasWarned) {
            sendDealWarning();
        }
        this.canceled = (selectSetting.value() && !!document.querySelector(".target")) || (dealCondition && !wasWarned);
    })
}

function sendDealWarning() {
    window.BootstrapDialog.show({
        "title": window.$.i18n("pc-matchwarn"),
        "type": "type-danger",
        "message": window.$.i18n("pc-matchwarn-sneo"),
        buttons: [
            {
                label: window.$.i18n("pc-navigate-noturnend"),
                cssClass: 'btn-primary us-normal',
                action(dialog) {
                    dialog.close();
                }
            },
            {
                label: window.$.i18n("pc-navigate-suicide"),
                cssClass: 'btn-danger us-normal',
                action(dialog) {
                    dialog.close();
                    wasWarned = true;
                    window.endTurn();
                    wasWarned = false;
                }
            },
            {
                label: window.$.i18n("pc-navigate-disablewarn"),
                cssClass: 'btn-danger us-normal',
                action(dialog) {
                    dialog.close();
                    wasWarned = true;
                    dealSetting.set(false);
                    window.endTurn();
                }
            }
        ]
    });
}

prettycards.sendDealWarning = sendDealWarning;