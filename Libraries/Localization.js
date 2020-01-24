
const customCardsStart = 2000;

$.i18n().load( {
	en: {
			['card-name-' + (customCardsStart)] : 'Chibi Sayori',
			['card-'+ (customCardsStart)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and clear all negative effects from all ally monsters.',
			['card-name-' + (customCardsStart+1)] : 'Chibi Natsuki',
			['card-'+ (customCardsStart+1)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +2 {{HP}} to an ally monster.',
			['card-name-' + (customCardsStart+2)] : 'Chibi Yuri',
			['card-'+ (customCardsStart+2)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +2 {{ATK}} to an ally monster.',
			['card-name-' + (customCardsStart+3)] : 'Chibi Monika',
			['card-'+ (customCardsStart+3)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and add a copy of all other ally {{TRIBE:CHIBI|2}} to your hand.'
		}
} );

$.i18n().load( {
	en: {
			'tribe-chibi' : '{{PLURAL:$1|Chibi|Chibis}}'
		}
} );
