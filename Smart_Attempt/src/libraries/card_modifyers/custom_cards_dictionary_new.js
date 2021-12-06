
import {PrettyCards_plugin, settings, prettycards} from "/src/libraries/underscript_checker.js";

class CustomCardCollection {
	
	constructor() {
		
	}
	
}

class Card {
	
	constructor(settings) {
		this.card_data = {
			armor: false,
			//attack: 1,
			baseImage: "Tiny_Froggit",
			burn: 0,
			candy: false,
			cantAttack: false,
			charge: false,
			cost: 0,
			dodge: 0,
			extension: "BASE",
			fixedId: 196,
			frameSkinName: "Undertale",
			haste: false,
			//hp: 1,
			image: "Tiny_Froggit",
			invulnerable: false,
			kr: 0,
			name: "Tiny Froggit",
			ownerId: 0,
			paralyzed: 0,
			playedTurn: 0,
			quantity: 99999,
			rarity: "COMMON",
			selectCards: [],
			shiny: false,
			silence: false,
			taunt: false,
			transparency: false,
			tribes: [],
			typeCard: 1,
			typeSkin: 0,
			shockEnabled: false,
			supportEnabled: false
		}
		
		for (var prop in settings) {
			this.card_data[prop] = settings[prop];
		}
		
		if (card_data.attack || card_data.hp) {
			card_data.typeCard = 0;
		}
		
		card_data.id = customCardsStart + this.customCards.length;
		card_data.fixedId = card.id;
		card_data.maxHp = card.hp;
		card_data.originalHp = card.hp;
		card_data.originalAttack = card.attack;
		card_data.originalCost = card.cost;
		card_data.baseImage = card.image;
		card_data.isCustom = true;
		
		window.$.i18n().load( {
			en: { 
				["card-name-" + card_data.id] : card_data.name,
				["card-" + card_data.id] : card_data.description,
			}
		})
		
		card_data.name = window.$.i18n("card-name-" + card_data.id, 1);
	}
}
