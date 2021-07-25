
import {CustomCardsDictionary} from "/src/libraries/custom_cards/custom_cards_dictionary.js"

// Chibis

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Sayori|Chibi Sayoris}}",
	image: "Chibi_Sayori",
	cost: 3,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and clear all negative effects from all ally monsters.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Natsuki|Chibi Natsukis}}",
	image: "Chibi_Natsuki",
	cost: 3,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +3 {{HP}} to an ally monster.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Yuri|Chibi Yuris}}",
	image: "Chibi_Yuri",
	cost: 3,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and give +2 {{ATK}} to an ally monster.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Monika|Chibi Monikas}}",
	image: "Chibi_Monika",
	cost: 5,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: All {{TRIBE:CHIBI|2}} get +1/+1/+1 for the rest of the game, and add a copy of all other ally {{TRIBE:CHIBI|2}} to your hand.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

// Regular Cast

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Sayori|Sayoris}}",
	image: "Sayori",
	cost: 4,
	attack: 3,
	hp: 3,
	description: "{{KW:MAGIC}}: Draw a {{TRIBE:DOKI|1}} from your deck. {{KW:SUICIDE}}: Deal 1 {{DMG}} to all enemy monsters. Damaged targets get -3 Max {{HP}} instead.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Cupcake|Cupcakes}}",
	image: "Cupcake",
	cost: 1,
	description: "Heal for 4 {{HP}} to an ally or deal 3 {{DMG}} to an enemy monster.",
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Natsuki|Natsukis}}",
	image: "Natsuki",
	cost: 4,
	attack: 3,
	hp: 4,
	description: "{{KW:MAGIC}}: Add two " + CustomCardsDictionary.DescriptionCard("Cupcake", 2) + " to your hand. {{KW:SUICIDE}}: Deal 5 {{DMG}} to the monster in front of this.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri|Yuris}}",
	image: "Yuri",
	cost: 5,
	attack: 4,
	hp: 3,
	description: "Whenever this survives {{DMG}}, give this +1 {{HP}}. {{KW:SUICIDE}}: {{KW:PARALYZE}} all ally monsters, then {{KW:PARALYZE}} a random unparalyzed enemy monster for each paralyzed ally monster.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Monika|Monikas}}",
	image: "Monika",
	cost: 5,
	attack: 3,
	hp: 3,
	description: "{{KW:MAGIC}}: Kill an ally {{TRIBE:DOKI|1}} to summon another " + CustomCardsDictionary.DescriptionSelfCard() + ". {{KW:DUST}}: Add another random {{TRIBE:DOKI|1}} to your hand with -2 {{COST}}.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Main Character|Main Characters}}",
	image: "Protagonist",
	cost: 6,
	attack: 3,
	hp: 7,
	taunt: true,
	description: "{{KW:TAUNT}}. {{KW:TURN-END}}: Add a copy of every unique monster to your deck whose {{KW:SUICIDE}} effect was triggered this turn.",
	//tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

/*
CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Just Monika|Just Monikas}}",
	image: "Just_Monika",
	cost: 9,
	attack: 6,
	hp: 6,
	description: "{{KW:MAGIC}}: Shuffle all the {{TRIBE:CHRSPELL|2}} into your deck. {{KW:SUICIDE}} effects trigger an additional time.",
	extension: "DDLC",
	rarity: "DETERMINATION"
});
*/

// Just Monika

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Sayori.chr|Sayori.chrs}}",
	image: "SayoriCHR",
	cost: 0,
	description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, burn this and draw a card.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Natsuki.chr|Natsuki.chrs}}",
	image: "NatsukiCHR",
	cost: 0,
	description: "{{KW:TURBO}}: Add a random 5-{{COST}} monster from your dustpile to your hand, give it -4 {{COST}}, burn this and draw a card.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri.chr|Yuri.chrs}}",
	image: "YuriCHR",
	cost: 0,
	description: "{{KW:TURBO}}: Kill the enemy monster with the lowest {{HP}}, burn this and draw a card.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Monika.chr|Monika.chrs}}",
	image: "MonikaCHR",
	cost: 0,
	description: "{{KW:TURBO}}: Send a random ally and enemy non-{{RARITY:DETERMINATION}} monster from the board to their owners' hands, burn this and draw a card.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomArtifact("File Explorer", 
	`{{KW:TURN-END}}: If a monster died this turn, add the next {{TRIBE:CHRSPELL|1}} to the top of your deck. Add an additional one for every ally {{KW:SUICIDE}} effect triggered this turn. 
	
	Order of {{TRIBE:CHRSPELL|2}}: ${CustomCardsDictionary.DescriptionCard("Sayori.chr", 1)} > ${CustomCardsDictionary.DescriptionCard("Natsuki.chr", 1)} > ${CustomCardsDictionary.DescriptionCard("Yuri.chr", 1)} > ${CustomCardsDictionary.DescriptionCard("Monika.chr", 1)} > Start over.`
);

// Advanced Dokis

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Just Monika|Just Monikas}}",
	image: "Just_Monika_Full",
	cost: 9,
	attack: 6,
	hp: 6,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("File Explorer") + " artifact. Whenever you summon a monster, trigger its {{KW:SUICIDE}} effect.",
	extension: "DDLC",
	typeSkin: 1,
	rarity: "DETERMINATION"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Sad Sayori|Sad Sayoris}}",
	image: "Depressed_Sayori",
	cost: 6,
	attack: 2,
	hp: 5,
	description: "{{KW:MAGIC}}: Enemies cannot be healed or receive extra {{HP}} until the start of your next turn. {{KW:SUICIDE}}: Give +3 {{HP}} to every ally.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Club President Sayori|Club President Sayoris}}",
	image: "Club_President_Sayori",
	cost: 8,
	attack: 6,
	hp: 6,
	description: "{{KW:MAGIC}}: Kill all ally monsters. Shuffle two random {{TRIBE:CHRSPELL|2}} into your deck for each of them.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Obsessed Yuri|Obsessed Yuris}}",
	image: "Obsessed_Yuri",
	cost: 8,
	attack: 4,
	hp: 5,
	armor: true,
	description: "{{KW:ARMOR}}. Whenever this takes {{DMG}}, shuffle a random {{TRIBE:YURIKNIFE}} into your deck. {{KW:SUICIDE}}: Cast 3 random {{TRIBE:YURIKNIFE|2}} on random targets.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Corrupted Natsuki|Corrupted Natsukis}}",
	image: "Corrupted_Natsuki",
	cost: 10,
	attack: 8,
	hp: 2,
	haste: true,
	description: "{{KW:HASTE}}. {{KW:SUICIDE}}: If this killed an enemy monster, deal the excess {{DMG}} this received to the enemy player.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Club President Monika|Club President Monikas}}",
	image: "Club_President_Monika",
	cost: 5,
	attack: 4,
	hp: 4,
	description: "{{KW:MAGIC}}: Burn 3 {{RARITY:EPIC}} {{KW:SUICIDE}} monsters from your dustpile. Trigger their {{KW:SUICIDE}} effects. {{KW:DUST}}: Add a random {{TRIBE:CHRSPELL}} to the bottom of your deck for each monster burned.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

export {};