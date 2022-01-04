
var global

class GigaQueenBG {
	
	constructor() {
		this.image = new Image();
		this.image.src = "https://github.com/CMD-God/prettycards/raw/master/img/Backgrounds/GigaQueen/bg_cityscape.png";
		this.image.style.display = "none";
		document.body.appendChild(this.image);
		console.log("GIGA BG: ", this);
	}
	
	onupdate(ctx, canvas_drawer) {
		
	}
	
}

export {GigaQueenBG};