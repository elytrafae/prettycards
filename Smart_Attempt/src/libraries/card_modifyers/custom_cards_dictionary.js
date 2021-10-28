
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var customCards = [];
var customArtifacts = [];
var customCardsStart = 2000;
var customArtifactStart = 200;

var $ = window.$;

class _CustomCardsDictionary {
	
	constructor() {
		this.customCards = [];
		this.customArtifacts = [];
		this.customCardsStart = 2000;
		this.customArtifactStart = 200;
		
		this.customTribes = [];
		this.customExtensions = [];
	}
	
	AddCustomCard(settings) {
		var card = {
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
			typeSkin: 0
		}
	
		for (var prop in settings) {
			card[prop] = settings[prop];
		}
		
		if (card.attack || card.hp) {
			card.typeCard = 0;
		}
		
		card.id = customCardsStart + this.customCards.length;
		card.fixedId = card.id;
		card.maxHp = card.hp;
		card.originalHp = card.hp;
		card.originalAttack = card.attack;
		card.originalCost = card.cost;
		card.baseImage = card.image;
		card.isCustom = true;
		
		var extension = this.GetCustomExtensionByName(card.extension);
		
		if (extension) {
			card.imageURL = extension.cardImageFolder + card.image + ".png";
			card.rarityURL = extension.rarityIconFolder + card.rarity + ".png";
			card.backgroundURL = extension.cardImageFolder + card.background + ".png";
		} else {
			card.imageURL = card.image;
			card.rarityURL = "images/rarity/" + card.extension + "_" + card.rarity + ".png";
			card.backgroundURL = card.background;
		}
		
		window.$.i18n().load( {
			en: { 
				["card-name-" + card.id] : card.name,
				["card-" + card.id] : card.description,
			}
		})
		
		card.name = window.$.i18n("card-name-" + card.id, 1);
		
		this.customCards.push(card);
	}
	
	AddCustomArtifact(translate_name, description) {
		var artifact = {id : customArtifactStart + this.customArtifacts.length, translate_name : translate_name, description : description};
		
		$.i18n().load( {
		en: {
				['artifact-name-' + (artifact.id)] : artifact.translate_name,
				['artifact-' + (artifact.id)] : artifact.description,
			}
		});
		
		artifact.name = $.i18n("artifact-name-" + artifact.id, 1);
		
		this.customArtifacts.push(artifact);
	}
	
	GetCustomCardByName(name) {
		for (var i=0; i < this.customCards.length; i++) {
			if (this.customCards[i].name === name) {
			//if (window.$.i18n("card-name-" + this.customCards[i].id) === name) {
			//if (this.customCards[i].name.split("|").includes(name)) {
				return this.customCards[i];
			}
		}
		return null;
	}
	
	GetCustomArtifactByName(name) {
		for (var i=0; i < this.customArtifacts.length; i++) {
			if (this.customArtifacts[i].name === name) {
			//if (window.$.i18n("artifact-name-" + this.customArtifacts[i].id) === name) {
				return this.customArtifacts[i];
			}
		}
		return null;
	}
	
	// Returns a tring representing the tranlation key for a custom card with a given name. Basically, the string that you need to make the light blue hoverable card names.
	DescriptionCard(name, nr) {
		var num = nr || 1;
		return "{{CARD:" + this.GetCustomCardByName(name).id + "|" + num + "}}";
	}
	
	// Same as the above, but for custom artifacts.
	DescriptionArtifact(name) {
		return "{{ARTIFACT:" + this.GetCustomArtifactByName(name).id + "}}";
	}
	
	// This is to make a card reference itself.
	DescriptionSelfCard(nr) {
		var num = nr || 1;
		return "{{CARD:" + (customCardsStart + this.customCards.length) + "|" + num + "}}";
	}
	
	AddCustomTribe(id, name, icon) {
		var tribe = {id: id.toUpperCase(), name: name, icon: icon};
		
		$.i18n().load({
			en: {
				['tribe-' + id.toLowerCase()] : name
			}
		});
		
		this.customTribes.push(tribe);
	}
	
	AddCustomCardExtension(id, rarityIconFolder, cardImageFolder, themeSongFolder) {
		var extension = {id: id.toUpperCase(), rarityIconFolder: rarityIconFolder, cardImageFolder: cardImageFolder, themeSongFolder: themeSongFolder};
		
		this.customExtensions.push(extension);
	}
	
	GetCustomExtensionByName(name) {
		for (var i=0; i < this.customExtensions.length; i++) {
			var extension = this.customExtensions[i];
			if (extension.id === name) {
				return extension;
			}
		}
		return null;
	}
	
}

// Keywords
ExecuteWhen("PrettyCards:onLoad", function() {
	$.i18n().load( {
		en: {
				'kw-fallen' : 'Fallen',
				'kw-fallen-desc' : 'This ability is triggered when this monster dies during it\'s owner\'s turn.',
				'kw-sacrifice' : 'Sacrifice',
				'kw-sacrifice-desc' : 'Alias for {{KW:FALLEN}}.',
				'kw-suicide' : 'Suicide',
				'kw-suicide-desc' : 'Alias for {{KW:FALLEN}}.'
			}
	});
});

var CustomCardsDictionary = new _CustomCardsDictionary();

export {CustomCardsDictionary};