
import {pagegetters} from "./../../libraries/page_getters.js";

// This is the parent class.

class PacksPageTemplate {
	
	static displayName() { // Required
		return "Base";
	}
	
	static description() { // Required
		return "This should not be visible!";
	}
	
	static pageAdditions() { // Required
		return `
			<div class="PrettyCards_PacksRow">
				<div class="PrettyCards_PackCell" data-packid="Pack"></div>
				<div class="PrettyCards_PackCell" data-packid="DRPack"></div>
			</div>
			<div class="PrettyCards_PackSpacer"></div>
			<div class="PrettyCards_PacksRow">
				<div class="PrettyCards_PackCell" data-packid="ShinyPack"></div>
				<div class="PrettyCards_PackCell" data-packid="SuperPack"></div>
				<div class="PrettyCards_PackCell" data-packid="FinalPack"></div>
			</div>
			<div class="PrettyCards_PackSpacer"></div>
		`;
	}
	
	static generateBuyRow(pack_data) { // Required?
		return `
			<input type="number" class="PrettyCards_PackBuyCount" data-packid="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
			x <button class="PrettyCards_PackGBuy btn-primary" data-packid="${pack_data.code_id}">Buy (<span class="PrettyCards_PackGPrice" data-packid="${pack_data.code_id}">100</span> <img src="images/icons/gold.png" class="height-16">)</button>
			<button class="PrettyCards_PackUcpBuy btn-primary" data-packid="${pack_data.code_id}">Buy (<span class="ucp PrettyCards_PackUcpPrice" data-packid="${pack_data.code_id}">10</span> UCP)</button>
		`;
	}
	
	static generateOpenRow(pack_data) { // Required?
		return `
			<input type="number" class="PrettyCards_PackOpenCount" data-packid="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
			x <button class="PrettyCards_PackOpen btn-primary" data-packid="${pack_data.code_id}">Open <span class="PrettyCards_PackOpenCountButton" data-packid="${pack_data.code_id}">1</span></button>
		`;
	}
	
	static generatePack(pack_data) { // Required
		var buystr = (pack_data.does_exist && (pack_data.g_cost > -1)) ? this.generateBuyRow(pack_data) : "This pack cannot be bought.";
		var openstr = pack_data.does_exist ? this.generateOpenRow(pack_data) : "This pack cannot be opened.";
		return `
		<div class="PrettyCards_PackContainer">
			<div class="PrettyCards_FloatingPack">
				<div class="PrettyCards_FloatingPackImage" style="background-image: url(${pack_data.image})">
					<img src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png" class="PrettyCards_InvisiblePack">
					<div class="PrettyCards_PackAmount">${pack_data.amount}</div>
				</div>
			</div>
			<div class="PrettyCards_PackText">
				<div class="PrettyCards_PackName">${pack_data.name}</div>
				<div class="PrettyCards_PackDescription">${pack_data.description}</div>
				<div class="PrettyCards_PackBuy">${buystr}</div>
				<div class="PrettyCards_PackOpen">${openstr}</div>
			</div>
		</div>
		`;
	}
	
	static sanitizeNumberInput(input) {
		var val = input.value || "1";
		val = val.replace("-", "");
		val = val.replace(",", "");
		val = val.replace(".", "");
		input.value = val;
	}

	static changePrices(code_id, count) {
		count = Number(count);
		//console.log(count, code_id);
		if (count == NaN) {
			return;
		}
		var data = packs_data2[code_id];
		document.querySelector(".PrettyCards_PackGPrice[data-packid="+ code_id +"]").innerHTML = Math.min(count * data.g_cost, Math.floor(pagegetters.gold/data.g_cost)*data.g_cost);
		document.querySelector(".PrettyCards_PackUcpPrice[data-packid="+ code_id +"]").innerHTML = Math.min(count * data.ucp_cost, Math.floor(pagegetters.ucp/data.ucp_cost)*data.ucp_cost);
	}

	static changePackCountButton(code_id, count) {
		count = Number(count);
		//console.log(count, code_id);
		if (count == NaN) {
			return;
		}
		var data = packs_data2[code_id];
		document.querySelector(".PrettyCards_PackOpenCountButton[data-packid="+ code_id +"]").innerHTML = Math.min(count, 50);
	}
	
	static onPackMouseOver(e) {
		//debugger;
		var code_id = e.currentTarget.getAttribute("data-packid");
		if (!code_id) {console.log("Mouse Over Return", e);return;}
		//console.log("Mouse Over", e, code_id);
		$(".PrettyCards_PackCell[data-packid="+ code_id +"] .PrettyCards_PackText").stop().slideDown( 250, function() {});
	}
	
	static onPackMouseLeave(e) {
		var code_id = e.currentTarget.getAttribute("data-packid");
		if (!code_id) {console.log("Mouse Leave Return", e);return;}
		//console.log("Mouse Leave", e, code_id);
		$(".PrettyCards_PackCell[data-packid="+ code_id +"] .PrettyCards_PackText").stop().slideUp( 250, function() {});
	}
	
	static onPackOpenCountChange(e) {
		this.sanitizeNumberInput(e.target);
		this.changePackCountButton(e.target.getAttribute("data-packid"), e.target.value);
	}
	
	static onPackBuyCountChange(e) {
		this.sanitizeNumberInput(e.target);
		this.changePrices(e.target.getAttribute("data-packid"), e.target.value);
	}
	
	static onPackGeneration(data, pack_cell) { // Optional, but has default behaviour.
		pack_cell.addEventListener( "mouseover", this.onPackMouseOver);
		pack_cell.addEventListener( "mouseleave", this.onPackMouseLeave);
		$(".PrettyCards_PackCell[data-packid="+ data.code_id +"] .PrettyCards_PackText").slideUp(0);
		$(".PrettyCards_PackCell[data-packid="+ data.code_id +"] .PrettyCards_FloatingPackImage").css("animation-delay", (Math.random()*1.5) + "s");
		if (data.does_exist) {
			document.querySelector(".PrettyCards_PackOpenCount[data-packid="+ data.code_id +"]").onchange = this.onPackOpenCountChange;
			if (data.g_cost > -1) {
			document.querySelector(".PrettyCards_PackBuyCount[data-packid="+ data.code_id +"]").onchange = this.onPackBuyCountChange;
			}
		}
	}
	
	static generatePagePack(data) { // Required. It's used in generatePage and ran for every individual pack. This function should be responsible for adding them.
		var txt = this.generatePack(data);
		var pack_cell = document.querySelector(".PrettyCards_PackCell[data-packid="+ data.code_id +"]");
		pack_cell.innerHTML = txt;
		
		this.onPackGeneration(data, pack_cell);
	}
	
	static generatePage(packs_data) { // Required
		
		document.getElementById("PrettyCards_MainContent").innerHTML =  this.pageAdditions();
				
		for (var i=0; i < packs_data.length; i++) {
			this.generatePagePack(packs_data[i]);
		}
	}
	
}

export {PacksPageTemplate};