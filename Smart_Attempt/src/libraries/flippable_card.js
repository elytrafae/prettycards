
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {SetCosmeticsForCardData} from "./card_cosmetics_manager.js";

class FlippableCard {
	
	constructor(card_data, hoverable, setCosmetics = true, addCounts = true) {
		this.baseScale = 1;
		this.container = document.createElement("DIV");
		this.container.className = "PrettyCards_FlippableCardContainer";
		
		this.flipContainer = document.createElement("DIV");
		this.flipContainer.className = "PrettyCards_FlipContainer";
		this.flipContainer.style = "transform: rotateY(180deg);";
		this.container.appendChild(this.flipContainer);
		
		if (setCosmetics) {
			card_data = SetCosmeticsForCardData(card_data);
		}
		window.appendCard(card_data, $(this.flipContainer));
		this.front = this.flipContainer.children[0];
		this.front.className += " PrettyCards_CardFront";
		
		if (addCounts) {
			var appendText = `<div class="cardQuantity">${card_data.quantity > 0 ? '<span class="nb">x' + card_data.quantity + '</span>' : ""} ${card_data.quantityShiny > 0 ? '<span class="nb_shiny rainbowText">x' + card_data.quantityShiny + '</span>' : ""}</div>`;
			$(this.front).append(appendText);
			$(this.front).css("height", "275px");
		}
		
		const hovered_url = "url(/images/cardBacks/" + card_data.extension + "Card" + card_data.rarity + ".png)";
		const normal_url = "url(/images/cardBacks/" + card_data.extension + "CardNORMAL.png)";
		
		this.back = document.createElement("DIV");
		this.back.style.backgroundImage = hoverable ? normal_url : hovered_url;
		this.back.className = "PrettyCards_CardBack";
		
		if (hoverable) {
			var funcIn = function (e) {this.back.style.backgroundImage = hovered_url;};
			var funcOut = function (e) {this.back.style.backgroundImage = normal_url;};
			$(this.container).hover(funcIn.bind(this), funcOut.bind(this));
		}
		
		this.flipContainer.appendChild(this.back);
		
		this.isShiny = card_data.shiny;
		this.shinySlot = this.front.querySelector(".shinySlot");
		
		this.card_data = card_data;
		
		this.handleRotation(180);
	}
	
	appendTo(element) {
		element.appendChild(this.container);
	}
	
	moveTo(x, y) {
		this.container.style.top = y + "px";
		this.container.style.left = x + "px";
	}
	
	setBaseScale(scale) {
		this.container.style.transform = "scale(" + scale + ")";
	}
	
	glideTo(x, y, duration, callback) {
		//console.log("Glide Callback", callback);
		$(this.container).animate({top: y + "px", left: x + "px"}, {
			duration: (duration || 1000), 
			easing: "swing",
			complete: callback
		});
	}
	
	flipToFace(duration) {
		//this.flipContainer.style["transition-duration"] = (duration/1000) + "s";
		//$(this.flipContainer).css("transform", "rotateY(0deg)");
		$(this.flipContainer).animateRotate(180, 0, duration, "swing", this.handleRotation.bind(this));
	}
	
	flipToBack(duration) {
		//this.flipContainer.style["transition-duration"] = (duration/1000) + "s";
		//$(this.flipContainer).css("transform", "rotateY(180deg)");
		$(this.flipContainer).animateRotate(0, 180, duration, "swing", this.handleRotation.bind(this));
	}
	
	scaleTo(scale, duration) {
		this.container.style["transition-duration"] = (duration/1000) + "s";
		this.container.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
	}
	
	makeIntoSummaryCard() {
		this.container.style.position = "static";
		this.container.style.display = "inline-block";
		this.container.style.transform = "none";
	}
	
	handleRotation(now) { // This is a woratround for a css issue with flipped shiny cards (and all cards on Firefox >:( )
		if (now < 90) {
			this.front.style.opacity = "1";
			this.back.style.opacity = "0";
			if (this.isShiny) {
				this.shinySlot.style["mix-blend-mode"] = "multiply";
			}
		} else {
			this.front.style.opacity = "0";
			this.back.style.opacity = "1";
			if (this.isShiny) {
				this.shinySlot.style["mix-blend-mode"] = "normal";
			}
		}
	}
	
	playJingle() {
		if (this.card_data.rarity != "LEGENDARY" && this.card_data.rarity != "DETERMINATION") {
			return;
		}
		var soundPath = '/musics/cards/' + this.card_data.name.split(' ').join('_') + '.ogg';
		var audio = new Audio(soundPath);
		audio.volume = 0.4;
		audio.play();
		this.silent = true;
	}
	
}

export {FlippableCard};
