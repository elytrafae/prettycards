
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Switch Soul Set",
		author: "Baltoni and CMD_God",
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/Switch_Soul/",
		//cardSongPrefix: "https://github.com/CMD-God/prettycards/raw/master/audio/cards/DDLC/",
		//rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		//universalCustomFont: "Aller",
		note: `A collaboration between @Baltoni#7741 and I for Soultest back in the day, now in a fresh format!`
	});
	
	var soul = c.newSoul({
		displayName: "SWITCH",
		description: "",
		image: "SWITCH",
		name: "SWITCH",
		note: "An idea for a spell-oriented soul. Unfortunately, I lost access to the original sheet where I submitted all of these cards, so they will have minimal reasoning now . . ."
	});

	var spellbook = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Spellbook|Spellbooks}}",
		image: "Spellbook",
		cost: 0,
		description: `Look at 3 random ${soul.me()} spells (rarity <= {{RARITY:EPIC}}). Choose one to add to your hand. If your opponent has more monsters on the board than you, give it -1 {{cost}}.`,
		extension: "BASE",
		rarity: "TOKEN"
	});

	soul.setDescription(`At the start of every 4th turn add a ${spellbook.me()} to your hand.`);

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Magic Orbs|Magic Orbs}}",
		image: "Magic_Orbs_2",
		cost: 1,
		description: "Swap the {{ATK}} and {{HP}} of a monster. Draw a card.",
		extension: "BASE",
		rarity: "BASE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Sacrificial Lamb|Sacrificial Lambs}}",
		image: "Sacrificial_Lamb",
		cost: 5,
		description: "Burn a random {{KW:GENERATED}} spell in your hand to kill an enemy monster.",
		extension: "BASE",
		rarity: "COMMON"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Sabotage|Sabotages}}",
		image: "Sabotage",
		cost: 2,
		description: "Add 2 copies of the enemy's soul's {{RARITY:BASE}} spell to your hand.",
		extension: "BASE",
		rarity: "COMMON"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Chaotic Powers|Chaotic Powers}}",
		image: "Chaotic_Powers",
		cost: 4,
		description: "Add 3 random other spells ({{cost}} <= 4) to your hand which you didn't cast this game.",
		extension: "DELTARUNE",
		rarity: "COMMON"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Mass Necromancy|Mass Necromancies}}",
		image: "Even_Necromancy",
		cost: 3,
		description: "For ever 3 different spells you've cast this game, burn a random monster in your dustpile and add it to your hand (max: 3).",
		extension: "BASE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Slice of Temptation|Slices of Temptation}}",
		image: "An_Honest_Heal",
		cost: 2,
		description: "Both players draw a card. If their hand is already full, deal fatigue {{DMG}} to them twice instead.",
		extension: "BASE",
		rarity: "RARE"
	});

	/*
	var power_drain = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Power Drain|Power Drains}}",
		image: "Power_Drain",
		cost: 2,
		description: "",
		extension: "BASE",
		rarity: "RARE"
	});

	var life_drain = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Life Drain|Life Drains}}",
		image: "Life_Drain",
		cost: 2,
		description: "Give an enemy monster -2 {{HP}}. Give the monster in front of it +3 {{HP}}.",
		extension: "BASE",
		rarity: "TOKEN"
	});

	power_drain.setDescription(`Give an enemy monster -2 {{ATK}}. Give the monster in front of it +2 {{ATK}}. {{KW:DELAY}}: Add a ${life_drain.me()} to your hand.`);
	*/

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Power Drain|Power Drains}}",
		image: "Power_Drain",
		cost: 3,
		description: "Burn all the spells in your hand. {{KW:DELAY}}: Add exact copies of them back to your hand and give them -2 {{cost}}.",
		extension: "BASE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Breeze of Freedom|Breezes of Freedom}}",
		image: "Body_Swap",
		cost: 3,
		description: "Add a random {{TRIBE:CHAOS_WEAPON}} to your hand. Set its {{cost}} to 1.",
		extension: "DELTARUNE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Triggers of Lunacy|Triggers of Lunacy}}",
		image: "Triggers_Of_Lunacy",
		cost: 17,
		description: "In hand, this has -1 {{cost}} for each unique {{KW:GENERATED}} card you played this game. Deal 7 {{DMG}} to all enemy monsters.",
		extension: "BASE",
		rarity: "EPIC"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Mew Mew's Special|Mew Mew's Specials}}",
		image: "Mew_Mew_Special",
		cost: 2,
		description: "Select a non-{{RARITY:DETERMINATION}} monster in your hand. {{KW:DELAY}}: Add a copy of it to your hand.",
		extension: "BASE",
		rarity: "EPIC"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Royal Switch|Royal Switches}}",
		image: "Royal_Switch",
		cost: 4,
		description: "Give all ally monsters +1/+1 for every 6 {{KW:GENERATED}} spells you've casted this game.",
		extension: "BASE",
		tribes: ["ROYAL_INVENTION"],
		rarity: "TOKEN"
	});

});