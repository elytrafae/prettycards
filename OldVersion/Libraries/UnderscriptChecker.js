
if (typeof(underscript) === "undefined") {
  if ((!localStorage.getItem("PrettyCards_DependencyErrorMessageShown")) || (localStorage.getItem("PrettyCards_DependencyErrorMessageShown") == "false")) {
    var dialog = BootstrapDialog.show({
        title: "Oh no!",
        type: BootstrapDialog.TYPE_WARNING,
        message: "Looks like you don't have Underscript installed, or you deactivated it! In order for PrettyCards to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.",
        buttons: [{
            label: "Proceed",
            cssClass: 'btn-primary',
            action: function (dialog) {
                dialog.close();
            }
        }]
    });
    localStorage.setItem("PrettyCards_DependencyErrorMessageShown", true);
  };
  return;
} else {
  localStorage.setItem("PrettyCards_DependencyErrorMessageShown", false);
}

PrettyCards_plugin = underscript.plugin("PrettyCards");
//console.log("Plugin: ", PrettyCards_plugin);

settings = [];
settings.packs = PrettyCards_plugin.settings().add({
  'key': 'packs_page',
  'name': 'Enable Fancy Packs Page', // Name in settings page
  'type': 'boolean',
  'refresh': true, // true to add note "Will require you to refresh the page"
  'default': true, // default value
});

settings.replace_soul_selection = PrettyCards_plugin.settings().add({
  'key': 'replace_soul_selection',
  'name': 'Replace Soul Selection', // Name in settings page
  'type': 'boolean',
  'refresh': true, // true to add note "Will require you to refresh the page"
  'default': true, // default value
});

settings.easter_egg_cards = PrettyCards_plugin.settings().add({
  'key': 'enable_easter_egg_cards',
  'name': 'Enable Custom Easter Egg Cards', // Name in settings page
  'note': 'Crossover cards created by me.<br>Warning! Doesn\'t always work (for some reason)!',
  'type': 'boolean',
  'refresh': true, // true to add note "Will require you to refresh the page"
  'default': false, // default value
});

settings.debug_mode = PrettyCards_plugin.settings().add({
  'key': 'debug_mode',
  'name': 'Enable Debug Mode', // Name in settings page
  'type': 'boolean',
  'refresh': true, // true to add note "Will require you to refresh the page"
  'default': false, // default value
});
