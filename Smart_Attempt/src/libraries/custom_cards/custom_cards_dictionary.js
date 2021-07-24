
var customCards = [];
var customArtifacts = [];
var customCardsStart = 2000;
var customArtifactStart = 200;

class _CustomCardsDictionary {
	
	constructor() {
		this.customCards = [];
		this.customArtifacts = [];
		this.customCardsStart = 2000;
		this.customArtifactStart = 200;
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
		
		window.$.i18n().load( {
			en: { 
				["card-name-" + card.id] : card.name,
				["card-" + card.id] : card.description,
			}
		})
		
		this.customCards.push(card);
	}
	
	AddCustomArtifact(name, description) {
		var artifact = {id : customArtifactStart + customArtifacts.length, name : name, description : description};
		
		$.i18n().load( {
		en: {
				['artifact-name-' + (artifact.id)] : artifact.name,
				['artifact-' + (artifact.id)] : artifact.description,
			}
		});
		
		this.customArtifacts.push(artifact);
	}
	
	GetCustomCardByName(name) {
		for (var i=0; i < this.customCards.length; i++) {
			//if (this.customCards[i].name === name) {
			//if (window.$.i18n("card-name-" + this.customCards[i].id) === name) {
			if (this.customCards[i].name.split("|").includes(name)) {
				return this.customCards[i];
			}
		}
		return null;
	}
	
	GetCustomArtifactByName(name) {
		for (var i=0; i < this.customArtifacts.length; i++) {
			//if (this.customArtifacts[i].name === name) {
			if (window.$.i18n("artifact-name-" + this.customArtifacts[i].id) === name) {
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
	
}

// Tribes
$.i18n().load( {
	en: {
			'tribe-chibi' : '{{PLURAL:$1|Chibi|Chibis}}',
			'tribe-doki' : '{{PLURAL:$1|Doki|Dokis}}',
			'tribe-chrspell' : '{{PLURAL:$1|.chr spell|.chr spells}}',
			'tribe-melissaattack' : '{{PLURAL:$1|Melissa\'s Attack|Melissa\'s Attacks}}'
		}
} );

// Artifacts
$.i18n().load( {
	en: {
			['artifact-name-' + (customArtifactStart)] : 'Melissa\'s Hat',
			['artifact-' + (customArtifactStart)] : 'Whenever a spell is played, deal 1 {{DMG}} to a random enemy monster. If it was a {{TRIBE:MELISSAATTACK}}, give it -1 {{ATK}}, too.',
		}
} );

// Keywords
$.i18n().load( {
	en: {
			'kw-suicide' : 'Suicide',
			'kw-suicide-desc' : 'This ability is triggered when this creature dies during it\'s owner\'s turn.'
		}
} );

var CustomCardsDictionary = new _CustomCardsDictionary();

export {CustomCardsDictionary};