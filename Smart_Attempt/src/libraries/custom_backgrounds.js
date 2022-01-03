
import {CanvasDrawer} from "/src/libraries/basic_canvas.js";

var canvas

function CreateBackgroundCanvas() {
	canvas = document.createElement("CANVAS");
	canvas.style = "width: 100%; height: 100%; position: fixed; top: 0px; left: 0px;";
	canvas.width = 2560;
	canvas.height = 1920;
	document.body.prepend(canvas);
}

CreateBackgroundCanvas();

// Test code only.
var test = new CanvasDrawer(canvas);
test.onupdate = function(ctx) {
	ctx.fillStyle = "#ffffff";
	ctx.font = "100px Sans-serif";
	ctx.fillText("Hello world! " + test.scale + " || " + test.canvas.height, 400, 300);
}

