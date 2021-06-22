
import {PackOpenAnimationTemplate} from "./base.js";

class NormalPackOpenAnimationTemplate extends PackOpenAnimationTemplate {
	
	constructor() {
		super();
		this.displayName = "Normal";
		this.description = "The default pack open animation.";
	}
	
}

var NormalPackOpenAnimation = new NormalPackOpenAnimationTemplate();

export {NormalPackOpenAnimation};