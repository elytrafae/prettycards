

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
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		this.ctx.scale(this.scale, this.scale);
		this.onupdate(this.ctx, this);
		this.ctx.restore();
		window.requestAnimationFrame(this._update.bind(this));
	}
	
	draw_image_part(image, left, top, width, height, x, y, xscale, yscale, color = [255, 255, 255], alpha = 1) {
		this.ctx.save();
		this.ctx.scale(xscale, yscale);
		this.ctx.rotate(Math.PI / 2); // This is deffinitely not hacky. Nonono.
		//this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
		this.ctx.globalAlpha = alpha;
		this.ctx.drawImage(image, left, top, width, height, x, y, image.width/xscale, image.height/yscale);
		this.ctx.restore();
	}
}

class BasicParallax {
	
	constructor(image) {
		this.image = image;
		this.image.style.display = "none";
		document.body.appendChild(this.image);
		this.x = 0;
		this.y = 0;
	}
	
	onupdate(ctx, canvas_drawer) {
		var canvas = canvas_drawer.canvas;
		var current_x = this.x;
		while (current_x < canvas.width*canvas_drawer.scale) {
			ctx.drawImage(this.image, current_x, this.y);
			current_x += this.image.width;
		}
	}
	
}

export {CanvasDrawer, BasicParallax};