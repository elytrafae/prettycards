
const icon = "";

if (window.underscript.onPage("Crafting")) {
    var label = $('<label><input type="checkbox" id="everyRarityInput"> <img style="height: 24px;" src="' + filter.icon + '" alt=""></label>');
	$("#baseGenInput").parent().parent().append(label);
}