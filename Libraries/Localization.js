
const customCardsStart = 2000;
const customArtifactStart = 100;

// Cards
$.i18n().load( {
	en: {
			['card-name-' + (customCardsStart)] : 'Chibi Sayori',
			['card-'+ (customCardsStart)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and clear all negative effects from all ally monsters.',
			['card-name-' + (customCardsStart+1)] : 'Chibi Natsuki',
			['card-'+ (customCardsStart+1)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +2 {{HP}} to an ally monster.',
			['card-name-' + (customCardsStart+2)] : 'Chibi Yuri',
			['card-'+ (customCardsStart+2)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +2 {{ATK}} to an ally monster.',
			['card-name-' + (customCardsStart+3)] : 'Chibi Monika',
			['card-'+ (customCardsStart+3)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and add a copy of all other ally {{TRIBE:CHIBI|2}} to your hand.',
			['card-name-' + (customCardsStart+4)] : 'Sayori',
			['card-'+ (customCardsStart+4)] : 'Immune to incoming effects. {{KW:SUICIDE}}: Deal 1 {{DMG}} to all enemy monsters. If they have 2 or more status effects, deal 3 instead.',
			['card-name-' + (customCardsStart+5)] : 'Natsuki',
			['card-'+ (customCardsStart+5)] : '{{KW:TURN-START}}: Add a {{CARD:' + (customCardsStart+6) + '|1}} to your hand. {{KW:SUICIDE}}: Deal 5 {{DMG}} to the monster in front of this.',
			['card-name-' + (customCardsStart+6)] : 'Cupcake',
			['card-'+ (customCardsStart+6)] : 'Heal 4 {{HP}}.',
			['card-name-' + (customCardsStart+7)] : 'Yuri',
			['card-'+ (customCardsStart+7)] : 'Whenever this survives {{DMG}}, give this +1 {{HP}}. {{KW:SUICIDE}}: {{KW:PARALYZE}} all monsters on the board.',
			['card-name-' + (customCardsStart+8)] : 'Monika',
			['card-'+ (customCardsStart+8)] : '{{KW:MAGIC}}: Kill an ally {{TRIBE:DOKI|1}} to summon a base copy of this card. {{KW:DUST}}: Add another random {{TRIBE:DOKI|1}} to your hand with -2 {{COST}}.',
			['card-name-' + (customCardsStart+9)] : 'Protagonist',
			['card-'+ (customCardsStart+9)] : '{{KW:TAUNT}}. Whenever a {{KW:SUICIDE}} effect is activated, add a 1/1 copy of the triggering monster into your deck and give it +1/+1 for every card in your hand.',
			['card-name-' + (customCardsStart+10)] : '{{PLURAL:$1|Just Monika|Just Monikas}}',
			['card-'+ (customCardsStart+10)] : '{{KW:MAGIC}}: Add all the {{TRIBE:CHRSPELL|2}} to your deck. {{KW:SUICIDE}} effects trigger an additional time.',
			['card-name-' + (customCardsStart+11)] : 'Sayori.chr',
			['card-'+ (customCardsStart+11)] : '{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, discard this and draw a card.',
			['card-name-' + (customCardsStart+12)] : 'Natsuki.chr',
			['card-'+ (customCardsStart+12)] : '{{KW:TURBO}}: Summon a random 5-{{COST}} monster, trigger it\'s {{KW:MAGIC}}, discard this and draw a card.',
			['card-name-' + (customCardsStart+13)] : 'Yuri.chr',
			['card-'+ (customCardsStart+13)] : '{{KW:TURBO}}: Kill the enemy monster with the lowest HP, discard this and draw a card.',
			['card-name-' + (customCardsStart+14)] : 'Monika.chr',
			['card-'+ (customCardsStart+14)] : '{{KW:TURBO}}: Send a random ally and enemy from the board to their owner\'s hands, discard this and draw a card.',
			['card-name-' + (customCardsStart+15)] : '{{PLURAL:$1|Melissa Christmas|Melissa Christmases}}',
			['card-'+ (customCardsStart+15)] : '{{KW:TURN-START}}: Look at {{TRIBE:MELISSAATTACK|2}} and choose one to add to your hand. {{TRIBE:MELISSAATTACK|2}} {{COST}} 2 less.',
			['card-name-' + (customCardsStart+16)] : 'Green Potion',
			['card-'+ (customCardsStart+16)] : 'Heal a {{DMG}}-ed ally monster by 5 HP. Deal the excess healing as {{DMG}} to the opponent.',
			['card-name-' + (customCardsStart+17)] : 'Red Potion',
			['card-'+ (customCardsStart+17)] : 'Deal 2 {{DMG}} 3 times to a monster.',
			['card-name-' + (customCardsStart+18)] : 'Cauldron',
			['card-'+ (customCardsStart+18)] : '{{KW:TAUNT}}. {{KW:DISARMED}}. {{KW:DODGE}} (1). {{KW:DUST}}: Deal this\'s {{ATK}} as {{DMG}} to the killer.',
			['card-name-' + (customCardsStart+19)] : 'Frogify',
			['card-'+ (customCardsStart+19)] : 'Summon an enemy {{CARD:' + (customCardsStart+20) + '|1}} and capture a selected enemy monster into it.',
			['card-name-' + (customCardsStart+20)] : 'Hopping Frog',
			['card-'+ (customCardsStart+20)] : '{{KW:DODGE}} (2). {{KW:DUST}}: Add the captured monster to your hand with -3 {{COST}}.',
			['card-name-' + (customCardsStart+21)] : 'Hat Attack',
			['card-'+ (customCardsStart+21)] : 'Add {{ARTIFACT:'+ (customArtifactStart) +'}} artifact.',
			['card-name-' + (customCardsStart+22)] : 'Flames Of Envy',
			['card-'+ (customCardsStart+22)] : 'Give a monster +3 {{ATK}} for this turn.',
		}
} );//{{ARTIFACT:25}}

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
