
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {utility} from "/src/libraries/utility.js";
import {FlippableCard} from "/src/libraries/flippable_card.js";
//import $ from "/src/third_party/jquery-2.2.4.min.js";

class PackOpenAnimationTemplate {
	
	constructor() {
		this.clicks_to_break = 1;
		this.current_click = 0;
		this.pack_data;
		this.cards;
		this.displayName = "Base";
		this.description = "You shouldn't be able to see this!";
	}
	
	// Events
	OnPackMoveBegin(moveto_x, moveto_y, pack_data, cards) {
		//console.log("Animation Begins!");
		this.pack_data = pack_data;
		this.cards = cards;
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
		this.SpawnCards();
		
		var parts = this.RipPackHorizontally();
		this.up = parts[0];
		this.down = parts[1];
		
		$(this.up).animate({top: "-=30%", opacity: "0"}, 800, "swing");
		$(this.down).animate({top: "+=30%", opacity: "0"}, 800, "swing", this.OnPackBreakFinish.bind(this));
	}
	
	OnPackBreakFinish() {
		console.log("BreakAnimationFinished!");
		this.up.remove();
		this.down.remove();
	}
	
	
	// Utility Functions
	RipPackHorizontally() {
		var up = document.createElement("IMG");
		up.className = "PrettyCards_RippedPack_Up";
		up.src = this.pack_data.image_without_extension + "_HorizontalRip_Top" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], up);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(up);
		
		var down = document.createElement("IMG");
		down.className = "PrettyCards_RippedPack_Down";
		down.src = this.pack_data.image_without_extension + "_HorizontalRip_Bottom" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], down);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(down);
		
		$(".PrettyCards_AnimationPack").css("opacity", 0);
		
		return [up, down];
	}
	
	RipPackVertically() {
		var left = document.createElement("IMG");
		left.className = "PrettyCards_RippedPack_Left";
		left.src = this.pack_data.image_without_extension + "_VerticalRip_Left" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], left);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(left);
		
		var right = document.createElement("IMG");
		right.className = "PrettyCards_RippedPack_Right";
		right.src = this.pack_data.image_without_extension + "_VerticalRip_Right" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], right);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(right);
		
		$(".PrettyCards_AnimationPack").css("opacity", 0);
		
		return [left, right];
	}
	
	SpawnCards() {
		// TODO finish this.
		for (var i=0; i < this.cards.length; i++) {
			var flipcard = new FlippableCard(this.cards[i], false);
			flipcard.appendTo(document.getElementById("PrettyCards_PackOpenContent"));
			flipcard.moveTo(window.innerWidth/2, window.innerHeight/2);
			//flipcard.scaleTo(2, 2000);
		}
		//var flipcard = new FlippableCard(window.getCardWithName("Librarian"), false);
		//flipcard.appendTo(document.getElementById("PrettyCards_PackOpenContent"));
		//flipcard.glideTo(1000, 600, 1000);
		//flipcard.scaleTo(2, 2000);
		//flipcard.flipToFront(1000);
	}
	
	
	
}

export {PackOpenAnimationTemplate};