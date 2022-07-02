
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import {FancyDisplay} from "/src/libraries/fancy_helper.js";
import {PrettyCards_plugin, settings, prettycards} from "/src/libraries/underscript_checker.js";
import {LoadFont, ListenForWhenAllFontsAreLoaded} from "/src/libraries/font_loader.js";
import { registerCard } from "./card_theme_song_manager";
import { utility } from "../utility";

var customCardsStart = 2000;
var nextCustomCardId = customCardsStart;
var customArtifactsStart = 200;
var nextCustomArtifact = customArtifactsStart;
var customSoulsStart = 20;
var nextCustomSoul = customSoulsStart;

var collections = [];

function uniqueNameId(type, id, i = 0) {
	var s = type + id.toLowerCase();
	if (i > 0) {
		s = s + i;
	}
	//console.log("uniqueNameId", s, i, window.$.i18n(s));
	if (window.$.i18n(s) != s) {
		return uniqueNameId(type, id, i+1);
	}
	var ret = id;
	if (i > 0) {
		ret = ret + i;
	}
	return ret;
}

function newCollection(settings) {
	var collection = new CustomCardCollection(settings);
	collection.id = collections.length; // This is ugly, but it works. Just some simple logic I use all the time.
	collections.push(collection);
	return collection;
}

class CustomCardCollection {
	
	constructor(settings) {
		this.cards = [];
		this.tribes = [];
		this.artifacts = [];
		this.souls = [];
		this.keywords = [];
		this.frames = [];
		this.cardImagePrefix = settings.cardImagePrefix || "";
		this.cardSongPrefix = settings.cardSongPrefix || "";
		this.rarityImagePrefix = settings.rarityImagePrefix || settings.rarityIconPrefix || "images/rarity/";
		this.tribeImagePrefix = settings.tribeImagePrefix || "";
		this.artifactImagePrefix = settings.artifactImagePrefix || "";
		this.soulImagePrefix = settings.soulImagePrefix || "";

		this.aprilCardImagePrefix = settings.aprilCardImagePrefix || "";
		this.aprilArtifactImagePrefix = settings.aprilArtifactImagePrefix || "";
		this.aprilSoulImagePrefix = settings.aprilSoulImagePrefix || "";
		
		this.name = settings.name || "UNNAMED CATEGORY";
		this.author = settings.author || "";
		this.note = settings.note || "";
		this.universalCustomFont = settings.universalCustomFont || "";
		this.oldPrefixBehavior = false;
	}
	
	newCard(settings) {
		var card = new Card(settings, this);
		card.collection = this;
		this.cards.push(card);
		return card;
	}
	
	newTribe(settings) {
		var tribe = new Tribe(settings);
		this.tribes.push(tribe);
		return tribe;
	}
	
	newArtifact(settings) {
		var artifact = new Artifact(settings);
		artifact.collection = this;
		this.artifacts.push(artifact);
		return artifact;
	}
	
	newSoul(settings) {
		var soul = new Soul(settings);
		soul.collection = this;
		this.souls.push(soul);
		return soul;
	}
	
	newKeyword(settings) {
		var kw = new Keyword(settings);
		this.keywords.push(kw);
		return kw;
	}

	newFrame(settings) {
		var frame = new CardFrame(settings);
		this.frames.push(frame);
		return frame;
	}

	reloadFrames() {
		var inner = "";
		for (var i=0; i < this.frames.length; i++) {
			inner += this.frames[i].returnCSSStyles();
		}
		$("#collectionCustomCSS").html(inner);
	}
	
	loadFont(name, url) {
		return LoadFont(name, url);
	}
	
	getTribeById(id) {
		//console.log("getTribeById", id);
		for (var i=0; i < this.tribes.length; i++) {
			var tribe = this.tribes[i];
			if (tribe.id == id) {
				return tribe;
			}
		}
		return null;
	}
	
	toJSON() {
		return this.id;
	}
	
}

class Card {
	
	constructor(settings, collection) {
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
		
		this.customFont = "";
		this.note = "";
		
		for (var prop in settings) {
			this[prop] = settings[prop];
		}
		
		if (this.attack || this.hp) {
			this.typeCard = 0;
		}
		
		this.id = nextCustomCardId;
		this.fixedId = nextCustomCardId;
		/*
		Object.defineProperty(this, "id", {
			value: nextCustomCardId,
			writable: false
		});
		Object.defineProperty(this, "fixedId", {
			value: nextCustomCardId,
			writable: false
		});
		*/
		nextCustomCardId++;
		
		this.maxHp = this.hp;
		this.originalHp = this.hp;
		this.originalAttack = this.attack;
		this.originalCost = this.cost;
		this.baseImage = this.image;

		this.isCustom = true;
		/*
		Object.defineProperty(this, "isCustom", {
			value: true,
			writable: false
		});
		*/
		
		window.$.i18n().load( {
			en: { 
				["card-name-" + this.id] : this.name,
				["card-" + this.id] : (this.description || this.desc),
			}
		});
				
		this.tribes = this.tribes.map((el) => el.toString());
		
		/*
		Object.defineProperty(this, "tribes", {
			value: Object.freeze(this.tribes),
			writable: false
		});
		
		Object.defineProperty(this, "name", {
			value: window.$.i18n("card-name-" + this.id, 1),
			writable: false
		});
		*/
		this.name = window.$.i18n("card-name-" + this.id, 1);
		this.description = undefined;

		if (this.themeSongs) {
			var s = registerCard(this);
			for (var i=0; i < this.themeSongs.length; i++) {
				s.addFile(utility.constructURL(collection.cardSongPrefix, this.themeSongs[i], "ogg", collection.oldPrefixBehavior));
			}
		}
		
		window.allCards.push(this);
	}
	
	mention(nr = "1") {
		return "{{CARD:" + this.id + "|" + nr + "}}";
	}
	
	me(nr = "1") {
		return this.mention(nr);
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
			value: uniqueNameId("tribe-", settings.id || "unnamed_tribe"),
			writable: false
		});
		this.image = settings.image || "NO_IMAGE";
		this.setName(this.name);
		this.name = window.$.i18n("tribe-" + this.id, 1);
	}
	
	toString() { // This is so Tribe objects can be used freely in cards' tribes attribute.
		return this.id.toString(); // The toString is only there for safety.
	}
	
	setName(name, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["tribe-" + this.id.toLowerCase()] = name;
		//console.log("Tribe Name data: ", data);
		window.$.i18n().load(data);
	}
	
	getName(nr = 1) {
		return window.$.i18n("tribe-" + this.id.toLowerCase(), nr);
	}
	
	mention(nr = 1) {
		return "{{TRIBE:" + this.id + "|" + nr + "}}";
	}
	
	me(nr = "1") {
		return this.mention(nr);
	}
	
}

class Artifact {
	
	constructor(settings) {
		this.name = settings.name || "UNNAMED ARTIFACT";
		this.description = settings.description || "NO EFFECT";
		this.image = settings.image || "NO_IMAGE";
		this.aprilImage = settings.aprilImage;
		this.rarity = settings.rarity || "COMMON";
		this.note = settings.note || "";
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
		
		artifactDisplay.artifacts.push(this);
	}
	
	mention(nr = 1) {
		return "{{ARTIFACT:" + this.id + "|" + nr + "}}";
	}
	
	me(nr = "1") {
		return this.mention(nr);
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

class Soul {
	
	constructor(settings) {
		Object.defineProperty(this, "id", {
			value: nextCustomSoul,
			writable: false
		});
		nextCustomSoul++;
		Object.defineProperty(this, "name", {
			value: uniqueNameId("soul-name-", settings.name || "NONAME"),
			writable: false
		});
		this.displayName = settings.displayName || "NoName";
		this.image = settings.image || "NO_IMAGE";
		this.aprilImage = settings.aprilImage;
		this.description = settings.description || "No description";
		this.note = settings.note || "";
		
		window.$.i18n().load( {
			en: { 
				["soul-" + this.name.toLowerCase()] : this.displayName,
				["soul-" + this.name.toLowerCase() + "-desc"] : this.description,
			}
		});
		
		this.displayName = window.$.i18n("soul-" + this.name.toLowerCase(), 1);
		
		FancyDisplay.customSouls.push(this);
	}
	
	mention(nr = "1") {
		return "{{SOUL:" + this.name + "|" + nr + "}}";
	}
	
	me(nr = "1") {
		return this.mention(nr);
	}
	
	setName(name, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["soul-" + this.name.toLowerCase()] = name;
		window.$.i18n().load(data);
	}
	
	getName(nr = 1) {
		return window.$.i18n("soul-" + this.name.toLowerCase(), nr);
	}
	
	setDescription(desc, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["soul-" + this.name.toLowerCase() + "-desc"] = desc;
		window.$.i18n().load(data);
	}
	
	getDescription() {
		return window.$.i18n("soul-" + this.name.toLowerCase() + "-desc");
	}
	
}

class Keyword {
	
	constructor(settings) {
		Object.defineProperty(this, "id", {
			value: uniqueNameId("kw-", settings.id || "NOID"),
			writable: false
		});
		this.name = settings.name || "NoName";
		this.description = settings.description || "No description";
		
		window.$.i18n().load( {
			en: { 
				["kw-" + this.id.toLowerCase()] : this.name,
				["kw-" + this.id.toLowerCase() + "-desc"] : this.description,
			}
		});
		
		this.name = window.$.i18n("kw-" + this.id.toLowerCase(), 1);
		
		//FancyDisplay.customSouls.push(this);
	}
	
	mention(nr = "1") {
		return "{{KW:" + this.id + "|" + nr + "}}";
	}
	
	me(nr = "1") {
		return this.mention(nr);
	}
	
	setName(name, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["kw-" + this.id.toLowerCase()] = name;
		window.$.i18n().load(data);
	}
	
	getName(nr = 1) {
		return window.$.i18n("kw-" + this.id.toLowerCase(), nr);
	}
	
	setDescription(desc, language = "en") {
		var data = {};
		data[language] = {};
		data[language]["kw-" + this.id.toLowerCase() + "-desc"] = desc;
		window.$.i18n().load(data);
	}
	
	getDescription() {
		return window.$.i18n("kw-" + this.id.toLowerCase() + "-desc");
	}
	
}

class CardFrame {

	constructor(settings) {
		this.id = settings.id.toLowerCase() || "unnamed";
		this.monsterImage = settings.monsterImage;
		this.spellImage = settings.spellImage;
		this.shinyImage = settings.shinyImage || "/images/frameSkins/Undertale/frame_shiny.png";
		this.animatedShinyImage = settings.animatedShinyImage || "/images/frameSkins/Undertale/frame_shiny_animated.png";
		this.nameTop = this.makeIntoCSSMeasurement(settings.nameTop, "9px");
		this.descTop = this.makeIntoCSSMeasurement(settings.descTop, "129px");
		this.rarityTop = this.makeIntoCSSMeasurement(settings.rarityTop, "213px");
		this.quantityTop = this.makeIntoCSSMeasurement(settings.quantityTop, "240px");
	}

	makeIntoCSSMeasurement(nr, def) {
		if (typeof(nr) == "number") {
			return nr + "px";
		}
		return nr || def;
	}

	returnCSSStyles() {
		return `
		.${this.id}-frame .shinySlot {
			background-image: url(${this.shinyImage})
		}
		
		.${this.id}-frame .shinySlot.animated {
			background-image: url(${this.animatedShinyImage})
		}
		
		.${this.id}-frame.spell .cardFrame {
			background-image: url(${this.spellImage})
		}
		
		.${this.id}-frame.monster .cardFrame {
			background-image: url(${this.monsterImage})
		}
		
		.${this.id}-frame .cardName,.${this.id}-frame .cardCost {
			top: ${this.nameTop}
		}
		
		.${this.id}-frame .cardDesc,.${this.id}-frame .cardSilence {
			top: ${this.descTop}
		}
		
		.${this.id}-frame .cardATK,.${this.id}-frame .cardHP,.${this.id}-frame .cardRarity {
			top: ${this.rarityTop}
		}
		
		.${this.id}-frame .cardQuantity,.${this.id}-frame .cardUCPCost {
			top: ${this.quantityTop}
		}

		`;
	}

	toString() {
		return this.id;
	}

	replace(a, b) {
		return this.id.replace(a, b);
	}

	toJSON() {
		return this.id;
	}

}

prettycards.newCollection = newCollection;

export {collections};
