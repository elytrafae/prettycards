
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {utility} from "/src/libraries/utility.js";
import {rarityIconsHTML, rarities} from "./../rarity_icons.ts";
import {FlippableCard} from "/src/libraries/flippable_card.js";

class PackOpenAnimationTemplate {
	
	constructor() {
		this.clicks_to_break = 1;
		this.current_click = 0;
		this.pack_data;
		this.card_data;
		this.cards = [];
		this.flipCards = [];
		this.displayName = "Base";
		this.description = "You shouldn't be able to see this!";
		this.hasSkipButton = false;
		this.audio = new Audio();
	}
	
	// Events
	OnPackMoveBegin(moveto_x, moveto_y, pack_data, card_data) {
		//console.log("Animation Begins!");
		this.pack_data = pack_data;
		this.AnalyzeCards(card_data); // refreshes and initializes this.cards
		this.flipCards = [];
		this.current_click = 0;
		this.cardsSpawned = false;
		this.glideTimeouts = [];
		var cont = $("#PrettyCards_PackOpenContent");
		cont.css("display", "block");
		
		cont.css("backgroundColor", 'rgba(0,0,0,0)');
		window.$("#PrettyCards_PackOpenContent").animate({backgroundColor: 'rgba(0,0,0,1)'}, 1000, "swing", function() {}); // This is because the page has Jquery UI installed, something I am personally too lazy to do :P
		
		$(".PrettyCards_AnimationPack").animate({top: (moveto_y + "px"), left: (moveto_x + "px")}, 1000, "swing", this.OnPackMoveFinish.bind(this));

		if (this.hasSkipButton) {
			this.button = $(`<button class="btn btn-primary PrettyCards_PacksSkipButton">${window.$.i18n("pc-navigate-skip")}</button>`);
			cont.append(this.button);
			this.button.click(function(e) {
				e.stopPropagation();
				//button.unbind("click");
				this.button.remove();
				this.onSkipButtonPressed(e);
			}.bind(this));
		}
	}
	
	OnPackMoveFinish() {
		//console.log("Pack Move Animation Finished.");
		$(".PrettyCards_AnimationPack").addClass("PrettyCards_Floating");
		$("#PrettyCards_PackOpenContent").click(this.OnBeforeBreakClick.bind(this));
	}
	
	OnBeforeBreakClick() {
		this.current_click++;
		if (this.current_click >= this.clicks_to_break) {
			$("#PrettyCards_PackOpenContent").unbind("click");
			this.OnPackBreakBegin();
		} else {
			$(".PrettyCards_AnimationPack").removeClass("PrettyCards_Floating");
			window.$(".PrettyCards_AnimationPack").effect("shake");
		}
	}
	
	OnPackBreakBegin() {
		this.SpawnCards();
		
		var parts = this.RipPackHorizontally();
		this.up = parts[0];
		this.down = parts[1];
		
		$(this.up).animate({top: "-=30%", opacity: "0"}, 800, "swing");
		$(this.down).animate({top: "+=30%", opacity: "0"}, 800, "swing", this.OnPackBreakFinish.bind(this));
	}
	
	OnPackBreakFinish() {
		//console.log("BreakAnimationFinished!");
		this.up.remove();
		this.down.remove();
		
		this.cards_finished_gliding = 0;
		const time_between_glides = 1500 / this.flipCards.length;
		const glide_callback = this.OnCardFinishedGliding.bind(this);
		for (var i=0; i < this.flipCards.length; i++) {
			const flipcard = this.flipCards[i];
			this.glideTimeouts.push(setTimeout(function() {flipcard.glideTo(200, window.innerHeight/2, 500, glide_callback)}, (i+1)*time_between_glides));
		}
	}

	cancelGlideTimeouts() {
		this.glideTimeouts.forEach(function(e) {
			clearTimeout(e);
		})
	}
	
	OnCardFinishedGliding() {
		this.cards_finished_gliding++;
		if (this.cards_finished_gliding >= this.flipCards.length) {
			//console.log("Gliding finished!");
			this.OnFinishedGliding();
		}
	}
	
	OnFinishedGliding() {
		this.card_viewed = -1;
		$("#PrettyCards_PackOpenContent").click(this.OnNextCard.bind(this));
		this.OnNextCard();
	}
	
	OnNextCard() {
		if (this.card_viewed >= this.flipCards.length) {return;}
		
		var callback = function() {};
		if (this.card_viewed == this.flipCards.length-1) {
			callback = function() {
				this.OnCardViewFinish();
			}
		}
		
		if (this.card_viewed >= 0) {
			this.flipCards[this.card_viewed].glideTo(window.innerWidth/2, window.innerHeight + 600, 500, callback.bind(this));
			this.flipCards[this.card_viewed].scaleTo(1, 500);
		}
		this.card_viewed++;
		if (this.card_viewed >= this.flipCards.length) {return;}
		
		this.flipCards[this.card_viewed].glideTo(window.innerWidth/2, window.innerHeight/2, 500);
		this.flipCards[this.card_viewed].scaleTo(1.5, 500);
		this.flipCards[this.card_viewed].flipToFace(500);
		this.flipCards[this.card_viewed].playJingle();
	}
	
	OnCardViewFinish() {
		$("#PrettyCards_PackOpenContent").unbind("click");
		//console.log("Card View Finish!");
		this.OnCardSummary();
		
	}
	
	OnCardSummary() {
		if (this.button) {
			this.button.remove();
		}
		const self = this;
		const container = document.createElement("DIV");
		container.className = "PrettyCards_CardSummary";
		
		var containerTitle = document.createElement("P");
		containerTitle.innerHTML = window.$.i18n("pc-packs-summary");
		containerTitle.className = "PrettyCards_CardSummaryTitle";
		container.appendChild(containerTitle);
		
		for (var i=0; i < this.flipCards.length; i++) {
			var flipcard = this.flipCards[i];
			flipcard.scaleTo(1, 0);
			flipcard.flipToFace(0);
			flipcard.appendTo(container);
			
			flipcard.makeIntoSummaryCard();
		}
		$("#PrettyCards_PackOpenContent").append(container);
		$(container).animate({top: "0px"}, {
			duration: 500, 
			easing: "swing",
			complete: function() {$(container).click(self.OnExitFade.bind(self));}
		});
		//console.log("Card Summary Container", container);
	}
	
	OnExitFade(e) {
		if (!$(e.target).is(".PrettyCards_CardSummary")) {
			return true;
		}
		$("#PrettyCards_PackOpenContent").animate({opacity: "0"}, {
			duration: 1000, 
			easing: "swing",
			complete: this.OnExit.bind(this)
		});
	}
	
	OnExit() {
		$("#PrettyCards_PackOpenContent").unbind("click").html("").css("display", "none").css("opacity", "1");
	}
	
	// Utility Functions
	RipPackHorizontally() {
		var anim_pack = document.getElementsByClassName("PrettyCards_AnimationPack")[0];
		var anim_pack_rect = anim_pack.getBoundingClientRect();
		
		var up = document.createElement("DIV");
		up.className = "PrettyCards_RippedPack_Up PrettyCards_RippedPack";
		up.style.backgroundImage = `url("${utility.asset("img/Packs/" + this.pack_data.image)}")`;
		up.style.top = (window.innerHeight/2 - anim_pack_rect.height/2) + "px";
		up.style.left = (window.innerWidth/2 - anim_pack_rect.width/2) + "px";
		up.style.width = anim_pack_rect.width + "px";
		up.style.height = anim_pack_rect.height + "px";
		document.getElementById("PrettyCards_PackOpenContent").appendChild(up);
		
		var down = document.createElement("DIV");
		down.className = "PrettyCards_RippedPack_Down PrettyCards_RippedPack";
		down.style.backgroundImage = `url("${utility.asset("img/Packs/" + this.pack_data.image)}")`;
		down.style.top = (window.innerHeight/2 - anim_pack_rect.height/2) + "px";
		down.style.left = (window.innerWidth/2 - anim_pack_rect.width/2) + "px";
		down.style.width = anim_pack_rect.width + "px";
		down.style.height = anim_pack_rect.height + "px";
		document.getElementById("PrettyCards_PackOpenContent").appendChild(down);
		
		$(".PrettyCards_AnimationPack").css("opacity", 0);
		
		return [up, down];
	}
	
	RipPackVertically() {
		var anim_pack = document.getElementsByClassName("PrettyCards_AnimationPack")[0];
		var anim_pack_rect = anim_pack.getBoundingClientRect();
		
		var left = document.createElement("DIV");
		left.className = "PrettyCards_RippedPack_Left PrettyCards_RippedPack";
		left.style.backgroundImage = `url("${utility.asset("img/Packs/" + this.pack_data.image)}")`;
		left.style.top = (window.innerHeight/2 - anim_pack_rect.height/2) + "px";
		left.style.left = (window.innerWidth/2 - anim_pack_rect.width/2) + "px";
		left.style.width = anim_pack_rect.width + "px";
		left.style.height = anim_pack_rect.height + "px";
		document.getElementById("PrettyCards_PackOpenContent").appendChild(left);
		
		var right = document.createElement("DIV");
		right.className = "PrettyCards_RippedPack_Left PrettyCards_RippedPack";
		right.style.backgroundImage = `url("${utility.asset("img/Packs/" + this.pack_data.image)}")`;
		right.style.top = (window.innerHeight/2 - anim_pack_rect.height/2) + "px";
		right.style.left = (window.innerWidth/2 - anim_pack_rect.width/2) + "px";
		right.style.width = anim_pack_rect.width + "px";
		right.style.height = anim_pack_rect.height + "px";
		document.getElementById("PrettyCards_PackOpenContent").appendChild(right);
		
		$(".PrettyCards_AnimationPack").css("opacity", 0);
		
		return [left, right];
	}
	
	AnalyzeCards(card_data) {
		var card_lists = {};
		for (var i=0; i < rarities.length; i++) {
			card_lists[rarities[i]] = {};
		}
		
		for (var i=0; i < card_data.length; i++) {
			var card = card_data[i];
			var numbers = card_lists[card.rarity][card.id];
			if (!numbers) {
				card_lists[card.rarity][card.id] = {normal: 0, shiny: 0, id: card.id};
				numbers = card_lists[card.rarity][card.id];
			}
			if (card.shiny) {
				numbers.shiny += card.quantity || 1;
			} else {
				numbers.normal += card.quantity || 1;
			}
		}
		
		this.cards = [];
		for (var i=0; i < rarities.length; i++) {
			var card_list = card_lists[rarities[i]];
			for (var id in card_list) {
				var card_nr_data = card_list[id];
				var card = utility.completeCopy(window.getCard(card_nr_data.id));
				card.quantity = card_nr_data.normal;
				card.quantityShiny = card_nr_data.shiny;
				if (card_nr_data.shiny > 0) {
					card.shiny = true;
				}
				this.cards.push(card);
			}
		}
		//console.log("Sorted cards! ", this.cards);
		
	}
	
	SpawnCards() {
		this.cardsSpawned = true;
		for (var i=this.cards.length-1; i >= 0; i--) {
			var flipcard = new FlippableCard(this.cards[i], false);
			flipcard.appendTo(document.getElementById("PrettyCards_PackOpenContent"));
			flipcard.moveTo(window.innerWidth/2, window.innerHeight/2);
			this.flipCards.unshift(flipcard);
		}
		//console.log("flipCards initialized! ", this.flipCards);
	}

	onSkipButtonPressed(event) {
		// An event that is fired whenever the skip button is pressed.
	}
	
}

export {PackOpenAnimationTemplate};