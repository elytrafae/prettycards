
import {PacksPageTemplate} from "./base.js";

class NormalPacksTemplate extends PacksPageTemplate {
	
	// The rest is the default functions :P
	
	constructor() {
		super();
		this.displayName = "Normal";
		this.description = "The default theme. Looks quite ugly.";
	}
	
}

var NormalPacksPage = new NormalPacksTemplate();

export {NormalPacksPage};