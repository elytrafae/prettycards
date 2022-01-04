
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {CanvasDrawer} from "/src/libraries/basic_canvas.js";

import {GigaQueenBG} from "/src/libraries/canvas_animations/gigaqueen.js";
import {SpamtonCaveBG} from "/src/libraries/canvas_animations/spamton_basement.js";

var canvas

function CreateBackgroundCanvas() {
	canvas = document.createElement("CANVAS");
	canvas.style = "position: fixed; top: 0px; left: 0px; z-index: -1;";
	//canvas.style = "width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: -1;";
	//canvas.width = 2560;
	//canvas.height = 1920;
	canvas.width = 640;
	canvas.height = 480;
	document.body.prepend(canvas);
}

ExecuteWhen("PrettyCards:onPageLoad", function() {
	CreateBackgroundCanvas();

	// Test code only.
	var test = new CanvasDrawer(canvas);
	var gigaqueen = new GigaQueenBG(test);
	var spamcave = new SpamtonCaveBG(test);
	//test.onupdate = gigaqueen.onupdate.bind(gigaqueen);
	test.onupdate = spamcave.onupdate.bind(spamcave);
});