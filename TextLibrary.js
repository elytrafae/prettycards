
var TextLibrary = {};

TextLibrary.Create = function() {
	this.wait = 200;
	this.timeout = setTimeout(TextLibrary._typeText, this.wait);
}

TextLibrary._typeText = function() {
	console.log(this);
}

TextLibrary.SetText = function() {
	
}