
var TextLibrary = {};

TextLibrary.CreateText = function() {
    var self = this;
	this.wait = 200;
	this.timeout = setTimeout(function() {
        console.log('setTimout this=', this);
        self._typeText();
    }, 200);
    this._typeText();
	console.log(this);
}

TextLibrary.CreateText.prototype._typeText = function() {
		console.log("TypeText: ", this);
	};

TextLibrary.SetText = function() {

}