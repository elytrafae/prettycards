
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Hate Soul Set",
		author: "MisteryHD, Bantikat and CMD_God",
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/Hate_Soul/",
		//cardSongPrefix: "https://github.com/CMD-God/prettycards/raw/master/audio/cards/DDLC/",
		//rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		note: `A HATE Soul concept we threw together to explore some game mechanics that went underutilised in the main game. Enjoy! ^^`
	});
	
	var darkness = c.newArtifact({
		name: "Darkness",
		description: "Whenever an ally monster dies, spend a counter to give the lowest {{HP}} enemy monster -1/-1. {{KW:TURN-START}}: Set the counters to 2.",
		image: "Darkness",
		rarity: "TOKEN"
	});

	var soul = c.newSoul({
		displayName: "HATE",
		description: `After the opponent played their third card this game, gain the ${darkness.me()} artifact.`,
		image: "HATE",
		name: "HATE",
		note: "An idea for a soul that is oriented around killing its own minions and self damage."
	});

    /*
	var spellbook = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Spellbook|Spellbooks}}",
		image: "Spellbook",
		cost: 0,
		description: `Look at 3 random ${soul.me()} spells (rarity <= {{RARITY:EPIC}}). Choose one to add to your hand. If your opponent has more monsters on the board than you, give it -1 {{cost}}.`,
		extension: "BASE",
		rarity: "TOKEN"
	});
    */

	//soul.setDescription(`At the start of every 4th turn add a ${spellbook.me()} to your hand.`);

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Leeching|Leechings}}",
		image: "Leeching",
		cost: 2,
		description: "Kill an ally monster to heal yourself by its {{ATK}} and max {{HP}}.",
		extension: "BASE",
		rarity: "BASE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Desparation|Desparations}}",
		image: "Desparation",
		cost: 1,
		description: "Kill a 1+ base {{cost}} ally monster to draw 2 cards. If it has 5+ base {{cost}}, give them -1 {{cost}}, too.",
		extension: "BASE",
		rarity: "COMMON"
	});

	var dark_wand = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Dark Wand|Dark Wands}}",
		image: "Dark_Wand",
		cost: 3,
		description: "",
		extension: "BASE",
		rarity: "COMMON"
	});

	var arcane_choice = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Arcane Choice|Arcane Choices}}",
		image: "Arcane_Choice",
		cost: 0,
		description: "Look at all spells with a {{cost}} equal to the base {{cost}} of this card. Add one to your hand and halve its {{cost}}.",
		extension: "BASE",
		rarity: "TOKEN"
	});

	dark_wand.setDescription(`Kill an ally monster to add an ${arcane_choice.me()} to your hand. Set its base {{cost}} to the killed monster's {{cost}}, then set its {{cost}} to 0.`);

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Graveyard Rise|Graveyard Rises}}",
		image: "Graveyard_Rise",
		cost: 3,
		description: "{{KW:DELAY}}: Add a copy of every different monster that died this turn to your hand.",
		extension: "DELTARUNE",
		rarity: "COMMON"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Magic Knife|Magic Knives}}",
		image: "Magic_Knife",
		cost: 3,
		description: "Deal 3 {{DMG}} to a monster. If it survived, heal it by 3 and give it +2/+1.",
		extension: "BASE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Eye for an Eye|Eye for an Eyes}}",
		image: "Eye_For_An_Eye",
		cost: 4,
		description: "Kill an ally monster to kill a random enemy monster costing less than the killed ally monster.",
		extension: "BASE",
		rarity: "RARE"
	});

    c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Theft|Thefts}}",
		image: "Theft",
		cost: 4,
		description: "Give a non-{{RARITY:DETERMINATION}} enemy monster: \"{{KW:DUST}}: Summon a copy of this monster for your opponent with +1/+1\".",
		extension: "BASE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|???|???s}}",
		image: "Breeze_Of_Freedom",
		cost: "?",
		description: "",
		extension: "DELTARUNE",
		rarity: "RARE"
	});

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Avenge|Avenges}}",
		image: "Avenge",
		cost: "3",
		description: "Kill an ally monster and give all ally monsters +1/+1 for every 3 {{gold}} it costed.",
		extension: "BASE",
		rarity: "EPIC"
	});

	var numbing = c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Numbing|Numbings}}",
		image: "Numbing",
		cost: 2,
		description: "",
		extension: "BASE",
		rarity: "EPIC"
	});

    var aimless_vessel = c.newCard({
        name: "{{PLURAL:$1|Aimless Vessel|Aimless Vessel}}",
        image: "Aimless_Vessel",
        cost: 5,
        description: "{{KW:HASTE}}. {{KW:DUST}}: Deal this card's {{cost}} as {{DMG}} to all monsters.",
        attack: 4,
        hp: 4,
        extension: "BASE",
        rarity: "TOKEN"
    });

    numbing.setDescription(`Kill a non-DT ally monster costing 3 or more and add an ${aimless_vessel.me()} to your hand with same stats.`)

	c.newCard({
		soul: soul,
		name: "{{PLURAL:$1|Royal Hate|Royal Hates}}",
		image: "Royal_Hate",
		cost: "?",
		description: "",
		extension: "BASE",
		tribes: ["ROYAL_INVENTION"],
		rarity: "TOKEN"
	});

});