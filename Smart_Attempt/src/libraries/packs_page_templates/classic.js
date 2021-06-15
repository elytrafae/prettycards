
import {PacksPageTemplate} from "./base.js";

class ClassicPacksTemplate extends PacksPageTemplate {
	
	static displayName() {
		return "Classic";
	}
	
	static description() {
		return "For people who liked the old design. WIP, low priority.";
	}
	
	static pageAdditions() { // Required
		return `
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
	
export {ClassicPacksTemplate};