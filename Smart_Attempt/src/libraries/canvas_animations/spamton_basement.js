
import {CanvasDrawer, BasicParallax} from "/src/libraries/basic_canvas.js";


class SpamtonCaveBG {
	
	constructor(canvas_drawer) {
		this.spamcave_image = canvas_drawer.register_image("https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/SpamtonNEOBasement/Spamcave.png");
		this.spamtown_back_image = canvas_drawer.register_image("https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/SpamtonNEOBasement/Spamtown_Back.png");
		this.spamtown_front_image = canvas_drawer.register_image("https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/SpamtonNEOBasement/Spamtown_Front.png");
		this.spamtracks_image = canvas_drawer.register_image("https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/SpamtonNEOBasement/Spamtracks.png");
		
		this.spamcave_parallax = new BasicParallax(this.spamcave_image);
		this.spamcave_parallax.xscale = 2;
		this.spamcave_parallax.yscale = 2;
		this.spamtown_back_parallax = new BasicParallax(this.spamtown_back_image);
		this.spamtown_back_parallax.xscale = 2;
		this.spamtown_back_parallax.yscale = 2;
		this.spamtown_front_parallax = new BasicParallax(this.spamtown_front_image);
		this.spamtown_front_parallax.xscale = 2;
		this.spamtown_front_parallax.yscale = 2;
		this.spamtracks_parallax1 = new BasicParallax(this.spamtracks_image);
		this.spamtracks_parallax1.xscale = 2;
		this.spamtracks_parallax1.yscale = 2;
		this.spamtracks_parallax1.y = 90;
		this.spamtracks_parallax2 = new BasicParallax(this.spamtracks_image);
		this.spamtracks_parallax2.xscale = 2;
		this.spamtracks_parallax2.yscale = 2;
		this.spamtracks_parallax2.y = 140;
		this.spamtracks_parallax3 = new BasicParallax(this.spamtracks_image);
		this.spamtracks_parallax3.xscale = 2;
		this.spamtracks_parallax3.yscale = 2;
		this.spamtracks_parallax3.y = 190;
	}
	
	onupdate(ctx, canvas_drawer) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas_drawer.canvas.width, canvas_drawer.canvas.height);
		
		this.spamcave_parallax.x -= 0.5;
		this.spamcave_parallax.onupdate(ctx, canvas_drawer);
		
		this.spamtown_back_parallax.x -= 0.7;
		this.spamtown_back_parallax.onupdate(ctx, canvas_drawer);
		
		this.spamtown_front_parallax.x -= 1.2;
		this.spamtown_front_parallax.onupdate(ctx, canvas_drawer);
		
		this.spamtracks_parallax1.x -= 4;
		this.spamtracks_parallax1.onupdate(ctx, canvas_drawer);
		
		this.spamtracks_parallax2.x -= 4;
		this.spamtracks_parallax2.onupdate(ctx, canvas_drawer);
		
		this.spamtracks_parallax3.x -= 4;
		this.spamtracks_parallax3.onupdate(ctx, canvas_drawer);
	}
	
}

export {SpamtonCaveBG};