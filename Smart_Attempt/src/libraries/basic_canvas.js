
class CanvasDrawer {
	
	constructor(ele) {
		this.canvas = ele;
		if (typeof(ele) == "string") {
			this.canvas = document.querySelector(ele);
		}
		this.ctx = this.canvas.getContext("2d");
		this.onupdate = function() {};
		this.scale = 0;
		this.removed = false;
		window.requestAnimationFrame(this._update.bind(this));
	}
	
	remove() {
		this.removed = true;
	}
	
	_update() {
		if (this.removed) {return;}
		
		this.ctx.save();
		//this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.scale = window.innerHeight/480;
		//this.ctx.scale(this.scale, this.scale);
		this.onupdate(this.ctx);
		this.ctx.restore();
		window.requestAnimationFrame(this._update.bind(this));
	}
	
}

export {CanvasDrawer};