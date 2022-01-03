
import {CanvasDrawer} from "/src/libraries/basic_canvas.js";

import {GigaQueenBG} from "/src/libraries/canvas_animations/gigaqueen.js";

var canvas

function CreateBackgroundCanvas() {
	canvas = document.createElement("CANVAS");
	canvas.style = "width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: -1;";
	//canvas.width = 2560;
	//canvas.height = 1920;
	canvas.width = 640;
	canvas.height = 480;
	document.body.prepend(canvas);
}

CreateBackgroundCanvas();

// Test code only.
var test = new CanvasDrawer(canvas);
var gigaqueen = new GigaQueenBG();
//test.onupdate = gigaqueen.onupdate.bind(gigaqueen);
