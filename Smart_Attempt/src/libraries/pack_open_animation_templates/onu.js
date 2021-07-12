
import {PackOpenAnimationTemplate} from "./base.js";
import {FlippableCard} from "/src/libraries/flippable_card.js";

class OnuPackOpenAnimationTemplate extends PackOpenAnimationTemplate {
	
	constructor() {
		super();
		this.displayName = "Onu";
		this.description = "For those who like clicking the cards themselves, but still think the original pack opening is a chore.";
	}
	
	OnPackBreakFinish() {
		console.log("BreakAnimationFinished!");
		this.up.remove();
		this.down.remove();
		
		this.cards_finished_gliding = 0;
		const time_between_glides = 1500 / this.flipCards.length;
		const glide_callback = this.OnCardFinishedGliding.bind(this);
		for (var i=0; i < this.flipCards.length; i++) {
			const flipcard = this.flipCards[i];
			setTimeout(function() {flipcard.glideTo(window.innerWidth/2, window.innerHeight + 600, 500, glide_callback)}, (i+1)*time_between_glides);
		}
	}
	
	OnFinishedGliding() {
		$("#PrettyCards_PackOpenContent").click(this.OnNextCard.bind(this));
		this.OnCardViewFinish();
		for (var i=0; i < this.flipCards.length; i++) {
			const flipcard = this.flipCards[i];
			flipcard.flipToBack(0);
			$(flipcard.container).click(function() {
				flipcard.flipToFace(500);
				$(flipcard.container).unbind("click");
			})
		}
	}
	
	SpawnCards() {
		for (var i=this.cards.length-1; i >= 0; i--) {
			var flipcard = new FlippableCard(this.cards[i], true);
			flipcard.appendTo(document.getElementById("PrettyCards_PackOpenContent"));
			flipcard.moveTo(window.innerWidth/2, window.innerHeight/2);
			this.flipCards.unshift(flipcard);
		}
		//console.log("flipCards initialized! ", this.flipCards);
	}
	
}

var OnuPackOpenAnimation = new OnuPackOpenAnimationTemplate();

export {OnuPackOpenAnimation};