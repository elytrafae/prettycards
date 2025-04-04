
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import { utility } from "../../utility";

var spellbook;

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Switch Soul Set",
		author: "Baltoni and elytrafae",
		cardImagePrefix: utility.asset("img/Cards/Switch_Soul/"),
		//cardSongPrefix: utility.asset("audio/cards/DDLC/"),
		//rarityImagePrefix: utility.asset("img/RarityIcons/"),
		artifactImagePrefix: utility.asset("img/Artifacts/"),
		tribeImagePrefix: utility.asset("img/Tribes/"),
		soulImagePrefix: utility.asset("img/Souls/"),
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

	spellbook = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Spellbook|Spellbooks}}",
		image: "Spellbook",
		cost: 0,
		description: `Look at 3 random ${soul.me()} spells (<= {{RARITY:RARE}}). Add one to your hand. If your opponent has more monsters than you, give it -1 {{cost}}.`,
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
		description: "Burn the most expensive {{KW:GENERATED}} spell in your hand to kill an enemy monster.",
		extension: "BASE",
		rarity: "COMMON"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Sabotage|Sabotages}}",
		image: "Sabotage",
		cost: 1,
		description: "Look at 3 random different {{RARITY:BASE}} spells. Choose one. Add the other two to your hand.",
		extension: "BASE",
		rarity: "COMMON"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Chaotic Powers|Chaotic Powers}}",
		image: "Chaotic_Powers",
		cost: 4,
		description: "Add 3 random other spells ({{cost}} <= 4) to your hand which you didn't cast this game with -1 {{cost}}.",
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
		name: "{{PLURAL:$1|Evolutionary Leap|Evolutionary Leaps}}",
		image: "Evolutionary_Leap",
		cost: 2,
		description: `Turn a monster in your hand into a random monster with +1 base {{cost}}, then give it -1 {{cost}} (keep base buffs). Draw a card.`,
		extension: "BASE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Hysteria|Hysterias}}",
		image: "Mew_Mew_Special",
		cost: 1,
		description: `Burn the 2 cheapest {{KW:GENERATED}} cards in your hand to draw 2 cards. Reduce their {{cost}} by the average of the burned cards' costs.`,
		extension: "BASE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Breeze of Freedom|Breezes of Freedom}}",
		image: "Breeze_Of_Freedom",
		cost: 2,
		description: "Deal 1 {{DMG}} to all enemies and heal 1 {{HP}} to you for each {{DMG}} dealt.",
		extension: "DELTARUNE",
		rarity: "RARE"
	});

	/*
	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Mew Mew's Special|Mew Mew's Specials}}",
		image: "Mew_Mew_Special",
		cost: 2,
		description: "Select a non-{{RARITY:DETERMINATION}} monster in your hand. {{KW:DELAY}}: Add a copy of it to your hand.",
		extension: "BASE",
		rarity: "EPIC"
	});
	*/

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Power Drain|Power Drains}}",
		image: "Power_Drain",
		cost: 3,
		description: `Set a monster’s {{ATK}} and {{HP}} to the {{ATK}} and {{HP}} of the monster in front of it. If it has {{KW:CHARGE}}, replace it with {{KW:HASTE}}.`,
		extension: "BASE",
		rarity: "EPIC"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Triggers of Lunacy|Triggers of Lunacy}}",
		image: "Triggers_Of_Lunacy",
		cost: 15,
		description: "In hand, this has -1 {{cost}} for each unique {{KW:GENERATED}} card you played this game. Deal 7 {{DMG}} to all enemy monsters.",
		extension: "BASE",
		rarity: "EPIC"
	});

	var food_fight = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Food Fight|Food Fights}}",
		image: "Food_Fight",
		cost: 7,
		description: `Summon a {{CARD:431}}. Shuffle 5 {{CARD:596|2}} into the top 10 cards of the enemy's deck.`,
		extension: "DELTARUNE",
		rarity: "EPIC"
	});

	/*
	var food_fight = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Food Fight|Food Fights}}",
		image: "Food_Fight",
		cost: 6,
		loop: 1,
		description: "",
		extension: "DELTARUNE",
		rarity: "EPIC"
	});

	food_fight.setDescription(`{{KW:LOOP}} (1). Summon a {{CARD:431}}, send the copy to the top of the enemy's deck with -1 {{cost}} and draw a card.`);
	*/


	/*
	var sleep_mist = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Sleep Mist|Sleep Mists}}",
		image: "Sleep_Mist",
		cost: 0,
		description: "",
		extension: "DELTARUNE",
		rarity: "EPIC"
	});

	sleep_mist.setDescription(`{{KW:PARALYZE}} an enemy monster. If this isnt {{KW:GENERATED}} by ${sleep_mist.me()}, add one to your opponent’s hand and draw a card.`);
	*/

	/*
	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Cakesplosion|Cakesplosions}}",
		image: "Cakesplosion",
		cost: 7,
		description: "Summon a 10/10/10 {{CARD:306}} with {{KW:HASTE}}. {{KW:DELAY}}: If it didn't attack, kill it to give yourself +8 {{HP}} and give all other ally monsters +2/+2 and {{KW:TAUNT}}.",
		extension: "DELTARUNE",
		rarity: "EPIC"
	});
	*/

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Royal Switch|Royal Switches}}",
		image: "Royal_Switch",
		cost: 4,
		// description: "Give all ally monsters +1/+1 for every 6 {{KW:GENERATED}} spells you've casted this game.",
		description: `Send your hand to the top of your deck and fill your hand with -1 {{cost}} non-{{RARITY:TOKEN}} ${soul.me()} spells from highest to lowest rarity.`,
		extension: "BASE",
		tribes: ["ROYAL_INVENTION"],
		rarity: "TOKEN"
	});

	var magic_wand = c.newArtifact({
		name: "Magic Wand", 
		image: "Magic_Wand",
		rarity: "DETERMINATION",
        ownerId: 65,
        soul: soul.name,
        backgroundClass: "PrettyCards_ArtBG_MagicWand",
		description: `At the start of every even turn add a ${spellbook.me()} to your hand.`
	});

});

