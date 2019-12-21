
var TextLibrary = {};

TextLibrary.CreateText = function() {
	this.wait = 200;
	this.timeout = setTimeout(TextLibrary._typeText, this.wait);
	console.log(this);
}

TextLibrary._typeText = function() {
	console.log(this);
}

TextLibrary.SetText = function() {
	
}