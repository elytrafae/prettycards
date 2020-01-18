
const customCardsStart = 2000;

$.i18n().load( {
	en: {
			['card-name-' + (customCardsStart)] : 'Chibi Sayori',
			['card-'+ (customCardsStart)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and clear all negative effects from all ally monsters.',
			['card-name-' + (customCardsStart+1)] : 'Chibi Natsuki',
			['card-'+ (customCardsStart+1)] : '{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +2 {{HP}} to an ally non-{{TRIBE:CHIBI|1}} monster.'
		}
} );

$.i18n().load( {
	en: {
			'tribe-chibi' : '{{PLURAL:$1|Chibi|Chibis}}'
		}
} );
