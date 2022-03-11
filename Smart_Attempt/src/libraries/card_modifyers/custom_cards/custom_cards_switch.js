
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Switch Soul Set",
		author: "CMD_God",
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

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Spellbook|Spellbooks}}",
		image: "Spellbook",
		cost: 0,
		description: `Look at all ${soul.me()} spells (rarity <= {{RARITY:EPIC}}). Choose one to add to your hand. If your opponent has more monsters on the board than you, give it -1 {{cost}}.`,
		extension: "BASE",
		rarity: "TOKEN"
	});
})
/*
CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Spellbook|Spellbooks}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Spellbook.png",
	cost: 0,
	description: "Look at all {{SOUL:SWITCH}} spells (rarity <= {{RARITY:EPIC}}). Choose one to add to your hand. If your opponent has more monsters on the board than you, give it -1 {{cost}}.",
	extension: "BASE",
	rarity: "TOKEN"
});

window.$.i18n().load( {
			en: { 
				"soul-switch" : "SWITCH",
				"soul-switch-desc" : "At the start of every 4th turn add a " + CustomCardsDictionary.DescriptionCard("Spellbook", 1) + " to your hand.",
			}
		})

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Magic Orbs|Magic Orbs}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Magic_Orbs_2.png",
	cost: 1,
	description: "Swap the {{ATK}} and {{HP}} of a monster. Draw a card.",
	extension: "BASE",
	rarity: "BASE"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Sacrificial Lamb|Sacrificial Lambs}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Sacrificial_Lamb.png",
	cost: 4,
	description: "Burn a random {{KW:GENERATED}} spell in your hand to kill an enemy monster.",
	extension: "BASE",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Sabotage|Sabotages}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Sabotage.png",
	cost: 2,
	description: "Add 2 copis of the enemy's soul's {{RARITY:BASE}} spell to your hand.",
	extension: "BASE",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Chaotic Powers|Chaotic Powers}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Chaotic_Powers.png",
	cost: 4,
	description: "Add 3 random other spells ({{cost}} <= 4) to your hand which you didn't cast this game.",
	extension: "DELTARUNE",
	rarity: "COMMON"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Mass Necromancy|Mass Necromancies}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Even_Necromancy.png",
	cost: 5,
	description: "For ever 3 different {{KW:GENERATED}} spells you've cast this game, burn a random monster in your dustpile and add it to your deck.",
	extension: "BASE",
	rarity: "RARE"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Slice of Temptation|Slices of Temptation}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/An_Honest_Heal.png",
	cost: 2,
	description: "Both players draw a card. If they already have 7 cards in their hand, deal fatigue {{DMG}} to them twice instead.",
	extension: "BASE",
	rarity: "RARE"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Life Drain|Life Drains}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Life_Drain.png",
	cost: 2,
	description: "Give an enemy monster -2 {{HP}}. Give the monster in front of it +3 {{HP}}.",
	extension: "BASE",
	rarity: "TOKEN"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Power Drain|Power Drains}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Power_Drain.png",
	cost: 2,
	description: "Give an enemy monster -2 {{ATK}}. Give the monster in front of it +2 {{ATK}}. {{KW:DELAY}}: Add a " + CustomCardsDictionary.DescriptionCard("Life Drain", 1) + " to your hand.",
	extension: "BASE",
	rarity: "RARE"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Triggers of Lunacy|Triggers of Lunacy}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Triggers_Of_Lunacy.png",
	cost: 2,
	description: "Deal 1 {{DMG}} to all enemy monsters for every 2 spells you've casted this game. This costs 1 more for every 2 spells you've casted this game.",
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Mew Mew's Special|Mew Mew's Specials}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Mew_Mew_Special.png",
	cost: 2,
	description: "Select a non-{{RARITY:DETERMINATION}} monster in your hand. {{KW:DELAY}}: Add an exact copy of it to your hand.",
	extension: "BASE",
	rarity: "EPIC"
});

CustomCardsDictionary.AddCustomCard({
	soul: {name : "SWITCH", id: 22},
	name: "{{PLURAL:$1|Royal Switch|Royal Switches}}",
	image: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/BASE/Switch_Soul/Royal_Switch.png",
	cost: 4,
	description: "Give all ally monsters +1/+1 for every 6 {{KW:GENERATED}} spells you've casted this game.",
	extension: "BASE",
	tribes: ["ROYAL_INVENTION"],
	rarity: "TOKEN"
});
*/