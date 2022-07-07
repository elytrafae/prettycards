
if (typeof(window.underscript) === "undefined") {
    if ((!window.localStorage.getItem("PrettyCards_DependencyErrorMessageShown")) || (window.localStorage.getItem("PrettyCards_DependencyErrorMessageShown") == "false")) {
        var dialog = window.BootstrapDialog.show({
                title: "Oh no!",
                type: window.BootstrapDialog.TYPE_WARNING,
                message: "Looks like you don't have Underscript installed, or you deactivated it! In order for PrettyCards to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.",
                buttons: [{
                        label: "Proceed",
                        cssClass: 'btn-primary',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }
                ]
            });
        window.localStorage.setItem("PrettyCards_DependencyErrorMessageShown", true);
    };
	console.error("PrettyCards Error: Underscript is not installed!");
} else {
    window.localStorage.setItem("PrettyCards_DependencyErrorMessageShown", false);
}

var PrettyCards_plugin = window.underscript.plugin("PrettyCards");
var prettycards = {};
window.prettycards = prettycards;
window.PrettyCards_plugin = PrettyCards_plugin;
//var PrettyCards_plugin = underscript.plugin('<span class="RARE">PrettyCards</span>');
//console.log("Plugin: ", PrettyCards_plugin);

var settings = {};
window.PrettyCards_settings = settings;

settings.turn_off = PrettyCards_plugin.settings().add({
    'key': 'turn_off',
    'name': 'Turn Off PrettyCards', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': false, // default value
});

if (settings.turn_off.value()) {
    throw "PrettyCards is stopped!";
}

settings.packs = PrettyCards_plugin.settings().add({
    'key': 'packs_page',
    'name': 'Enable Fancy Packs Page', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});

settings.override_decks = PrettyCards_plugin.settings().add({
    'key': 'override_decks',
    'name': 'Override Deck System', // Name in settings page
    'note': 'Overrides the current deck system locally with a more flexible one. This inludes the Decks page, Play page, Custom page and the Custom Challenge system.',
    'type': 'boolean',
    //'disabled': true,
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});

//console.log(settings);

export {PrettyCards_plugin, settings, prettycards};
