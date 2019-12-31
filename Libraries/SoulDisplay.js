
window.soulInfo = function(soul_name) {
	var soulStringKey = 'soul-' + soul.replace('_', '-').toLowerCase();
    var soulDescStringKey = soulStringKey + '-desc';
    var name = $.i18n(soulStringKey);
	var desc = $.i18n(soulDescStringKey);
	
	console.log(name, desc);
}