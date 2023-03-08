
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

var categories = {
    "misc" : "Miscellaneous",
    "card" : "Card Related",
    "controversial" : "<span class='red'>Controversial</span>",
    "background" : "Background",
    "packs" : "Packs",
    "artifact" : "Artifact Related",
    "april": "<span class='ranbowText'>April Fools</span>"
}

function addSetting(data) {
    if (data.note && typeof(data.note) != "function") {
        data.note = `<div style="max-width: 600px;">${data.note}</div>`;
    }
    data.category = categories[data.category || "misc"];
    var setting = PrettyCards_plugin.settings().add(data);
    settings[data.key] = setting;
    return setting;
}

addSetting({
    'key': 'turn_off',
    'name': 'Turn Off PrettyCards', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': false, // default value
    'category': "controversial"
});

if (settings.turn_off.value()) {
    throw "PrettyCards is stopped!";
}

addSetting({
    'key': 'packs_page',
    'name': 'Enable Fancy Packs Page', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'category': "packs"
});

addSetting({
	'key': 'breaking_skin_fix',
	'name': 'Breaking Skin Fix', // Name in settings page
	'note': 'Whenever you hover over a breaking skin card, the name, description, cost, ATK and HP will go over the skin.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "card"
});

addSetting({
	'key': 'breaking_skin_stats_fix',
	'name': 'Breaking Skin Stats Fix', // Name in settings page
	'note': 'Hides stats and tribes behind breaking skin to not break immersion. Hovering over a card will show them. Only works in non-Game settings if Breaking Skin Fix is also enabled.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': true, // default value
	'category': "card"
});

addSetting({
    'key': 'override_decks',
    'name': 'Override Deck System', // Name in settings page
    'note': 'Overrides the current deck system locally with a more flexible one. This inludes the Decks page, Play page, Custom page and the Custom Challenge system.',
    'type': 'boolean',
    //'disabled': true,
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'category': "controversial"
});

addSetting({
    'key': 'override_decks_autogen',
    'name': 'Create Autogen Decks', // Name in settings page
    'note': 'While using my Custom Deck System, if the system cannot find an exact replica of the deck on Onu\'s server, it will create an "Autogen" deck. Unfortunately, this, for some reason, can malfunction in some cases. This is why I added this setting, with which you can turn off this behavior.<br><span class="red">If turned off, decks from other devices uploaded to the server may be lost forever without a backup. Use at own risk, or turn off the Custom Deck system entirely!</span>',
    'type': 'boolean',
    //'disabled': true,
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
    'category': "controversial"
});

addSetting({
    'key': 'my_own_custom_cards',
    'name': 'My Own Custom Cards', // Name in settings page
    'note': 'A Hidden setting that lets me see my own custom card sets, while not letting others see it.',
    'type': 'boolean',
    'disabled': true,
    'hidden': true,
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': false, // default value
});

//console.log(settings);

export {PrettyCards_plugin, settings, prettycards, addSetting};
