
import {PrettyCards_plugin, settings, prettycards} from "/src/libraries/underscript_checker.js";

var customCardsStart = 2000;
var nextCustomCardId = customCardsStart;
var customArtifactsStart = 200;
var nextCustomArtifact = customArtifactsStart;

var collections = [];

function newCollection(settings) {
	var collection = new CustomCardCollection(settings);
	collections.push(collection);
	return collection;
}

class CustomCardCollection {
	
	constructor(settings) {
		this.cards = [];
		this.tribes = [];
		this.artifacts = [];
		this.cardImagePrefix = settings.cardImagePrefix || "";
		this.rarityIconPrefix = settings.rarityIconPrefix ||"";
		this.tribeImagePrefix = settings.tribeImagePrefix || "";
		this.artifactImagePrefix = settings.artifactImagePrefix || "";
		
		this.name = settings.name || "UNNAMED CATEGORY";
		this.author = settings.author || "";
	}
	
	newCard(settings) {
		var card = new Card(settings);
		card.collection = this;
		this.cards.push(card);
	}
	
	newTribe(settings) {
		var tribe = new Tribe(settings);
		this.tribes.push(tribe);
	}
	
	newArtifact(settings) {
		var artifact = new Artifact(settings);
		this.artifacts.push(artifact);
	}
	
}

class Card {
	
	constructor(settings) {
		this.armor = false;
		//this.attack = 1;
		this.burn = 0;
		this.candy = false;
		this.cantAttack = false;
		this.charge = false;
		this.cost = 0;
		this.dodge = 0;
		this.extension = "BASE";
		this.fixedId = 196;
		this.frameSkinName = "Undertale";
		this.haste = false;
		//this.hp = 1;
		this.image = "Tiny_Froggit";
		this.invulnerable = false;
		this.kr = false;
		this.name = "Tiny Froggit";
		this.ownerId = 0;
		this.paralyzed = 0;
		this.playedTurn = 0;
		this.quantity = 99999;
		this.rarity = "COMMON";
		this.selectCards = [];
		this.shiny = false;
		this.silence = false;
		this.taunt = false;
		this.transparency = false;
		this.tribes = [];
		this.typeCard = 1;
		this.typeSkin = 0;
		this.shockEnabled = false;
		this.supportEnabled = false;
		this.loop = 0;
		this.program = 0;
		
		this.onRender = function() {};
		
		for (var prop in settings) {
			this[prop] = settings[prop];
		}
		
		if (this.attack || this.hp) {
			this.typeCard = 0;
		}
		
		Object.defineProperty(this, "id", {
			value: nextCustomCardId,
			writable: false
		});
		Object.defineProperty(this, "fixedId", {
			value: nextCustomCardId,
			writable: false
		});
		nextCustomCardId++;
		
		this.maxHp = this.hp;
		this.originalHp = this.hp;
		this.originalAttack = this.attack;
		this.originalCost = this.cost;
		this.baseImage = this.image;
		this.isCustom = true;
		
		window.$.i18n().load( {
			en: { 
				["card-name-" + this.id] : this.name,
				["card-" + this.id] : (this.description || this.desc),
			}
		})
		
		this.name = window.$.i18n("card-name-" + this.id, 1);
	}
	
	mention(nr = "1") {
		return "{{CARD:" + this.id + "|" + nr + "}}";
	}
	
	setName(name, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["card-name-" + this.id] = name;
		window.$.i18n().load(data);
	}
	
	getName(nr = 1) {
		return window.$.i18n("card-name-" + this.id, nr);
	}
	
	setDescription(desc, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["card-" + this.id] = desc;
		window.$.i18n().load(data);
	}
	
	getDescription() {
		return window.$.i18n("card-" + this.id);
	}
	
}

class Tribe {
	
	constructor(settings) {
		this.name = settings.name || "{{PLURAL:$1|Unnamed Tribe|Unnamed_Tribes}}";
		Object.defineProperty(this, "id", {
			value: settings.id || "unnamed_tribe",
			writable: false
		});
		this.image = settings.image || "NO_IMAGE";
		this.setName(this.name);
		this.name = window.$.i18n("tribe-" + this.id, 1);
	}
	
	setName(name, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["tribe-" + this.id] = name;
		window.$.i18n().load(data);
	}
	
	getName(nr = 1) {
		return window.$.i18n("tribe-" + this.id, nr);
	}
	
	mention(nr = 1) {
		return "{{TRIBE:" + this.id + "|" + nr + "}}";
	}
	
}

class Artifact {
	
	constructor(settings) {
		this.name = settings.name || "UNNAMED ARTIFACT";
		this.description = settings.description || "NO EFFECT";
		this.image = settings.image || "NO_IMAGE";
		this.rarity = settings.rarity || "COMMON";
		Object.defineProperty(this, "id", {
			value: nextCustomArtifact,
			writable: false
		});
		nextCustomArtifact++;
		window.$.i18n().load( {
			en: { 
				["artifact-name-" + this.id] : this.name,
				["artifact-" + this.id] : this.description,
			}
		});
		this.name = window.$.i18n("artifact-name-" + this.id, 1);
	}
	
	mention(nr = 1) {
		return "{{ARTIFACT:" + this.id + "|" + nr + "}}";
	}
	
	setName(name, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["artifact-name-" + this.id] = name;
		window.$.i18n().load(data);
	}
	
	getName(nr = 1) {
		return window.$.i18n("artifact-name-" + this.id, nr);
	}
	
	setDescription(desc, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["artifact-" + this.id] = desc;
		window.$.i18n().load(data);
	}
	
	getDescription() {
		return window.$.i18n("artifact-" + this.id);
	}
	
}

prettycards.newCollection = newCollection;

export {collections};
