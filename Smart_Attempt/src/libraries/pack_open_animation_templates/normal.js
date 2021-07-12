
import {PackOpenAnimationTemplate} from "./base.js";

class NormalPackOpenAnimationTemplate extends PackOpenAnimationTemplate {
	
	constructor() {
		super();
		this.displayName = "Default";
		this.description = "The default pack open animation. It is very much similar to the one in the previous version.";
	}
	
	
	
}

var NormalPackOpenAnimation = new NormalPackOpenAnimationTemplate();

export {NormalPackOpenAnimation};