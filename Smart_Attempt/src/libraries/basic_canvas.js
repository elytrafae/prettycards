
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var image_container = document.createElement("DIV");
image_container.style.display = "none";

ExecuteWhen("PrettyCards:onPageLoad", function() {
	document.body.appendChild(image_container);
});

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
	
	register_image(link) {
		var image = new Image();
		image.src = link;
		//image.style.display = "none";
		image_container.appendChild(image);
		return image
	}
}

class BasicParallax {
	
	constructor(image) {
		this.image = image;
		this.image.style.display = "none";
		document.body.appendChild(this.image);
		this.x = 0;
		this.y = 0;
		this.xscale = 1;
		this.yscale = 1;
	}
	
	onupdate(ctx, canvas_drawer) {
		ctx.save();
		if (this.image.width <= 0) {
			return;
		}
		ctx.scale(this.xscale, this.yscale);
		var canvas = canvas_drawer.canvas;
		var current_x = this.x;
		while (current_x < canvas.width*canvas_drawer.scale/this.xscale) {
			ctx.drawImage(this.image, current_x, this.y);
			current_x += this.image.width;
		}
		if (this.x <= -this.image.width) {
			this.x += this.image.width;
		}
		ctx.restore();
	}
	
}

export {CanvasDrawer, BasicParallax};