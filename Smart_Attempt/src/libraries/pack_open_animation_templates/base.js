
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {utility} from "/src/libraries/utility.js";
import {rarityIconsHTML, rarities} from "./../rarity_icons.js";
import {FlippableCard} from "/src/libraries/flippable_card.js";
//import $ from "/src/third_party/jquery-2.2.4.min.js";

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
	}
	
	// Events
	OnPackMoveBegin(moveto_x, moveto_y, pack_data, card_data) {
		//console.log("Animation Begins!");
		this.pack_data = pack_data;
		this.AnalyzeCards(card_data); // refreshes and initializes this.cards
		this.flipCards = [];
		this.current_click = 0;
		$("#PrettyCards_PackOpenContent").css("display", "block");
		
		$("#PrettyCards_PackOpenContent").css("backgroundColor", 'rgba(0,0,0,0)');
		window.$("#PrettyCards_PackOpenContent").animate({backgroundColor: 'rgba(0,0,0,1)'}, 1000, "swing", function() {}); // This is because the page has Jquery UI installed, something I am personally too lazy to do :P
		
		$(".PrettyCards_AnimationPack").animate({top: (moveto_y + "px"), left: (moveto_x + "px")}, 1000, "swing", this.OnPackMoveFinish.bind(this));
	}
	
	OnPackMoveFinish() {
		console.log("Pack Move Animation Finished.");
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
		console.log("BreakAnimationFinished!");
		this.up.remove();
		this.down.remove();
		
		this.cards_finished_gliding = 0;
		const time_between_glides = 1500 / this.flipCards.length;
		const glide_callback = this.OnCardFinishedGliding.bind(this);
		for (var i=0; i < this.flipCards.length; i++) {
			const flipcard = this.flipCards[i];
			setTimeout(function() {flipcard.glideTo(200, window.innerHeight/2, 500, glide_callback)}, (i+1)*time_between_glides);
		}
	}
	
	OnCardFinishedGliding() {
		this.cards_finished_gliding++;
		if (this.cards_finished_gliding >= this.flipCards.length) {
			console.log("Gliding finished!");
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
	}
	
	OnCardViewFinish() {
		$("#PrettyCards_PackOpenContent").unbind("click");
		console.log("Card View Finish!");
		this.OnCardSummary();
		
	}
	
	OnCardSummary() {
		const self = this;
		const container = document.createElement("DIV");
		container.className = "PrettyCards_CardSummary";
		
		var containerTitle = document.createElement("P");
		containerTitle.innerHTML = "Card Summary";
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
		console.log("Card Summary Container", container);
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
		var up = document.createElement("IMG");
		up.className = "PrettyCards_RippedPack_Up";
		up.src = this.pack_data.image_without_extension + "_HorizontalRip_Top" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], up);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(up);
		
		var down = document.createElement("IMG");
		down.className = "PrettyCards_RippedPack_Down";
		down.src = this.pack_data.image_without_extension + "_HorizontalRip_Bottom" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], down);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(down);
		
		$(".PrettyCards_AnimationPack").css("opacity", 0);
		
		return [up, down];
	}
	
	RipPackVertically() {
		var left = document.createElement("IMG");
		left.className = "PrettyCards_RippedPack_Left";
		left.src = this.pack_data.image_without_extension + "_VerticalRip_Left" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], left);
		document.getElementById("PrettyCards_PackOpenContent").appendChild(left);
		
		var right = document.createElement("IMG");
		right.className = "PrettyCards_RippedPack_Right";
		right.src = this.pack_data.image_without_extension + "_VerticalRip_Right" + this.pack_data.image_extension;
		utility.copyCSS(document.getElementsByClassName("PrettyCards_AnimationPack")[0], right);
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
		console.log("Sorted cards! ", this.cards);
		
	}
	
	SpawnCards() {
		for (var i=this.cards.length-1; i >= 0; i--) {
			var flipcard = new FlippableCard(this.cards[i], false);
			flipcard.appendTo(document.getElementById("PrettyCards_PackOpenContent"));
			flipcard.moveTo(window.innerWidth/2, window.innerHeight/2);
			this.flipCards.unshift(flipcard);
		}
		//console.log("flipCards initialized! ", this.flipCards);
	}
	
}

export {PackOpenAnimationTemplate};