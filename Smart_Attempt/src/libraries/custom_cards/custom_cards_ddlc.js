
import {CustomCardsDictionary} from "/src/libraries/custom_cards/custom_cards_dictionary.js"

// Extension

CustomCardsDictionary.AddCustomCardExtension("DDLC", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/DDLC/", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/DDLC/");

// Tribes

CustomCardsDictionary.AddCustomTribe("CHIBI", "{{PLURAL:$1|Chibi|Chibis}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/CHIBI.png");
CustomCardsDictionary.AddCustomTribe("DOKI", "{{PLURAL:$1|Doki|Dokis}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/DOKI.png");
CustomCardsDictionary.AddCustomTribe("CHRSPELL", "{{PLURAL:$1|.chr spell|.chr spells}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/CHRSPELL.png");
CustomCardsDictionary.AddCustomTribe("YURIKNIFE", "{{PLURAL:$1|Yuri\'s Knife|Yuri\'s Knives}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/YURIKNIFE.png");

// Chibis

CustomCardsDictionary.AddCustomArtifact("Chibi Power", `The counter starts at 0. All ally {{TRIBE:CHIBI|2}} have +1/+1/+1 wherever they are per counter.`);

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Sayori|Chibi Sayoris}}",
	image: "Chibi_Sayori",
	cost: 3,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibi Power") + " artifact, increase its counter by 1, and clear all negative effects from all ally monsters.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Natsuki|Chibi Natsukis}}",
	image: "Chibi_Natsuki",
	cost: 4,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibi Power") + " artifact, increase its counter by 1, and give +3 {{HP}} to an ally monster.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Yuri|Chibi Yuris}}",
	image: "Chibi_Yuri",
	cost: 4,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibi Power") + " artifact, increase its counter by 1, and give +2 {{ATK}} to an ally monster.",
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
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibi Power") + " artifact, increase its counter by 1, and add a copy of all other ally {{TRIBE:CHIBI|2}} to your hand.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi Amy|Chibi Amys}}",
	image: "Chibi_Amy",
	cost: 4,
	attack: 2,
	hp: 2,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibi Power") + " artifact, increase its counter by 1, and summon a {{CARD:115}}.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Chibi MC|Chibi MCs}}",
	image: "Chibi_MC",
	cost: 5,
	attack: 2,
	hp: 2,
	taunt: true,
	description: "{{KW:TAUNT}}. {{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibi Power") + " artifact, increase its counter by 1, give another ally {{TRIBE:CHIBI|1}} {{KW:TAUNT}}.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomArtifact("Chibify", `All other ally cards are {{TRIBE:CHIBI|2}}, too, wherever they are.`);

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Just Chibi Monika|Just Chibi Monikas}}",
	image: "Just_Chibi_Monika",
	cost: 6,
	attack: 3,
	hp: 2,
	description: "{{KW:DELAY}}: 3 random {{TRIBE:CHIBI|2}} in your hand get -2 {{cost}}. {{KW:NEED}}: You have 6 or more {{TRIBE:CHIBI|2}} in your dustpile. {{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Chibify") + " artifact.",
	tribes: ["CHIBI"],
	extension: "DDLC",
	rarity: "LEGENDARY"
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
	description: "Heal for 4 {{HP}} to a damaged ally or deal 3 {{DMG}} to an enemy monster.",
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

// MC Sprites by Childish-N
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

// CHR Spells

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

// Yuri's Knives

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 1|Yuri's Knives 1}}",
	image: "Yuri_Knife_1",
	cost: 1,
	description: "Deal 4 {{DMG}} to yourself and give an ally monster +2/+2. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 2|Yuri's Knives 2}}",
	image: "Yuri_Knife_2",
	cost: 1,
	description: "Deal 4 {{DMG}} to yourself and give an enemy monster -1/-2. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 3|Yuri's Knives 3}}",
	image: "Yuri_Knife_3",
	cost: 1,
	description: "Deal 6 {{DMG}} to yourself and deal 3 {{DMG}} to all enemies. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 4|Yuri's Knives 4}}",
	image: "Yuri_Knife_4",
	cost: 1,
	description: "Deal 3 {{DMG}} to yourself and give an ally monster {{KW:HASTE}} and +3 {{ATK}}. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 5|Yuri's Knives 5}}",
	image: "Yuri_Knife_5",
	cost: 1,
	description: "Deal 3 {{DMG}} to yourself and {{KW:PARALYZE}} an enemy monster. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 6|Yuri's Knives 6}}",
	image: "Yuri_Knife_6",
	cost: 1,
	description: "Deal 3 {{DMG}} to yourself and give all ally monsters +2 {{HP}}. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 7|Yuri's Knives 7}}",
	image: "Yuri_Knife_7",
	cost: 1,
	description: "Deal 2 {{DMG}} to yourself, remove all negative effects off of all allies and restore their base positive effects (except Second Life). Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 8|Yuri's Knives 8}}",
	image: "Yuri_Knife_8",
	cost: 1,
	description: "Deal 3 {{DMG}} to yourself and give an ally monster {{KW:TAUNT}} and +4 {{HP}}. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 9|Yuri's Knives 9}}",
	image: "Yuri_Knife_9",
	cost: 1,
	description: "Deal 4 {{DMG}} to yourself and make an ally monster {{KW:INVULNERABLE}} this turn. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri's Knife 10|Yuri's Knives 10}}",
	image: "Yuri_Knife_10",
	cost: 1,
	description: "Deal 6 {{DMG}} to yourself to add a base copy of a non-{{RARITY:TOKEN}} ally monster to your hand. If it's a {{RARITY:DETERMINATION}} card, deal 10 {{DMG}} instead. Draw a card.",
	tribes: ["YURIKNIFE"],
	extension: "DDLC",
	rarity: "TOKEN"
});

// Advanced Dokis

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Just Monika|Just Monikas}}",
	image: "Just_Monika_Breaking",
	background: "Just_Monika_Breaking_BG",
	cost: 9,
	attack: 6,
	hp: 6,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("File Explorer") + " artifact. Whenever you summon a monster, trigger its {{KW:SUICIDE}} effect.",
	extension: "DDLC",
	typeSkin: 2,
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
	hp: 7,
	//armor: true,
	description: "Whenever this takes {{DMG}}, shuffle a random {{TRIBE:YURIKNIFE}} into your deck. {{KW:SUICIDE}}: Cast 3 random {{TRIBE:YURIKNIFE|2}} on random targets.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Corrupted Natsuki|Corrupted Natsukis}}",
	image: "Corrupted_Natsuki",
	cost: 8,
	attack: 9,
	hp: 2,
	//haste: true,
	//description: "{{KW:HASTE}}. {{KW:SUICIDE}}: If this killed an enemy monster, deal the excess {{DMG}} this received to the enemy player.",
	description: "{{KW:MAGIC}}: Cast 3 " + CustomCardsDictionary.DescriptionCard("Cupcake", 2) + " on other random monsters. {{KW:SUICIDE}}: Attack the monster in front of this.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Club President Monika|Club President Monikas}}",
	image: "Club_President_Monika",
	cost: 6,
	attack: 5,
	hp: 4,
	description: "{{KW:MAGIC}}: Burn up to 4 {{KW:SUICIDE}} monsters from your dustpile. Trigger their {{KW:SUICIDE}} effects (as if they belonged to this card).",
	//description: "{{KW:MAGIC}}: Burn 3 {{RARITY:EPIC}} {{KW:SUICIDE}} monsters from your dustpile. Trigger their {{KW:SUICIDE}} effects. {{KW:DUST}}: Add a random {{TRIBE:CHRSPELL}} to the bottom of your deck for each monster burned.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Traumatized MC|Traumatized MCs}}",
	image: "Traumatized_MC",
	cost: 6,
	attack: 4,
	hp: 4,
	taunt: true,
	description: "{{KW:TAUNT}}. {{KW:DUST}}: Summon a random {{TRIBE:DOKI}} and trigger its {{KW:SUICIDE}} or {{KW:DUST}} effect.",
	//description: "{{KW:SUICIDE}} monsters cost 1 less. {{KW:DUST}}: Summon a random {{TRIBE:DOKI}} and trigger its {{KW:SUICIDE}} or {{KW:DUST}} effect.",
	extension: "DDLC",
	rarity: "LEGENDARY"
});

// Half-Canon

// Amy Sprite Sheet by u/Meddy-sin
CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Amy|Amys}}",
	image: "Amy",
	cost: 7,
	attack: 4,
	hp: 5,
	//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
	description: "Whenever you summon an {{TRIBE:ARACHNID}} make it {{KW:INVULNERABLE}} this turn. {{KW:DUST}}: Fill your board with {{CARD:115|2}}.",
	extension: "DDLC",
	rarity: "EPIC"
});

export {};