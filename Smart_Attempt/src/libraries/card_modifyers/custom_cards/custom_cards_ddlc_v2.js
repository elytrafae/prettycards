
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Doki Doki Literature Club Set",
		author: "CMD_God",
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/DDLC/",
		cardSongPrefix: "https://github.com/CMD-God/prettycards/raw/master/audio/cards/DDLC/",
		rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		aprilCardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/DDLC/aprilFools/",
		aprilArtifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/aprilFools/",
		//universalCustomFont: "Aller",
		note: `This is a Doki Doki Literature Club themed card set I wanted to make for the longest time. I wanted it to be perfect, so I often modified it, asked for feedback and even the custom cards idea was born because of this set. So, please enjoy and don't be afraid to give me feedback! ^^
		<br><br>
		NOTE: Hand nerfs cannot bring a monster below 1 HP. I didn't add this in every instance because some cards are full enough already.`
	});
	
	var font_name = c.loadFont("Aller", "https://raw.githubusercontent.com/CMD-God/prettycards/master/fonts/Aller_Rg.ttf");
	c.universalCustomFont = font_name;

	var frame = c.newFrame({
		id: "DDLC",
		monsterImage: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/DDLC/frame_monster.png",
		spellImage: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/DDLC/frame_spell.png"
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
	
	var fallen = c.newKeyword({
		name: "Fallen",
		description: "This effect triggers when this monster dies during its owner's turn.",
		id: "FALLEN"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Sayori|Sayoris}}",
		image: "Sayori",
		aprilImage: "Sayori",
		cost: 3,
		attack: 3,
		hp: 3,
		description: `{{KW:MAGIC}}: Kill an ally monster to gain {{KW:HASTE}}. ${fallen.me()}: Give 3 ${doki.me(2)} in your hand and 2 in your deck +2/-1.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "COMMON",
		frameSkinName: frame,
		note: `One of the textbook examples of this tribe (or, at least, the old direction I wanted to take with it). <br><br>It has slightly better than average stats with an either negligable or useful side effect and a slightly weak ${fallen.me()} effect, which serves to make it easier for these monsters to trade. <br><br>I was thinking of modifying her slightly, but I am really unsure if I want that.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Natsuki|Natsukis}}",
		image: "Natsuki",
		aprilImage: "Natsuki",
		cost: 3,
		attack: 3,
		hp: 3,
		description: `{{KW:MAGIC}}: Force an ally ${fallen.me()} monster to attack the monster in front of it.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "COMMON",
		frameSkinName: frame,
		note: `Simple, effective, powerful. This is the main activator of the tribe. While it IS tribed old Politics Bear, this card fits here too perfectly to warrant changing it.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Yuri|Yuris}}",
		image: "Yuri",
		aprilImage: "Yuri",
		cost: 4,
		attack: 4,
		hp: 5,
		description: `{{KW:MAGIC}}: Deal this card's {{HP}} buffs or nerfs as {{DMG}} to a monster. ${fallen.me()}: Give the highest {{ATK}} enemy monster -2/-1.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "COMMON",
		frameSkinName: frame,
		note: `Originally created around anti-ping and {{KW:PARALYZE}}, then {{KW:KR}}. Now I feel like she sits at a pretty good spot with a choice system built into her ${fallen.me()} effect.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Monika|Monikas}}",
		image: "Monika",
		aprilImage: "Monika",
		cost: 7,
		attack: 4,
		hp: 6,
		taunt: true,
		description: `{{KW:TAUNT}}. {{KW:DUST}}: Give the top 5 ${doki.me(2)} in your deck -1 {{cost}}.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "RARE",
		frameSkinName: frame,
		note: `The tribe's {{KW:TAUNT}}. I am unsure how well she would perform, but she's hardly a bad {{KW:TAUNT}}, so she can offer protection to other ${fallen.me()} monsters with stronger effects.`
	});
	
	// Amy Sprite Sheet by u/Meddy-sin
	c.newCard({
		name: "{{PLURAL:$1|Amy|Amys}}",
		image: "Amy",
		aprilImage: "Amy",
		cost: 4,
		attack: 4,
		hp: 3,
		//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
		description: `{{KW:MAGIC}}: Kill an ally ${fallen.me()} monster to trigger its ${fallen.me()} effect. ${fallen.me()}: Add a copy of it to your deck with -1 {{cost}}.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "RARE",
		frameSkinName: frame,
		note: `One of the more complicated cards, but basically it's a double ${fallen.me()} trigger, and it can give you back copies of the cards. Pure value!`
	});

	c.newCard({
		name: "{{PLURAL:$1|Main Character|Main Characters}}",
		image: "Protagonist",
		// aprilImage: "Protagonist",
		cost: 5,
		attack: 3,
		hp: 5,
		taunt: true,
		//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
		description: `{{KW:TAUNT}}. {{KW:MAGIC}}: If this has 3- {{HP}}, lose {{KW:TAUNT}} to gain {{KW:HASTE}}. {{KW:DELAY}} and ${fallen.me()}: Burn the last other ${doki.me()} from your dustpile to add it your deck with {{KW:HASTE}}.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "RARE",
		frameSkinName: frame,
		note: `Does anyone even read these?`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Alphys's PC|Alphys's PCs}}",
		image: "Alphys_PC",
		cost: 6,
		attack: 5,
		hp: 7,
		description: `{{KW:MAGIC}}: Look at 3 random {{TRIBE:DOKI|2}} you didn't start in your deck with and catch one. {{KW:DUST}}: Release it into your hand.`,
		extension: "BASE",
		rarity: "RARE",
		customFont: "DTM-Mono",
		note: `One of my headcanons as to how could such cards be added to Undercards was that Alphys would play a dating sim on her PC, but somehow the characters from the dating sim would come to life.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Anime Poster|Anime Posters}}",
		image: "Anime_Poster",
		cost: 5,
		attack: 4,
		hp: 4,
		description: `{{KW:MAGIC}}: Look at 3 random ${fallen.me()} monsters (rarity <= {{RARITY:EPIC}}) and choose one. {{KW:DELAY}}: Summon it for both players and force yours to attack the enemy one.`,
		extension: "BASE",
		rarity: "EPIC",
		customFont: "DTM-Mono",
		note: `Most of the time the effect is just helpful to you, since there are few ${doki.me(2)} who mess this up. It's also {{KW:SUPPORT}} support!`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Depressed Sayori|Depressed Sayoris}}",
		image: "Depressed_Sayori",
		cost: 4,
		attack: 3,
		hp: 2,
		description: `{{KW:MAGIC}}: Heal 1 {{HP}} for each ${doki.me()} in your dustpile (max: 12). ${fallen.me()}: Trigger the effect of the highest {{HP}} other ${fallen.me()} monster in your hand and give it +1/-1.`,
		//description: `{{KW:MAGIC}}: Give an ally ${fallen.me()} monster in your hand +1/+2. ${fallen.me()}: Trigger the effect of a random ${fallen.me()} monster in your hand and return it to your deck with +1/-1.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "EPIC",
		frameSkinName: frame,
		note: `Probably the hardest one to give a magic to for me. This card's original magic caused this card's text to be unreadable, so I made it a bit simpler.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Obsessed Yuri|Obsessed Yuris}}",
		image: "Obsessed_Yuri",
		cost: 6,
		attack: 5,
		hp: 5,
		//armor: true,
		description: `{{KW:MAGIC}}: Target an ally monster. {{KW:DELAY}}: If it's dead, {{KW:SILENCE}} and deal 5 {{DMG}} to the monster in front of it. Otherwise, give all ${doki.me(2)} in your hand +3/-2.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "EPIC",
		frameSkinName: frame,
		note: `A ${fallen.me()} support card that doesn't actually HAVE a ${fallen.me()} keyword? Yes, and it can even singlehandedly take out some cards that could cause you trouble if you play your cards right, such as a Mettaton NEO or Sans (if you really must). Its secondary effect can also bring advantages that could be considered.`
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Corrupted Natsuki|Corrupted Natsukis}}",
		image: "Corrupted_Natsuki",
		cost: 5,
		attack: 4,
		hp: 4,
		transparency: true,
		//haste: true,
		//description: "{{KW:HASTE}}. ${fallen.me()}: If this killed an enemy monster, deal the excess {{DMG}} this received to the enemy player.",
		description: `{{KW:TRANSPARENCY}}. ${fallen.me()}: Add 2 random ${doki.me(2)} from your dustpile to your hand with -1 {{cost}} and -2 {{HP}}.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "EPIC",
		frameSkinName: frame,
		note: `I wanted to mess around with things that can help one trigger ${fallen.me()} effects without the use of {{KW:Haste}}, bonus attacks or self damage . . . And the answer was {{KW:TRANSPARENCY}}!<br><br>I am unsure how cool the effect is, but I still think that something like this can be very useful in ${fallen.me()} decks.`
	});

	c.newCard({
		name: "{{PLURAL:$1|Traumatized MC|Traumatized MCs}}",
		image: "Traumatized_MC",
		// aprilImage: "Traumatized_MC",
		cost: 6,
		attack: 4,
		hp: 7,
		//description: "Whenever you summon an {{KW:ARACHNID}} give it +1/+1. {{KW:DUST}}: Fill your board with {{CARD:115|2}} and give them +1/+1.",
		description: `{{KW:SUPPORT}}: If the attacker has more than 1 {{HP}}, give it +2/-1.`,
		tribes: [doki],
		extension: "DDLC",
		rarity: "LEGENDARY",
		frameSkinName: frame,
		note: `Does anyone even read these?`
	});

	var desparation = c.newCard({
		name: "{{PLURAL:$1|Desparation|Desparations}}",
		image: "Desparation",
		cost: 0,
		//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, burn this and draw a card.",
		description: `Give an ally monster {{KW:HASTE}} and +2/-1. {{KW:DELAY}}: If it's alive, {{KW:SILENCE}} and kill it. Draw a card.`,
		extension: "DDLC",
		rarity: "TOKEN",
		frameSkinName: frame,
		note: `Giving Haste in this tribe is very controversial, so I kept it to a conditionally bad(?) card.`
	});

	c.newCard({
		name: "{{PLURAL:$1|Club President Monika|Club President Monikas}}",
		image: "Club_President_Monika",
		cost: 6,
		attack: 6,
		hp: 5,
		description: `{{KW:DELAY}}: Force all ally monsters to attack enemy monsters in front of them. {{KW:FALLEN}}: Add a ${desparation.me()} to your deck.`,
		// description: `{{KW:SUPPORT}}: Catch a copy of a non-{{RARITY:DETERMINATION}} attacker. {{KW:DUST}}: Release it with 3/3. If it's a ${fallen.me()} ${doki.me()} monster, trigger its ${fallen.me()} effect and kill it.`,
		//description: "{{KW:MAGIC}}: Burn 3 {{RARITY:EPIC}} ${fallen.me()} monsters from your dustpile. Trigger their ${fallen.me()} effects. {{KW:DUST}}: Add a random {{TRIBE:CHRSPELL}} to the bottom of your deck for each monster burned.",
		tribes: [doki],
		extension: "DDLC",
		rarity: "LEGENDARY",
		frameSkinName: frame,
		note: `This is one card I am not all that happy with now, personally, but I admit it can have some very clever strategies to ensure that the {{KW:DELAY}} effect doesn't hit you, so I left it as-is.`
	});

	c.newCard({
		name: "{{PLURAL:$1|Club President Sayori|Club President Sayoris}}",
		image: "Club_President_Sayori",
		cost: 6,
		attack: 5,
		hp: 6,
		description: `{{KW:TURN-START}}: Burn the first ${doki.me()} from your dustpile to add it to your hand with +2/-1. {{KW:MAGIC}}: Trigger the {{KW:TURN-START}} effect twice.`, // {{CARD:131}}
		tribes: [doki],
		extension: "DDLC",
		rarity: "LEGENDARY",
		frameSkinName: frame,
		note: `This card just screams "TRADES!". This one, just like Depressed Sayori, originally had a very long text, so I modified the effect a little, but the principle is the same.`
	});

	// CHR Spells

	var sayori_chr = c.newCard({
		name: "{{PLURAL:$1|Sayori.chr|Sayori.chrs}}",
		image: "SayoriCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, apply them to the monsters in front of them, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Remove all negative effects from ally monsters, burn this and draw a card.",
		description: `Heal 5 {{HP}} to yourself or give a monster -1/-1 and {{KW:HASTE}}. Draw a card.`,
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN",
		frameSkinName: frame,
		note: `Semi-targeted heals and second best card draw out of the ${chr_spells.me(2)}.`
	});

	var natsuki_chr = c.newCard({
		name: "{{PLURAL:$1|Natsuki.chr|Natsuki.chrs}}",
		image: "NatsukiCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Add a random 5-{{COST}} monster from your dustpile to your hand, give it -4 {{COST}}, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Burn a random 4 or 5 {{COST}} monster in your dustpile (prefer {{TRIBE:DOKI|2}}), add it to your hand, give it -2 {{COST}}, burn this and draw a card.",
		//description: "Look at all {{TRIBE:DOKI|2}} in your dustpile and choose one. Add it to your hand. Give it -2 {{COST}}. Draw a card.",
		//description: "Look at 3 random 4-{{COST}} cards in your dustpile and burn one. Add it to your hand. Give it -1 {{COST}}. Draw a card.",
		// description: `Look at 3 random non-{{RARITY:DETERMINATION}} ${doki.me(3)} in your dustpile and choose one to add to your hand with -1 {{cost}}.`,
		description: `Look at 4 different random 3-5 {{cost}} cards in your dustpile. Add one to your hand with +2/-1.`,
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN",
		frameSkinName: frame,
		note: `Card revive and best card draw out of the ${chr_spells.me(2)}.`
	});

	var yuri_chr = c.newCard({
		name: "{{PLURAL:$1|Yuri.chr|Yuri.chrs}}",
		image: "YuriCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Kill the enemy monster with the lowest {{HP}}, burn this and draw a card.",
		//description: "{{KW:TURBO}}: Give the enemy monster with the liwest {{HP}} -4 {{HP}}, burn this and draw a card.",
		description: `Give an enemy monster -1/-2, then a random other enemy monster -1/-1. If there is only one enemy monster, draw a card.`,
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN",
		frameSkinName: frame,
		note: `Nerfs and either more nerfs or a conditional card draw if there was only one enemy monster.`
	});

	var monika_chr = c.newCard({
		name: "{{PLURAL:$1|Monika.chr|Monika.chrs}}",
		image: "MonikaCHR",
		cost: 0,
		//description: "{{KW:TURBO}}: Send a random ally and enemy non-{{RARITY:DETERMINATION}} monster from the board to their owners' hands, burn this and draw a card.",
		//description: "{{KW:TURBO}}: {{KW:SILENCE}} an enemy non-{{RARITY:DETERMINATION}} monster, burn this and draw a card.",
		description: `{{KW:SILENCE}} an enemy monster if its {{ATK}} was 4 or less. Otherwise, give it -3 {{ATK}}.`,
		tribes: [chr_spells],
		extension: "DDLC",
		rarity: "TOKEN",
		frameSkinName: frame,
		note: `Powerful effect at the downside of no card draws.`
	});
	
	/*
	var file_exp = c.newArtifact({
		name: "Character Folder", 
		image: "File_Explorer",
		aprilImage: "File_Explorer",
		rarity: "DETERMINATION",
		description: `{{KW:TURN-END}}: If an ally monster died this turn, add the next ${chr_spells.me()} to the top of your deck. Whenever you summon a ${fallen.me()} monster, if it's on the right, give it -2/-1 and trigger its ${fallen.me()} effect. 
		Order of ${chr_spells.me(2)}: ${sayori_chr.me()} > ${natsuki_chr.me()} > ${yuri_chr.me()} > ${monika_chr.me()} > Start over.`,
		note: `Basically, this is where the majority of Just Monika's power lies. While this artifact encourages this to be used in combination with the ${doki.me(2)}, the first effect can prove useful in other tribes, or even in a regular match as well, as most players often trade their cards anyway, so it isn't a dead weight if it ends up in the wrong deck, either.`
	});
	*/
	
	c.newCard({
		name: "{{PLURAL:$1|Just Monika|Just Monikas}}",
		image: "Just_Monika_Breaking",
		aprilImage: "Just_Monika",
		background: "Just_Monika_Breaking_BG",
		aprilBackground: "Just_Monika_Back",
		themeSongs: [
			"Just_Monika",
			"Just_Monika_2",
			"Just_Monika_3"
		],
		cost: 9,
		attack: 6,
		hp: 7,
		// description: `{{KW:MAGIC}}: Add the ${file_exp.me()} artifact. {{KW:DELAY}}: Add the next ${chr_spells.me()} to your hand if an ally ${fallen.me()} monster died this turn.`,
		// description: `{{KW:MAGIC}}: Fill your hand with ${chr_spells.me(2)}. {{KW:DELAY}}: Add all of the ${chr_spells.me(2)} to your deck for each 15 {{gold}} the monsters in your dustpile {{cost}} combined.`,
		description: `{{KW:MAGIC}}: Add 8 ${chr_spells.me(2)} to your hand, and excess ones to your deck. ${fallen.me()}: Add a random different ${chr_spells.me()} to your and and deck.`,
		tribes: [doki],
		extension: "DDLC",
		typeSkin: 2,
		rarity: "LEGENDARY",
		frameSkinName: frame,
		//note: `The DT of the ${doki.me()} tribe. The most notable aspects of this card are noted with ${file_exp.me()}.`
	});

	prettycards.ddlc_collection = c;
	
})

export {};
