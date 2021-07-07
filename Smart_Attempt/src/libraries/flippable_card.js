
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {SetCosmeticsForCardData} from "./card_cosmetics_manager.js";

class FlippableCard {
	
	constructor(card_data, hoverable) {
		this.baseScale = 1;
		this.container = document.createElement("DIV");
		this.container.className = "PrettyCards_FlippableCardContainer";
		
		this.flipContainer = document.createElement("DIV");
		this.flipContainer.className = "PrettyCards_FlipContainer";
		this.flipContainer.style = "transform: rotateY(180deg);";
		this.container.appendChild(this.flipContainer);
		
		card_data = SetCosmeticsForCardData(card_data);
		window.appendCard(card_data, $(this.flipContainer));
		this.front = this.flipContainer.children[0];
		console.log("Flip container: ", this.flipContainer);
		this.front.className += " PrettyCards_CardFront";
		
		this.back = document.createElement("DIV");
		this.back.className = "PrettyCards_CardBack " + card_data.rarity + " " + card_data.extension + (hoverable ? " PrettyCards_CardBackHoverable" : "");
		this.flipContainer.appendChild(this.back);
		
		console.log("Flippable Card initialized!", this);
	}
	
	appendTo(element) {
		element.appendChild(this.container);
	}
	
	moveTo(x, y) {
		this.container.style.top = y + "px";
		this.container.style.left = x + "px";
	}
	
	setBaseScale(scale) {
		this.container.style.transform = "scale(" + scale + ")";
	}
	
	glideTo(x, y, duration) {
		$(this.container).animate({top: y + "px", left: x + "px"}, {
			duration: (duration || 1000), 
			easing: "swing"
		});
	}
	
	flipToFace(duration) {
		this.flipContainer.style["transition-duration"] = (duration/1000) + "s";
		$(this.container).css("transform", "rotateY(0deg)");
	}
	
	flipToBack(duration) {
		this.flipContainer.style["transition-duration"] = (duration/1000) + "s";
		$(this.flipContainer).css("transform", "rotateY(180deg)");
	}
	
	scaleTo(scale, duration) {
		this.container.style["transition-duration"] = (duration/1000) + "s";
		this.container.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
	}
	
}

export {FlippableCard};