
var loadedFonts = {};

function Uniqueify(name, i=0) {
	var real_name = name;
	if (i > 0) {
		real_name = name + i;
	}
	if (loadedFonts[real_name]) {
		return Uniqueify(name, i+1);
	}
	return real_name;
}

function LoadFont(name, link) {
	var real_name = Uniqueify(name);
	var real_link = 'url(' + link + ')';
	var font = new FontFace(real_name, real_link);
	//console.log("FONT TO LOAD", font, real_name, real_link);
	loadedFonts[real_name] = font;
	
	font.load().then(function(loaded_face) {
		//console.log(font == loaded_face, font, loaded_face)
		window.document.fonts.add(loaded_face);
	}).catch(function(error) {
		console.error('Error loading font "' + real_name + '": ', error);
	});
	return real_name;
}

function ListenForWhenAllFontsAreLoaded(func) {
	window.document.fonts.ready.then(func);
} 

export {LoadFont, ListenForWhenAllFontsAreLoaded};