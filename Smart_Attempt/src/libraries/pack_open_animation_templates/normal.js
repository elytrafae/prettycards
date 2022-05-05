
import {PackOpenAnimationTemplate} from "./base.js";

class NormalPackOpenAnimationTemplate extends PackOpenAnimationTemplate {
	
	constructor() {
		super();
		this.displayName = "Default";
		this.description = "The default pack open animation. It is very much similar to the one in the previous version.";
		this.hasSkipButton = true;
	}
	
	onSkipButtonPressed(e) {
		$(".PrettyCards_AnimationPack").stop().remove();
		if (this.up) {
			this.up.remove();
			this.down.remove();
		}
		if (!this.cardsSpawned) {
			this.SpawnCards();
		}
		this.cancelGlideTimeouts();
		this.OnCardViewFinish();
	}
	
}

var NormalPackOpenAnimation = new NormalPackOpenAnimationTemplate();

export {NormalPackOpenAnimation};