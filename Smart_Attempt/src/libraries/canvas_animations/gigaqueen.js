
var global

class GigaQueenBG {
	
	constructor() {
		this.siner = 500;
		this.rectsiner = 0;
		this.f = 2;
		this.bg_speed = 1;
		this.depth = 1000;
		this.mysurface = -999;
		this.oldlen = 0;
				
		this.image = new Image();
		this.image.src = "https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/GigaQueen/bg_cityscape.png";
		this.image.style.display = "none";
		document.body.appendChild(this.image);
		console.log("GIGA BG: ", this);
	}
	
	onupdate(ctx, canvas_drawer) {
		// https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/GigaQueen/bg_cityscape.png
		if (this.depth == 1000) {
			this.mysurface = -999
			this.depth = 998
		}
		this.rectsiner += (this.bg_speed * this.f)
		if (this.bg_speed < 0.8) {
			this.bg_speed += 0.03
		}
		/*
		if (rectsiner >= 20) {
			var b = instance_create(0, 115, obj_bg_square)
			b.depth = (depth + 1)
			rectsiner = 0
		}
		*/
		this.bg_speed = 0.7
		this.siner += (this.bg_speed * this.f)
		if (this.siner >= 1000) {
			this.siner -= 500;
		}
		//if (!surface_exists(mysurface))
		//	mysurface = surface_create(320, 480)
		//surface_set_target(mysurface)
		var remleft = this.siner
		var oldlen = 0
		for (var i = 45; i < 144; i++) {
			if (i == 0) {
				oldlen = 2;
			}
			var len = (i - ((i * i) / 48));
			var width = (Math.abs((oldlen - len)) / 2);
			remleft -= width;
			var left = remleft;
			var top = 0;
			var height = 142;
			var x = (275 + len);
			var y = (((i / 16) - ((i * i) / 100)) + 120);
			var xscale = 2;
			var yscale = ((0.9 * ((i * i) * i)) / 819200);
			var alpha = 0.8;
			//draw_background_part_ext(bg_cityscape, remleft, 0, width, 142, (275 + len), (((i / 16) - ((i * i) / 100)) + 120), 2, ((0.9 * ((i * i) * i)) / 819200), c_white, 0.8);
			canvas_drawer.draw_image_part(this.image, left, top, width, height, x, y, xscale, yscale, [255, 255, 255], alpha);
			oldlen = len;
			if (i > 90) {
				i -= 0.5
			}
		}
		//surface_reset_target()
		//draw_surface_ext(mysurface, 0, 0, 1, 1, 0, c_white, 1)
		//draw_surface_ext(mysurface, 640, 0, -1, 1, 0, c_white, 1)
		//draw_background_part_ext(bg_cityscape, siner, 0, 20, 142, (100 - siner), (50 + siner), 2, 2, c_white, 1)
		canvas_drawer.draw_image_part(this.image, this.siner, 0, 20, 142, (100-this.siner), (50+this.siner), 2, 2, [255, 255, 255], 1);
		//console.log("THIS RUNS!");
	}
	
}

export {GigaQueenBG};