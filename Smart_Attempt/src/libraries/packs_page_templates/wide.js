
import {PacksPageTemplate} from "./base.js";

class WidePacksTemplate extends PacksPageTemplate {
	
	// The rest is the default functions :P
	
	static displayName() {
		return "Wide";
	}
	
	static description() {
		return "Probably the closest to how I envisioned the page.";
	}
	
	static pageAdditions() { // Required
		return `
			<div class="PrettyCards_ThirdPackSpacer"></div>
			<div class="PrettyCards_PacksRow PrettyCards_WideTemplate">
				<div class="PrettyCards_PackCell" data-packid="Pack"></div>
				<div class="PrettyCards_PackCell" data-packid="DRPack"></div>
				<div class="PrettyCards_PackCell" data-packid="ShinyPack"></div>
				<div class="PrettyCards_PackCell" data-packid="SuperPack"></div>
				<div class="PrettyCards_PackCell" data-packid="FinalPack"></div>
			</div>
			<div class="PrettyCards_PackSpacer"></div>
		`;
	}
	
}
	
export {WidePacksTemplate};