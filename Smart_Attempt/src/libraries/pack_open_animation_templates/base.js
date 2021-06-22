
import $ from "/src/third_party/jquery-3.6.0.min.js";
//import $ from "/src/third_party/jquery-2.2.4.min.js";

class PackOpenAnimationTemplate {
	
	constructor(pack_img) {
		this.pack_img = pack_img;
		this.displayName = "Base";
		this.description = "You shouldn't be able to see this!";
	} 
	
	OnPackMoveBegin(moveto_x, moveto_y) {
		console.log("Animation Begins!");
		$("#PrettyCards_PackOpenContent").css("display", "block");
		
		//$(".PrettyCards_AnimationPack").animate({top: (moveto_y + "px"), left: (moveto_x + "px")}, 1000, "swing", this.OnPackMoveFinish);
		
		$("#PrettyCards_PackOpenContent").css("backgroundColor", 'rgba(0,0,0,0)');
		$("#PrettyCards_PackOpenContent").animate({backgroundColor: 'rgba(0,0,0,1)'}, 1000, "swing", function() {});
	}
	
	OnPackMoveFinish() {
		console.log("Pack Move Animation Finished.");
	}
	
}

export {PackOpenAnimationTemplate};