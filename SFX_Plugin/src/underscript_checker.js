
if (typeof(window.underscript) === "undefined") {
    if ((!window.localStorage.getItem("PrettyCardsAudio_DependencyErrorMessageShown")) || (window.localStorage.getItem("PrettyCardsAudio_DependencyErrorMessageShown") == "false")) {
        var dialog = window.BootstrapDialog.show({
                title: "Oh no!",
                type: window.BootstrapDialog.TYPE_WARNING,
                message: "Looks like you don't have Underscript installed, or you deactivated it! In order for PrettyCards Audio to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.",
                buttons: [{
                        label: "Proceed",
                        cssClass: 'btn-primary',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }
                ]
            });
        window.localStorage.setItem("PrettyCardsAudio_DependencyErrorMessageShown", true);
    };
} else {
    window.localStorage.setItem("PrettyCardsAudio_DependencyErrorMessageShown", false);
}

var plugin = window.underscript.plugin("PrettyCards Audio");
window.PrettyCardsAudio_plugin = plugin;
//var PrettyCards_plugin = underscript.plugin('<span class="RARE">PrettyCards</span>');
//console.log("Plugin: ", PrettyCards_plugin);

var settings = [];
settings.turn_start = plugin.settings().add({
        'key': 'turn_start',
        'name': 'Enable the "Turn Start" sound.', // Name in settings page
        'type': 'boolean',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': true, // default value
    });

settings.buff = plugin.settings().add({
        'key': 'buff',
        'name': 'Enable the "Buff a Monster" sound.', // Name in settings page
        'type': 'boolean',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': true, // default value
    });
	
settings.nerf = plugin.settings().add({
        'key': 'nerf',
        'name': 'Enable the "Nerf/Debuff a Monster" sound.', // Name in settings page
        'type': 'boolean',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': true, // default value
    });
	
settings.paralyze = plugin.settings().add({
        'key': 'paralyze',
        'name': 'Enable the "Paralyze a Monster" sound.', // Name in settings page
        'type': 'boolean',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': true, // default value
    });

//console.log(settings);

export {plugin, settings};
