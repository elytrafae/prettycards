
import {pagegetters} from "./../../libraries/page_getters.js";

// This is the parent class.

class PacksPageTemplate {
	
	constructor() {
		this.displayName = "Base";
		this.description = "This should not be visible!";
		this.packs_data2 = {};
	}
	
	pageAdditions() { // Required
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
	
	generateBuyRow(pack_data) { // Required?
		return `
			<input type="number" class="PrettyCards_PackBuyCount" data-packid="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
			x <button class="PrettyCards_PackGBuy btn-primary" data-packid="${pack_data.code_id}">${window.$.i18n("pc-packs-buy")} (<span class="PrettyCards_PackGPrice" data-packid="${pack_data.code_id}">100</span> <img src="images/icons/gold.png" class="height-16">)</button>
			<button class="PrettyCards_PackUcpBuy btn-primary" data-packid="${pack_data.code_id}">${window.$.i18n("pc-packs-buy")} (<span class="ucp PrettyCards_PackUcpPrice" data-packid="${pack_data.code_id}">10</span> UCP)</button>
		`;
	}
	
	generateOpenRow(pack_data) { // Required?
		return `
			<input type="number" class="PrettyCards_PackOpenCount" data-packid="${pack_data.code_id}" value="1" min="1" pattern="[0-9]">
			x <button class="PrettyCards_PackOpen btn-primary" data-packid="${pack_data.code_id}">${window.$.i18n("pc-packs-open")} <span class="PrettyCards_PackOpenCountButton" data-packid="${pack_data.code_id}">1</span></button>
		`;
	}
	
	generatePack(pack_data) { // Required
		var buystr = (pack_data.does_exist && (pack_data.g_cost > -1)) ? this.generateBuyRow(pack_data) : window.$.i18n("pc-packs-cannotbuy");
		var openstr = pack_data.does_exist ? this.generateOpenRow(pack_data) : window.$.i18n("pc-packs-cannotopen");
		return `
		<div class="PrettyCards_PackContainer">
			<div class="PrettyCards_FloatingPack">
				<div class="PrettyCards_FloatingPackImage" style="background-image: url(${pack_data.image})">
					<img src="https://raw.githubusercontent.com/elytrafae/prettycards/master/img/Packs/UndertalePack.png" class="PrettyCards_InvisiblePack">
					<div class="PrettyCards_PackAmount">${pack_data.amount}</div>
				</div>
			</div>
			<div class="PrettyCards_PackText">
				<div class="PrettyCards_PackName">${window.$.i18n(pack_data.name)}</div>
				<div class="PrettyCards_PackDescription">${window.$.i18n(pack_data.description)}</div>
				<div class="PrettyCards_PackBuy">${buystr}</div>
				<div class="PrettyCards_PackOpen">${openstr}</div>
			</div>
		</div>
		`;
	}
	
	sanitizeNumberInput(input) {
		var val = input.value || "1";
		val = val.replace("-", "");
		val = val.replace(",", "");
		val = val.replace(".", "");
		input.value = val;
	}
	
	changePrices(code_id, count) {
		count = Number(count);
		//console.log(count, code_id);
		if (count == NaN) {
			return;
		}
		var data = this.packs_data2[code_id];
		
		data.g_buy_count = Math.min(count, Math.floor(pagegetters.gold/data.g_cost));
		data.ucp_buy_count = Math.min(count, Math.floor(pagegetters.ucp/data.ucp_cost));
		
		document.querySelector(".PrettyCards_PackGPrice[data-packid="+ code_id +"]").innerHTML = data.g_buy_count*data.g_cost;
		document.querySelector(".PrettyCards_PackUcpPrice[data-packid="+ code_id +"]").innerHTML = data.ucp_buy_count*data.ucp_cost;
	}

	changePackCountButton(code_id, count) {
		count = Number(count);
		//console.log(count, code_id);
		if (count == NaN) {
			return;
		}
		var data = this.packs_data2[code_id];
		
		data.open_count = Math.min(count, data.amount);
		
		document.querySelector(".PrettyCards_PackOpenCountButton[data-packid="+ code_id +"]").innerHTML = data.open_count;
	}
	
	onPackMouseOver(e) {
		//debugger;
		var code_id = e.currentTarget.getAttribute("data-packid");
		if (!code_id) {return;}
		//console.log("Mouse Over", e, code_id);
		//$(".PrettyCards_PackCell[data-packid="+ code_id +"] .PrettyCards_PackText").stop().slideDown( 250, function() {});
	}
	
	onPackMouseLeave(e) {
		var code_id = e.currentTarget.getAttribute("data-packid");
		if (!code_id) {return;}
		//console.log("Mouse Leave", e, code_id);
		//$(".PrettyCards_PackCell[data-packid="+ code_id +"] .PrettyCards_PackText").stop().slideUp( 250, function() {});
	}
	
	onPackOpenCountChange(e) {
		this.sanitizeNumberInput(e.target);
		this.changePackCountButton(e.target.getAttribute("data-packid"), e.target.value);
	}
	
	onPackBuyCountChange(e) {
		this.sanitizeNumberInput(e.target);
		this.changePrices(e.target.getAttribute("data-packid"), e.target.value);
	}
	
	onPackGBuyClick(e) { // Should be called by the button.
		var data = this.packs_data2[e.target.getAttribute("data-packid")];
		var max_can_afford = Math.floor(pagegetters.gold/data.g_cost);
		if (data.g_buy_count > max_can_afford) {data.g_buy_count = max_can_afford;} // Failsafe
		var id = data.code_id;
		id = id.substring(0, id.length-4);
		//console.log(data.g_buy_count, id);
		//console.log("Buying Packs! ", data, id);
		underscript.buyPacks(data.g_buy_count, {type : id, gold : true});
		
		data.amount += data.g_buy_count;
		this.updatePackCount(data.code_id);
	}
	
	onPackUcpBuyClick(e) { // Should be called by the button.
		const self = this;
		var data = this.packs_data2[e.target.getAttribute("data-packid")];
		var max_can_afford = Math.floor(pagegetters.ucp/data.ucp_cost);
		if (data.ucp_buy_count > max_can_afford) {data.ucp_buy_count = max_can_afford;} // Failsafe
		window.BootstrapDialog.show({
			title: 'Buy packs with UCP?',
			message: $.i18n(`Buy ${data.ucp_buy_count} pack${data.ucp_buy_count > 1 ? 's' : ''} for {{UCP:${data.ucp_buy_count * data.ucp_cost}}} UCP?`),
			buttons: [{
				label: $.i18n('dialog-continue'),
				cssClass: 'btn-success',
				action(diag) {
					self.onPackUcpBuy(data);
					diag.close();
				},
			}, {
				label: $.i18n('dialog-cancel'),
				cssClass: 'btn-danger',
				action(diag) {
					diag.close();
				},
			}],
		});
	}
	
	onPackUcpBuy(data) { // Should be called after the player agrees to buying packs with UCP.
		var id = data.code_id;
		id = id.substring(0, id.length-4);
		//console.log(data.ucp_buy_count, id);
		underscript.buyPacks(data.ucp_buy_count, {type : id, gold : false});
		
		data.amount += data.ucp_buy_count;
		this.updatePackCount(data.code_id);
	}
	
	onPackOpenClick(e) { // Should be called by the button.
		if (underscript.openingPacks()) {
			return;
		}
		if (document.querySelector(".PrettyCards_PackOpenContent .PrettyCards_AnimationPack")) {
			return;
		}
		var data = this.packs_data2[e.target.getAttribute("data-packid")];
		if (data.amount <= 0) {return;} // Failsafe #1
		if (data.open_count > data.amount) {data.open_count = data.amount;} // Failsafe #2
		var id = data.code_id;
		id = id.substring(0, id.length-4);
		//console.log(data.open_count, id);
		window.PrettyCards_pack_being_opened = data;
		underscript.openPacks(data.open_count, id);
		
		//data.amount -= data.open_count; // Moved over for when the server actually responds.
		//this.updatePackCount(data.code_id);
	}
	
	updatePackCount(id) {
		document.querySelector(".PrettyCards_PackCell[data-packid="+ id +"] .PrettyCards_PackAmount").innerHTML = this.packs_data2[id].amount;
	}
	
	onPackGeneration(data, pack_cell) { // Optional, but has default behaviour.
		pack_cell.addEventListener( "mouseover", this.onPackMouseOver);
		pack_cell.addEventListener( "mouseleave", this.onPackMouseLeave);
		//$(".PrettyCards_PackCell[data-packid="+ data.code_id +"] .PrettyCards_PackText").slideUp(0);
		$(".PrettyCards_PackCell[data-packid="+ data.code_id +"] .PrettyCards_FloatingPack").css("animation-delay", (-Math.random()*1.5) + "s");
		if (data.does_exist) {
			document.querySelector(".PrettyCards_PackOpenCount[data-packid="+ data.code_id +"]").onchange = this.onPackOpenCountChange.bind(this);
			document.querySelector(".PrettyCards_PackOpen[data-packid="+ data.code_id +"]").onclick = this.onPackOpenClick.bind(this);
			if (data.g_cost > -1) {
				document.querySelector(".PrettyCards_PackBuyCount[data-packid="+ data.code_id +"]").onchange = this.onPackBuyCountChange.bind(this);
				document.querySelector(".PrettyCards_PackGBuy[data-packid="+ data.code_id +"]").onclick = this.onPackGBuyClick.bind(this);
				document.querySelector(".PrettyCards_PackUcpBuy[data-packid="+ data.code_id +"]").onclick = this.onPackUcpBuyClick.bind(this);
			}
		}
	}
	
	generatePagePack(data) { // Required. It's used in generatePage and ran for every individual pack. This function should be responsible for adding them.
		var txt = this.generatePack(data);
		var pack_cell = document.querySelector(".PrettyCards_PackCell[data-packid="+ data.code_id +"]");
		pack_cell.innerHTML = txt;
		
		this.onPackGeneration(data, pack_cell);
	}
	
	generatePage(packs_data, packs_data2) { // Required
		this.packs_data2 = packs_data2;
		
		document.getElementById("PrettyCards_MainContent").innerHTML =  this.pageAdditions();
				
		for (var i=0; i < packs_data.length; i++) {
			this.generatePagePack(packs_data[i]);
		}
	}
	
}

export {PacksPageTemplate};