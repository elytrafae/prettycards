
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

// Extension

/*
c.newCardExtension(
	"DDLC", 
	"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/DDLC/", 
	"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/DDLC/",
	"https://raw.githubusercontent.com/CMD-God/prettycards/master/audio/cards/DDLC/",
);
*/

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Doki Doki Literature Club Set",
		author: "CMD_God",
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/DDLC/",
		rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		universalCustomFont: "Aller",
		note: `This is a Doki Doki Literature Club themed card set I wanted to make for the longest time. I wanted it to be perfect, so I often modified it, asked for feedback and even the custom cards idea was born because of this set. So, please enjoy and don't be afraid to give me feedback! ^^
		<br><br>
		NOTE: Hand nerfs cannot bring a monste below 1 HP. I didn't add this in every instance because some cards are full enough already.`
	});
	
	var test_soul = c.newSoul({
		name: "TESTSOUL",
		displayName: "Test Soul",
		description: "This is a test soul.",
		image: "SWITCH2"
	});
	
	var doki = c.newTribe({
		name: "{{PLURAL:$1|Doki|Dokis}}",
		image: "DOKI",
		id: "DOKI"
	});
	
	var chr_spells = c.newTribe({
		name: "{{PLURAL:$1|CHR Spell|CHR Spells}}",
		image: "CHRSPELL",
		id: "CHRSPELL"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Sayori|Sayoris}}",
		image: "Sayori",
		cost: 4,
		attack: 5,
		hp: 4,
		description: `{{KW:MAGIC}}: Deal 2 {{DMG}} to adjacent ally monsters. {{KW:FALLEN}}: Give all ${doki.me(2)} in your hand +1 {{HP}}.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "COMMON"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Natsuki|Natsukis}}",
		image: "Natsuki",
		cost: 3,
		attack: 3,
		hp: 3,
		description: "Force an ally {{KW:FALLEN}} monster to attack the monster in front of it.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "COMMON"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Yuri|Yuris}}",
		image: "Yuri",
		cost: 3,
		attack: 3,
		hp: 2,
		description: "{{KW:MAGIC}}: {{KW:PARALYZE}} an enemy monster. {{KW:FALLEN}}: If it's alive, give it -2 {{ATK}}. Otherwise give -1 {{ATK}} to a random enemy monster.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "COMMON"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Monika|Monikas}}",
		image: "Monika",
		cost: 7,
		attack: 4,
		hp: 6,
		description: "{{KW:TAUNT}}. {{KW:FALLEN}}: Give the top 3 {{KW:FALLEN}} monsters in your deck -1 {{cost}}.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "RARE"
	});
	
	// Amy Sprite Sheet by u/Meddy-sin
	c.newCard({
		name: "{{PLURAL:$1|Amy|Amys}}",
		image: "Amy",
		cost: 4,
		attack: 5,
		hp: 2,
		//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
		description: "{{KW:MAGIC}}: Kill an ally {{KW:FALLEN}} monster to deal their {{HP}} as {{DMG}} to yourself and trigger its {{KW:FALLEN}} effect. {{KW:FALLEN}}: Add a copy of it to your deck with -1 {{cost}}.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "RARE"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Alphys's PC|Alphys's PCs}}",
		image: "Alphys_PC",
		cost: 6,
		attack: 5,
		hp: 7,
		description: "Look at 3 random non-{{RARITY:DETERMINATION}} {{TRIBE:DOKI|2}} you don't have in your deck and catch one. {{KW:DUST}}: Release it into your deck.",
		extension: "BASE",
		rarity: "RARE",
		customFont: "DTM-Mono"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Anime Poster|Anime Posters}}",
		image: "Anime_Poster",
		cost: 5,
		attack: 4,
		hp: 4,
		description: `Look at 3 random ${doki.me(2)} (rarity <= {{RARITY:EPIC}}) and choose one. {{KW:DELAY}}: Summon it for both players and force yours to attack the enemy one.`,
		extension: "BASE",
		rarity: "EPIC",
		customFont: "DTM-Mono"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Depressed Sayori|Depressed Sayoris}}",
		image: "Depressed_Sayori",
		cost: 4,
		attack: 3,
		hp: 2,
		description: "{{KW:MAGIC}}: An ally {{KW:FALLEN}} monster can attack another monster. {{KW:FALLEN}}: Trigger the effect of a random {{KW:FALLEN}} monster in your hand and return it to your deck with +1/-1.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "EPIC"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Obsessed Yuri|Obsessed Yuris}}",
		image: "Obsessed_Yuri",
		cost: 7,
		attack: 6,
		hp: 5,
		//armor: true,
		description: "{{KW:MAGIC}}: Target an ally {{KW:FALLEN}} monster. {{KW:DELAY}}: If it's dead, {{KW:SILENCE}} and deal 3 {{DMG}} and give -2 {{ATK}} to the monster in front of it.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "EPIC"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Corrupted Natsuki|Corrupted Natsukis}}",
		image: "Corrupted_Natsuki",
		cost: 5,
		attack: 4,
		hp: 4,
		//haste: true,
		//description: "{{KW:HASTE}}. {{KW:FALLEN}}: If this killed an enemy monster, deal the excess {{DMG}} this received to the enemy player.",
		description: `{{KW:TRANSPARENCY}}. {{KW:FALLEN}}: Add a random ${doki.me()} from your dustpile back to your hand with -1 {{cost}} and -2 {{HP}}.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "EPIC"
	});

	c.newCard({
		name: "{{PLURAL:$1|Club President Monika|Club President Monikas}}",
		image: "Club_President_Monika",
		cost: 8,
		attack: 5,
		hp: 9,
		description: `{{KW:FALLEN}}: Summon 3 random non-{{RARITY:DETERMINATION}} ${doki.me(2)} from your dustpile. {{KW:DELAY}}: Kill then and lose 2 Max {{HP}} for each killed.`,
		//description: "{{KW:MAGIC}}: Burn 3 {{RARITY:EPIC}} {{KW:FALLEN}} monsters from your dustpile. Trigger their {{KW:FALLEN}} effects. {{KW:DUST}}: Add a random {{TRIBE:CHRSPELL}} to the bottom of your deck for each monster burned.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "LEGENDARY"
	});

	c.newCard({
		name: "{{PLURAL:$1|Club President Sayori|Club President Sayoris}}",
		image: "Club_President_Sayori",
		cost: 6,
		attack: 4,
		hp: 6,
		description: "{{KW:MAGIC}}: Fully heal all ally {{KW:FALLEN}} monsters and give them +1 {{ATK}}. {{KW:FALLEN}}: Force all enemy monsters to attack ally monsters in front of them.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "LEGENDARY"
	});

	// CHR Spells

	var sayori_chr = c.newCard({
		name: "{{PLURAL:$1|Sayori.chr|Sayori.chrs}}",
		image: "SayoriCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, burn this and draw a card.",
		description: "Heal 5 {{HP}} split among all damaged ally monsters. Excess healing is healed to you. Draw a card.",
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN"
	});

	var natsuki_chr = c.newCard({
		name: "{{PLURAL:$1|Natsuki.chr|Natsuki.chrs}}",
		image: "NatsukiCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Add a random 5-{{COST}} monster from your dustpile to your hand, give it -4 {{COST}}, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Burn a random 4 or 5 {{COST}} monster in your dustpile (prefer {{TRIBE:DOKI|2}}), add it to your hand, give it -2 {{COST}}, burn this and draw a card.",
		//description: "Look at all {{TRIBE:DOKI|2}} in your dustpile and choose one. Add it to your hand. Give it -2 {{COST}}. Draw a card.",
		//description: "Look at 3 random 4-{{COST}} cards in your dustpile and burn one. Add it to your hand. Give it -1 {{COST}}. Draw a card.",
		description: `Look at 3 random non-{{RARITY:DETERMINATION}} ${doki.me(3)} in your dustpile and choose one to add to the top of your deck with -1 {{cost}}. {{KW:DELAY}}: Draw 2 cards.`,
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN"
	});

	var yuri_chr = c.newCard({
		name: "{{PLURAL:$1|Yuri.chr|Yuri.chrs}}",
		image: "YuriCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Kill the enemy monster with the lowest {{HP}}, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Give the enemy monster with the liwest {{HP}} -4 {{HP}}, burn this and draw a card.",
		description: "Give an enemy monster -1/-2, then a random other enemy monster -1/-1. If there is only one enemy monster, draw a card.",
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN"
	});

	var monika_chr = c.newCard({
		name: "{{PLURAL:$1|Monika.chr|Monika.chrs}}",
		image: "MonikaCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Send a random ally and enemy non-{{RARITY:DETERMINATION}} monster from the board to their owners' hands, burn this and draw a card.",
		//description: "{{KW:TURBO}}: {{KW:SILENCE}} an enemy non-{{RARITY:DETERMINATION}} monster, burn this and draw a card.",
		description: "{{KW:SILENCE}} an enemy monster if its {{ATK}} was 4 or less. Otherwise, give it -3 {{ATK}}.",
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN"
	});
	
	var file_exp = c.newArtifact({
		name: "File Explorer", 
		image: "File_Explorer",
		description: `{{KW:TURN-END}}: If an ally monster died this turn, add the next ${chr_spells.me()} to the top of your deck. Whenever you summon a {{KW:FALLEN}} monster, if it's on the right, give it -2/-1 and trigger its {{KW:FALLEN}} effect. 
		Order of ${chr_spells.me(2)}: ${sayori_chr.me()} > ${natsuki_chr.me()} > ${yuri_chr.me()} > ${monika_chr.me()} > Start over.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Just Monika|Just Monikas}}",
		image: "Just_Monika_Breaking",
		background: "Just_Monika_Breaking_BG",
		cost: 11,
		attack: 6,
		hp: 9,
		description: `{{KW:MAGIC}}: Add the ${file_exp.me()} artifact. {{KW:DELAY}}: Add the next ${chr_spells.me()} to your hand if an ally {{KW:FALLEN}} monster died this turn.`,
		tribes: [doki],
		extension: "DDLC",
		typeSkin: 2,
		rarity: "DETERMINATION"
	});
	
})

export {};