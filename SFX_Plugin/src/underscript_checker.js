
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

var default_value = 50

var settings = [];
settings.turn_start = plugin.settings().add({
        'key': 'turn_start',
        'name': 'Enable the "Turn Start" sound.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value
		'reset': true,
    });

settings.buff = plugin.settings().add({
        'key': 'buff',
        'name': 'Enable the "Buff a Monster" sound.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value
		'reset': true,
    });
	
settings.nerf = plugin.settings().add({
        'key': 'nerf',
        'name': 'Enable the "Nerf/Debuff a Monster" sound.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value,
		'reset': true,
    });
	
settings.paralyze = plugin.settings().add({
        'key': 'paralyze',
        'name': 'Enable the "Paralyze a Monster" sound.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value
		'reset': true,
    });
	
settings.kr = plugin.settings().add({
        'key': 'kr',
        'name': 'Enable the "Give KR to a Monster" sound.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value
		'reset': true,
    });
	
settings.silence = plugin.settings().add({
        'key': 'silence',
        'name': 'Enable the "Give Silence to a Monster" sound.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value
		'reset': true,
    });
/*
settings.crit_spell = plugin.settings().add({
        'key': 'crit_spell',
        'name': 'Enable the "Critical Spell" sound. By a "Critical Spell", I mean a spell or monster effect that deals 7 or more damage, similar to how attacks have this, too. Unfortunately, this doesn\'t work properly because the server refuses to tell me what dealt the damage.', // Name in settings page
        'type': 'slider',
        'refresh': false, // true to add note "Will require you to refresh the page"
        'default': default_value, // default value
    });
*/

//console.log(settings);

export {plugin, settings};
