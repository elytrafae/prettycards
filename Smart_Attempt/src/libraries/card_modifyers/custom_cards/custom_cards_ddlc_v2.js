
import {CustomCardsDictionary} from "/src/libraries/card_modifyers/custom_cards_dictionary.js"

// Extension

CustomCardsDictionary.AddCustomCardExtension(
	"BASE", 
	"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/BASE/", 
	"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/",
	"https://raw.githubusercontent.com/CMD-God/prettycards/master/audio/cards/BASE/",
);

// Tribes

CustomCardsDictionary.AddCustomTribe("DOKI", "{{PLURAL:$1|TribeName|TribeNames}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/DOKI.png");
CustomCardsDictionary.AddCustomTribe("CHRSPELL", "{{PLURAL:$1|SpellTribe|SpellTribes}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/CHRSPELL.png");

// Regular Cast

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #1|Idea #1s}}",
	image: "Sayori",
	cost: 4,
	attack: 5,
	hp: 4,
	description: "{{KW:MAGIC}}: Deal 2 {{DMG}} to adjacent ally monsters. {{KW:SACRIFICE}}: Give all {{TRIBE:DOKI|2}} in your hand +1 {{HP}}.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #2|Idea #2s}}",
	image: "Natsuki",
	cost: 3,
	attack: 3,
	hp: 3,
	description: "Force an ally {{KW:SACRIFICE}} monster to attack the monster in front of it.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #3|Idea #3s}}",
	image: "Yuri",
	cost: 3,
	attack: 3,
	hp: 2,
	description: "{{KW:MAGIC}}: Give an enemy monster {{KR}}. {{KW:SACRIFICE}}: If it's alive, give it -2 {{ATK}}. Otherwise give -1 {{ATK}} to a random enemy monster.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #4|Idea #4s}}",
	image: "Monika",
	cost: 7,
	attack: 4,
	hp: 6,
	description: "{{KW:TAUNT}}. {{KW:SACRIFICE}}: Give the top 3 {{KW:SACRIFICE}} monsters in your deck -1 {{cost}}.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "RARE"
});

// Amy Sprite Sheet by u/Meddy-sin
CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #5|Idea #5s}}",
	image: "Amy",
	cost: 4,
	attack: 5,
	hp: 2,
	//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
	description: "{{KW:MAGIC}}: Kill an ally {{KW:SACRIFICE}} monster to deal their {{HP}} as {{DMG}} to yourself and trigger its {{KW:SACRIFICE}} effect. {{KW:SACRIFICE}}: Add a copy of it to your deck with -1 {{cost}}.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "RARE"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Alphys's PC|Alphys's PCs}}",
	image: "Alphys_PC",
	cost: 6,
	attack: 5,
	hp: 7,
	description: "Look at 3 random non-{{RARITY:DETERMINATION}} {{TRIBE:DOKI|2}} you don't have in your deck and choose one to catch. {{KW:DUST}}: Release it into your deck.",
	extension: "BASE",
	rarity: "RARE"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Anime Poster|Anime Posters}}",
	image: "Anime_Poster",
	cost: 5,
	attack: 4,
	hp: 4,
	description: "Look at 3 random {{TRIBE:DOKI|2}} (rarity <= non-{{RARITY:EPIC}}) and choose one. {{KW:DELAY}}: Summon it for both players and force yours to attack the enemy one.",
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #6|Idea #6s}}",
	image: "Depressed_Sayori",
	cost: 4,
	attack: 3,
	hp: 2,
	description: "{{KW:MAGIC}}: Fully heal an ally {{KW:SACRIFICE}} monster to heal double the amount healed to you. {{KW:SACRIFICE}}: Trigger the {{KW:SACRIFICE}} effect of a random {{KW:SACRIFICE}} monster in your hand and return it to your deck with +1/-1.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #7|Idea #7s}}",
	image: "Obsessed_Yuri",
	cost: 7,
	attack: 6,
	hp: 5,
	//armor: true,
	description: "{{KW:MAGIC}}: Target an ally {{KW:SACRIFICE}} monster. {{KW:DELAY}}: If it's dead, {{KW:SILENCE}} and deal 3 {{DMG}} and give {{KR}} to the monster in front of it.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #8|Idea #8s}}",
	image: "Corrupted_Natsuki",
	cost: 6,
	attack: 3,
	hp: 7,
	//haste: true,
	//description: "{{KW:HASTE}}. {{KW:SACRIFICE}}: If this killed an enemy monster, deal the excess {{DMG}} this received to the enemy player.",
	description: "{{KW:TAUNT}}. Whenever this is damaged by a monster, give it {{KR}}. {{KW:SACRIFICE}}: Add a random {{TRIBE:DOKI}} from your dustpile back to your hand with -1 {{cost}} and {{KR}}.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #9|Idea #9s}}",
	image: "Club_President_Monika",
	cost: 8,
	attack: 5,
	hp: 9,
	description: "{{KW:SACRIFICE}}: Summon 3 random non-{{RARITY:DETERMINATION}} {{TRIBE:DOKI|2}} from your dustpile. {{KW:DELAY}}: Kill then and lose 2 Max {{HP}} for each killed.",
	//description: "{{KW:MAGIC}}: Burn 3 {{RARITY:EPIC}} {{KW:SACRIFICE}} monsters from your dustpile. Trigger their {{KW:SACRIFICE}} effects. {{KW:DUST}}: Add a random {{TRIBE:CHRSPELL}} to the bottom of your deck for each monster burned.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #10|Idea #10s}}",
	image: "Club_President_Sayori",
	cost: 6,
	attack: 4,
	hp: 6,
	description: "{{KW:MAGIC}}: Fully heal all ally {{KW:SACRIFICE}} monsters. {{KW:DELAY}}: Give them +1 {{ATK}}. {{KW:SACRIFICE}}: Give all enemy monsters +1 {{HP}} and force them to attack ally {{KW:SACRIFICE}} monsters in front of them.",
	tribes: ["DOKI"],
	extension: "BASE",
	rarity: "LEGENDARY"
});

// CHR Spells

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #11|Idea #11s}}",
	image: "SayoriCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, burn this and draw a card.",
	//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, burn this and draw a card.",
	description: "Heal 5 {{HP}} split among all damaged ally monsters. Excess healing is healed to you. Draw a card.",
	tribes: ["CHRSPELL"],
	extension: "BASE",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #12|Idea #12s}}",
	image: "NatsukiCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Add a random 5-{{COST}} monster from your dustpile to your hand, give it -4 {{COST}}, burn this and draw a card.",
	//description: "{{KW:TURBO}}: Burn a random 4 or 5 {{COST}} monster in your dustpile (prefer {{TRIBE:DOKI|2}}), add it to your hand, give it -2 {{COST}}, burn this and draw a card.",
	//description: "Look at all {{TRIBE:DOKI|2}} in your dustpile and choose one. Add it to your hand. Give it -2 {{COST}}. Draw a card.",
	//description: "Look at 3 random 4-{{COST}} cards in your dustpile and burn one. Add it to your hand. Give it -1 {{COST}}. Draw a card.",
	description: "Look at 3 random non-{{RARITY:DETERMINATION}} {{TRIBE:DOKI|2}} in your dustpile and choose one to add to the top of your deck with -1 {{cost}}. {{KW:DELAY}}: Draw 2 cards.",
	tribes: ["CHRSPELL"],
	extension: "BASE",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #13|Idea #13s}}",
	image: "YuriCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Kill the enemy monster with the lowest {{HP}}, burn this and draw a card.",
	//description: "{{KW:TURBO}}: Give the enemy monster with the liwest {{HP}} -4 {{HP}}, burn this and draw a card.",
	description: "Give an enemy monster -1/-2, then a random other enemy monster -1/-1. If there is only one enemy monster, draw a card.",
	tribes: ["CHRSPELL"],
	extension: "BASE",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #14|Idea #14s}}",
	image: "MonikaCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Send a random ally and enemy non-{{RARITY:DETERMINATION}} monster from the board to their owners' hands, burn this and draw a card.",
	//description: "{{KW:TURBO}}: {{KW:SILENCE}} an enemy non-{{RARITY:DETERMINATION}} monster, burn this and draw a card.",
	description: "{{KW:SILENCE}} an enemy monster if its {{ATK}} was 4 or less. Otherwise, give it -3 {{ATK}}.",
	tribes: ["CHRSPELL"],
	extension: "BASE",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomArtifact("Placeholder", 
	`{{KW:TURN-END}}: If an ally monster died this turn, add the next {{TRIBE:CHRSPELL}} to the top of your deck. Whenever you summon a {{KW:SACRIFICE}} monster, if it's on the right, give it -2/-1 and trigger its {{KW:SACRIFICE}} effect. 
	
	Order of {{TRIBE:CHRSPELL|2}}: ${CustomCardsDictionary.DescriptionCard("Idea #11", 1)} > ${CustomCardsDictionary.DescriptionCard("Idea #12", 1)} > ${CustomCardsDictionary.DescriptionCard("Idea #13", 1)} > ${CustomCardsDictionary.DescriptionCard("Idea #14", 1)} > Start over.`
);

// Advanced Dokis

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Idea #15|Idea #15s}}",
	image: "Just_Monika_Breaking",
	background: "Just_Monika_Breaking_BG",
	cost: 11,
	attack: 6,
	hp: 9,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("Placeholder") + " artifact. {{KW:DELAY}}: Add the next {{TRIBE:CHRSPELL}} to your hand if an ally {{KW:SACRIFICE}} monster died this turn.",
	tribes: ["DOKI"],
	extension: "BASE",
	typeSkin: 2,
	rarity: "DETERMINATION"
});

export {};