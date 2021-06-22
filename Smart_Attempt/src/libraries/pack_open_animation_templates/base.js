
import $ from "/src/third_party/jquery-3.6.0.min.js";
//import $ from "/src/third_party/jquery-2.2.4.min.js";

class PackOpenAnimationTemplate {
	
	constructor() {
		this.clicks_to_break = 5;
		this.current_click = 0;
		this.pack_data;
		this.displayName = "Base";
		this.description = "You shouldn't be able to see this!";
	} 
	
	OnPackMoveBegin(moveto_x, moveto_y, pack_data) {
		//console.log("Animation Begins!");
		this.pack_data = pack_data;
		this.current_click = 0;
		$("#PrettyCards_PackOpenContent").css("display", "block");
		
		$("#PrettyCards_PackOpenContent").css("backgroundColor", 'rgba(0,0,0,0)');
		window.$("#PrettyCards_PackOpenContent").animate({backgroundColor: 'rgba(0,0,0,1)'}, 1000, "swing", function() {}); // This is because the page has Jquery UI installed, something I am personally too lazy to do :P
		
		$(".PrettyCards_AnimationPack").animate({top: (moveto_y + "px"), left: (moveto_x + "px")}, 1000, "swing", this.OnPackMoveFinish.bind(this));
	}
	
	OnPackMoveFinish() {
		console.log("Pack Move Animation Finished.");
		$(".PrettyCards_AnimationPack").addClass("PrettyCards_Floating");
		$("#PrettyCards_PackOpenContent").click(this.OnBeforeBreakClick.bind(this));
	}
	
	OnBeforeBreakClick() {
		this.current_click++;
		if (this.current_click >= this.clicks_to_break) {
			$("#PrettyCards_PackOpenContent").unbind("click");
			this.OnPackBreakBegin();
		} else {
			$(".PrettyCards_AnimationPack").removeClass("PrettyCards_Floating");
			window.$(".PrettyCards_AnimationPack").effect("shake");
		}
	}
	
	OnPackBreakBegin() {
		console.log("Pack finally broke!");
	}
	
	RipPackHorizontally() {
		//$("#PrettyCards_PackOpenContent").append("<img src=\""+  +"\">")
	}
	
}

export {PackOpenAnimationTemplate};