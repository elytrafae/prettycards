import { PrettyCards_plugin, settings } from "../underscript_checker";

const icon = "https://github.com/CMD-God/prettycards/raw/master/img/RarityIcons/ALL_RARITIES.png";
const rarityInputList = ["baseRarityInput", "commonRarityInput", "rareRarityInput", "epicRarityInput", "legendaryRarityInput", "determinationRarityInput", "tokenRarityInput", "baseGenInput"];

settings.za_filter = PrettyCards_plugin.settings().add({
	'key': 'za_filter',
	'name': 'Enable "Toggle All Rarities" button', // Name in settings page
	'note': "Also known as the \"Za Filter\".",
	'type': 'boolean',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'default': true, // default value
});

function allRarityUpdate(e) {
    var checked = $("#everyRarityInput").prop("checked");
    for (var i=0; i < rarityInputList.length; i++) {
        $("#" + rarityInputList[i]).prop("checked", checked);
    }
    window.applyFilters();
    window.showPage(0);
}

if (window.underscript.onPage("Crafting") && settings.za_filter.value()) {
    var label = $('<label><input type="checkbox" id="everyRarityInput"> <img style="height: 24px;" src="' + icon + '" alt="Check all rarities"></label>');
    label.find("input").change(allRarityUpdate);
	$("#baseGenInput").parent().parent().append(label);
}
