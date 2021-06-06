
var CutsceneAnimations = {};

function CutsceneAnimation(name, isleft) {
	this.name = name;
	this.animations = {};
	this.canvas = document.createElement("canvas");
	this.canvas.id = name + "_" + (isleft ? "left" : "right") + "_cutscene_canvas";
	this.canvas_controller = new fabric.StaticCanvas(this.canvas.id, {
		backgroundColor: 'rgb(177,013,420, 0)',
		width: 600,
		height: 700
	});
	staticCanvas.onFpsUpdate = this.Update;
	
	CutsceneAnimations[name] = this;
};

CutsceneAnimation.prototype.AddAnimation = function(name, start_func, update_func, end_func) {
	var anim = {};
	anim.name = name;
	anim.start = start_func;
	anim.update = update_func;
	anim.end = end_func;
	this.animations[name] = anim;
}