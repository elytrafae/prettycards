
GM_addStyle(".dialogueContainer {position: absolute; bottom: 3em; min-width: 20em; max-width: 100em; width: 60%; left: 20%; padding-top: 14%; background-color: black; border: 5px solid white; z-index: 200;}");
GM_addStyle(".dialogueTxtContainer {position: absolute; top: 0; left: 0; bottom: 0; right: 0; padding: 0.5em; font-size: 2.5em; color: white;}");

var TextLibrary = {};

TextLibrary.CreateText = function(txt) {
    var self = this;
	this.wait = 100/3;
    this.spd = 1;
    this.w = 0;
    this.txt = txt;
    this.currLetter = 0;
    this.currLine = 0;
    this.isactive = true;

    this.container = document.createElement("div");
    this.container.className = "dialogueContainer";
    this.container.addEventListener("click", function() {self._handleClick();});
    this.container.tabIndex = 0;
    this.container.addEventListener("keydown", function(event) {self._handleKeyDown(event)});
    this.txtcontainer = document.createElement("div");
    this.txtcontainer.className = "dialogueTxtContainer";
    this.container.appendChild(this.txtcontainer);
    //this.current_span = document.createElement("span");
    //this.txtcontainer.appendChild(this.current_span);
    this._newSpan();
    document.body.appendChild(this.container);
    this.container.focus();

	this._createTimeout();
    //this._typeText();
	//console.log(this);
}

TextLibrary.CreateText.prototype.CheckLineGo = function() {
    return (this.currLetter < this.txt[this.currLine].length);
}

TextLibrary.CreateText.prototype.CheckTextGo = function() {
    return this.currLine < this.txt.length;
}

TextLibrary.CreateText.prototype.Remove = function() {
    clearTimeout(this.timeout);
    this.container.remove();
    this.isactive = false;
}

TextLibrary.CreateText.prototype._typeText = function(makeTimeout) {
	//console.log("TypeText: ", this);
    var i = 0;
    var line = this.currLine;
    while ((i < this.spd) && this.CheckLineGo()) {
        this.w = 0;
        if (this.txt[this.currLine].charAt(this.currLetter) != "[") {
            this.current_span.innerHTML += this.txt[this.currLine].charAt(this.currLetter);
        } else {
            this._handleTextCommand();
        }
        if (line == this.currLine) {this.currLetter++};
        i++;
    }

    if (this.CheckLineGo() && makeTimeout) {
        //console.log("CurrentLetter: ", this.currLetter, " TextLength: ", this.txt[this.currLine].length);
        this._createTimeout(this.w);
    }
};

TextLibrary.CreateText.prototype._handleTextCommand = function() {
    var c = this.txt[this.currLine].indexOf("]", this.currLetter);
    var scr = this.txt[this.currLine].slice(this.currLetter+1, c);
	var dd = scr.indexOf(":");
    this.currLetter = c;
	if (dd === -1) {
        console.log("CMD: ", scr, " ARG: null");
		this._TextCommands[scr](this);
	} else {
		var cmd = scr.slice(0, dd);
		var arg = scr.slice(dd+1, scr.length);
		console.log("CMD: ", cmd, " ARG: ", arg);
        this._TextCommands[cmd](this, arg);
	}
    //console.log(scr);
}

TextLibrary.CreateText.prototype._handleClick = function() {
    if (this.CheckLineGo()) {
        this._skip();
    } else {
        //console.log("End of line!");
        this._nextLine();
    }
};

TextLibrary.CreateText.prototype._handleKeyDown = function(event) {
    //console.log(this , " keyDown! ::", event);
    //console.log("LineGo: ", this.CheckLineGo());
    if (((event.key == "Shift") || (event.key == "x")) && this.CheckLineGo()) {
        this._skip();
    } else if (((event.key == "Enter") || (event.key == "z")) && !this.CheckLineGo()) {
        this._nextLine();
    }
};

TextLibrary.CreateText.prototype._newSpan = function() {
    this.current_span = document.createElement("span");
    this.txtcontainer.appendChild(this.current_span);
}

TextLibrary.CreateText.prototype._skip = function() {
    //console.log(this , " clicked!");
    clearTimeout(this.timeout);
    while (this.CheckLineGo()) {
        this._typeText(false);
    }
};

TextLibrary.CreateText.prototype._nextLine = function() {
    this.currLetter = 0;
    this.currLine++;
    //console.log("this = ", this);
    if (this.CheckTextGo()) {
        this.txtcontainer.innerHTML = "";
        this._newSpan();
        this._createTimeout();
    } else {
        this.Remove();
    }
};

TextLibrary.CreateText.prototype._createTimeout = function(plus_wait) {
    var w = plus_wait || 0;
    var self = this;
    this.timeout = setTimeout(function() {
        self._typeText(true);
    }, (this.wait + w));
}

TextLibrary.CreateText.prototype._TextCommands = {}

TextLibrary.CreateText.prototype._TextCommands.color = function(txt, arg) {
    if (txt.current_span.innerHTML.length > 0) {
        var style = txt.current_span.style;
        txt._newSpan();
        txt.current_span.style = style;
    }
    if (arg == "rainbow") {
        txt.current_span.style.color = null;
        txt.current_span.className = txt.current_span.className += " rainbowText"
    } else {
        txt.current_span.style.color = arg;
    }
}

TextLibrary.CreateText.prototype._TextCommands.font = function(txt, arg) {
    if (txt.current_span.innerHTML.length > 0) {
        var style = txt.current_span.style;
        txt._newSpan();
        txt.current_span.style = style;
    }
    txt.current_span.style["font-family"] = arg;
}

TextLibrary.CreateText.prototype._TextCommands.size = function(txt, arg) {
    if (txt.current_span.innerHTML.length > 0) {
        var style = txt.current_span.style;
        txt._newSpan();
        txt.current_span.style = style;
    }
    txt.current_span.style["font-size"] = arg;
}

TextLibrary.CreateText.prototype._TextCommands.waitall = function(txt, arg) {
    txt.wait = arg;
}

TextLibrary.CreateText.prototype._TextCommands.speed = function(txt, arg) {
    txt.spd = arg;
}

TextLibrary.CreateText.prototype._TextCommands.w = function(txt, arg) {
    txt.w = arg;
}

TextLibrary.CreateText.prototype._TextCommands.instant = function(txt) {
    txt.currLetter++;
    txt._skip();
}

TextLibrary.CreateText.prototype._TextCommands.next = function(txt) {
    txt._nextLine();
}

TextLibrary.CreateText.prototype._TextCommands.letter = function(txt, arg) {
    for (var i=0; i < arg; i++) {
        txt._typeText();
    }
}

TextLibrary.SetText = function() {

}