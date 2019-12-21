
GM_addStyle(".dialogueContainer {position: absolute; bottom: 3em; min-width: 20em; max-width: 100em; width: 60%; left: 20%; padding-top: 14%; background-color: black; border: 5px solid white; z-index: 200;}");
GM_addStyle(".dialogueTxtContainer {position: absolute; top: 0; left: 0; bottom: 0; right: 0; padding: 0.5em; font-size: 2.5em; color: white;}");

var TextLibrary = {};

TextLibrary.CreateText = function(txt) {
    var self = this;
	this.wait = 100/3;
    this.txt = txt;
    this.currLetter = 0;
    this.currLine = 0;

    this.container = document.createElement("div");
    this.container.className = "dialogueContainer";
    this.txtcontainer = document.createElement("div");
    this.txtcontainer.className = "dialogueTxtContainer";
    this.container.appendChild(this.txtcontainer);
    this.current_span = document.createElement("span");
    this.txtcontainer.appendChild(this.current_span);
    document.body.appendChild(this.container);

	this.timeout = setTimeout(function() {
        self._typeText();
    }, this.wait);
    //this._typeText();
	console.log(this);
}

TextLibrary.CreateText.prototype._typeText = function() {
	//console.log("TypeText: ", this);

    this.current_span.innerHTML += this.txt[this.currLine].charAt(this.currLetter);
    this.currLetter++;

    if (this.currLetter < this.txt[this.currLine].length) {
        //console.log("CurrentLetter: ", this.currLetter, " TextLength: ", this.txt[this.currLine].length);
        var self = this;
        this.timeout = setTimeout(function() {
            self._typeText();
        }, this.wait);
    }
};

TextLibrary.SetText = function() {

}