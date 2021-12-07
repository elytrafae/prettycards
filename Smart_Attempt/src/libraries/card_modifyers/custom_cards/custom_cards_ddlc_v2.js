
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

// Extension

/*
CustomCardsDictionary.AddCustomCardExtension(
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
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/DDLC/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/"
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
	
	c.newTribe({
		name: "{{PLURAL:$1|CHR Spell test|CHR Spells test}}",
		image: "CHRSPELL",
		id: "CHRSPELL"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Sayori|Sayoris}}",
		image: "Sayori",
		cost: 4,
		attack: 5,
		hp: 4,
		description: "{{KW:MAGIC}}: Deal 2 {{DMG}} to adjacent ally monsters. {{KW:FALLEN}}: Give all {{TRIBE:DOKI|2}} in your hand +1 {{HP}}.",
		tribes: [doki, "FROGGIT"],
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
	
	c.newArtifact({
		name: "File Explorer", 
		image: "File_Explorer",
		description: `{{KW:TURN-END}}: If an ally monster died this turn, add the next ${chr_spells.mention()} to the top of your deck. Whenever you summon a {{KW:FALLEN}} monster, if it's on the right, give it -2/-1 and trigger its {{KW:FALLEN}} effect. \nOrder of ${chr_spells.mention(2)}: `
	});
	
})

/*
// Tribes

CustomCardsDictionary.AddCustomTribe("DOKI", "{{PLURAL:$1|Doki|Dokis}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/DOKI.png");
CustomCardsDictionary.AddCustomTribe("CHRSPELL", "{{PLURAL:$1|CHR Spell|CHR Spells}}", "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/CHRSPELL.png");

// Regular Cast

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Sayori|Sayoris}}",
	image: "Sayori",
	cost: 4,
	attack: 5,
	hp: 4,
	description: "{{KW:MAGIC}}: Deal 2 {{DMG}} to adjacent ally monsters. {{KW:FALLEN}}: Give all {{TRIBE:DOKI|2}} in your hand +1 {{HP}}.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Natsuki|Natsukis}}",
	image: "Natsuki",
	cost: 3,
	attack: 3,
	hp: 3,
	description: "Force an ally {{KW:FALLEN}} monster to attack the monster in front of it.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri|Yuris}}",
	image: "Yuri",
	cost: 3,
	attack: 3,
	hp: 2,
	description: "{{KW:MAGIC}}: {{KW:PARALYZE}} an enemy monster. {{KW:FALLEN}}: If it's alive, give it -2 {{ATK}}. Otherwise give -1 {{ATK}} to a random enemy monster.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Monika|Monikas}}",
	image: "Monika",
	cost: 7,
	attack: 4,
	hp: 6,
	description: "{{KW:TAUNT}}. {{KW:FALLEN}}: Give the top 3 {{KW:FALLEN}} monsters in your deck -1 {{cost}}.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "RARE"
});

// Amy Sprite Sheet by u/Meddy-sin
CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Amy|Amys}}",
	image: "Amy",
	cost: 4,
	attack: 5,
	hp: 2,
	//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
	description: "{{KW:MAGIC}}: Kill an ally {{KW:FALLEN}} monster to deal their {{HP}} as {{DMG}} to yourself and trigger its {{KW:FALLEN}} effect. {{KW:FALLEN}}: Add a copy of it to your deck with -1 {{cost}}.",
	tribes: ["DOKI"],
	extension: "DDLC",
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
	description: "Look at 3 random {{TRIBE:DOKI|2}} (rarity <= {{RARITY:EPIC}}) and choose one. {{KW:DELAY}}: Summon it for both players and force yours to attack the enemy one.",
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Depressed Sayori|Depressed Sayoris}}",
	image: "Depressed_Sayori",
	cost: 4,
	attack: 3,
	hp: 2,
	description: "{{KW:MAGIC}}: An ally {{KW:FALLEN}} monster can attack another monster. {{KW:FALLEN}}: Trigger the effect of a random {{KW:FALLEN}} monster in your hand and return it to your deck with +1/-1.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Obsessed Yuri|Obsessed Yuris}}",
	image: "Obsessed_Yuri",
	cost: 7,
	attack: 6,
	hp: 5,
	//armor: true,
	description: "{{KW:MAGIC}}: Target an ally {{KW:FALLEN}} monster. {{KW:DELAY}}: If it's dead, {{KW:SILENCE}} and deal 3 {{DMG}} and give -2 {{ATK}} to the monster in front of it.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Corrupted Natsuki|Corrupted Natsukis}}",
	image: "Corrupted_Natsuki",
	cost: 5,
	attack: 4,
	hp: 4,
	//haste: true,
	//description: "{{KW:HASTE}}. {{KW:FALLEN}}: If this killed an enemy monster, deal the excess {{DMG}} this received to the enemy player.",
	description: "{{KW:TRANSPARENCY}}. {{KW:FALLEN}}: Add a random {{TRIBE:DOKI}} from your dustpile back to your hand with -1 {{cost}} and -2 {{HP}}.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Club President Monika|Club President Monikas}}",
	image: "Club_President_Monika",
	cost: 8,
	attack: 5,
	hp: 9,
	description: "{{KW:FALLEN}}: Summon 3 random non-{{RARITY:DETERMINATION}} {{TRIBE:DOKI|2}} from your dustpile. {{KW:DELAY}}: Kill then and lose 2 Max {{HP}} for each killed.",
	//description: "{{KW:MAGIC}}: Burn 3 {{RARITY:EPIC}} {{KW:FALLEN}} monsters from your dustpile. Trigger their {{KW:FALLEN}} effects. {{KW:DUST}}: Add a random {{TRIBE:CHRSPELL}} to the bottom of your deck for each monster burned.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "LEGENDARY"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Club President Sayori|Club President Sayoris}}",
	image: "Club_President_Sayori",
	cost: 6,
	attack: 4,
	hp: 6,
	description: "{{KW:MAGIC}}: Fully heal all ally {{KW:FALLEN}} monsters and give them +1 {{ATK}}. {{KW:FALLEN}}: Force all enemy monsters to attack ally monsters in front of them.",
	tribes: ["DOKI"],
	extension: "DDLC",
	rarity: "LEGENDARY"
});

// CHR Spells

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Sayori.chr|Sayori.chrs}}",
	image: "SayoriCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, burn this and draw a card.",
	//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, burn this and draw a card.",
	description: "Heal 5 {{HP}} split among all damaged ally monsters. Excess healing is healed to you. Draw a card.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Natsuki.chr|Natsuki.chrs}}",
	image: "NatsukiCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Add a random 5-{{COST}} monster from your dustpile to your hand, give it -4 {{COST}}, burn this and draw a card.",
	//description: "{{KW:TURBO}}: Burn a random 4 or 5 {{COST}} monster in your dustpile (prefer {{TRIBE:DOKI|2}}), add it to your hand, give it -2 {{COST}}, burn this and draw a card.",
	//description: "Look at all {{TRIBE:DOKI|2}} in your dustpile and choose one. Add it to your hand. Give it -2 {{COST}}. Draw a card.",
	//description: "Look at 3 random 4-{{COST}} cards in your dustpile and burn one. Add it to your hand. Give it -1 {{COST}}. Draw a card.",
	description: "Look at 3 random non-{{RARITY:DETERMINATION}} {{TRIBE:DOKI|2}} in your dustpile and choose one to add to the top of your deck with -1 {{cost}}. {{KW:DELAY}}: Draw 2 cards.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Yuri.chr|Yuri.chrs}}",
	image: "YuriCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Kill the enemy monster with the lowest {{HP}}, burn this and draw a card.",
	//description: "{{KW:TURBO}}: Give the enemy monster with the liwest {{HP}} -4 {{HP}}, burn this and draw a card.",
	description: "Give an enemy monster -1/-2, then a random other enemy monster -1/-1. If there is only one enemy monster, draw a card.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Monika.chr|Monika.chrs}}",
	image: "MonikaCHR",
	cost: 0,
	//description: "{{KW:TURBO}}: Send a random ally and enemy non-{{RARITY:DETERMINATION}} monster from the board to their owners' hands, burn this and draw a card.",
	//description: "{{KW:TURBO}}: {{KW:SILENCE}} an enemy non-{{RARITY:DETERMINATION}} monster, burn this and draw a card.",
	description: "{{KW:SILENCE}} an enemy monster if its {{ATK}} was 4 or less. Otherwise, give it -3 {{ATK}}.",
	tribes: ["CHRSPELL"],
	extension: "DDLC",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomArtifact("File Explorer", 
	`{{KW:TURN-END}}: If an ally monster died this turn, add the next {{TRIBE:CHRSPELL}} to the top of your deck. Whenever you summon a {{KW:FALLEN}} monster, if it's on the right, give it -2/-1 and trigger its {{KW:FALLEN}} effect. 
	
	Order of {{TRIBE:CHRSPELL|2}}: ${CustomCardsDictionary.DescriptionCard("Sayori.chr", 1)} > ${CustomCardsDictionary.DescriptionCard("Natsuki.chr", 1)} > ${CustomCardsDictionary.DescriptionCard("Yuri.chr", 1)} > ${CustomCardsDictionary.DescriptionCard("Monika.chr", 1)} > Start over.`
);

// Advanced Dokis

CustomCardsDictionary.AddCustomCard({
	name: "{{PLURAL:$1|Just Monika|Just Monikas}}",
	image: "Just_Monika_Breaking",
	background: "Just_Monika_Breaking_BG",
	cost: 11,
	attack: 6,
	hp: 9,
	description: "{{KW:MAGIC}}: Add the " + CustomCardsDictionary.DescriptionArtifact("File Explorer") + " artifact. {{KW:DELAY}}: Add the next {{TRIBE:CHRSPELL}} to your hand if an ally {{KW:FALLEN}} monster died this turn.",
	tribes: ["DOKI"],
	extension: "DDLC",
	typeSkin: 2,
	rarity: "DETERMINATION"
});
*/
export {};