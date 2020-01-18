
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

var settings = [];
settings.packs = PrettyCards_plugin.settings().add({
  key: 'Disable Fancy Pack Opening Animation',
});
console.log(settings.packs.value());
