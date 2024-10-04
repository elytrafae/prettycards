import { prettycards } from "../../underscript_checker";
import { utility } from "../../utility";
import { CustomCardCollection } from "../custom_cards_dictionary_new";



PrettyCards_plugin.events.on("PrettyCards:customCards", function () {

    console.log("C A L L B A C K    P I N G");
	
    /** @type {CustomCardCollection} */
	var c = window.prettycards.newCollection({
		name: "Robot Tribe Set",
		author: "elytrafae",
		cardImagePrefix: utility.asset(`img/Cards/Robots/`),
		cardSongPrefix: utility.asset(`audio/cards/Robots/`),
		//rarityImagePrefix: utility.asset(`img/RarityIcons/`),
		artifactImagePrefix: utility.asset(`img/Artifacts/`),
		tribeImagePrefix: utility.asset(`img/Tribes/`),
		//soulImagePrefix: utility.asset(`img/Souls/`),
		aprilCardImagePrefix: utility.asset(`img/Cards/Robots/aprilFools/`),
		aprilArtifactImagePrefix: utility.asset(`img/Artifacts/aprilFools/`),
		//universalCustomFont: "Aller",
		note: `Robot tribe idea (inspired by Murder Drones and cannibalism). 
        <br><br>
        Current cards included: <br>
        Guaranteed: {{CARD:427}}, {{CARD:56}}, {{CARD:359}}, {{CARD:201}}, {{CARD:64}}, {{CARD:110}}, {{CARD:573}}, {{CARD:249}}, {{CARD:270}} (santient robots, that's it) <br>
        Maybe: {{CARD:778}}, {{TRIBE:THRASHING_PART|2}}, {{CARD:688}}, {{CARD:794}}, {{CARD:717}} (mechs and such) <br>
        Probably?: (insert everything running on electricity or metalic) <br><br>
        NOTE: In an ideal world, all costs would be exact and I would use an artifact to track it. Unfortunately, uh, game mechanics :3:3:3`
	});
	
	var robot = c.newTribe({
		name: "{{PLURAL:$1|Robot|Robots}}",
		image: "ROBOT",
		id: "ROBOT"
	});
	
	var scrap = c.newKeyword({
		name: "Scrap",
		description: `This effect triggers by consuming x or more {{GOLD}} worth of ${robot.me(2)} from your dustpile.`,
		id: "SCRAP"
	});
	
	c.newCard({
		name: "{{PLURAL:$1|Jandroid|Jandroids}}",
		image: "Jandroid",
		cost: 3,
		attack: 3,
		hp: 2,
		description: `{{KW:MAGIC}}: Clear all negative effects off of an ally monster and give it +1 {{ATK}}. ${scrap.me()} (8): Heal it to full.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "COMMON"
	});

    c.newCard({
		name: "{{PLURAL:$1|Goosic|Goosics}}",
		image: "Goosic",
		cost: 6,
		attack: 5,
		hp: 5,
		description: `{{KW:DELAY}} and {{KW:TURN-START}}: ${scrap.me()} (3): Deal 3 {{DMG}} to a random enemy monster.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "COMMON"
	});

    c.newCard({
		name: "{{PLURAL:$1|Telly-Vis|Telly-Vis}}",
		image: "Telly-Vis",
		cost: "?",
		attack: "?",
		hp: "?",
		description: `WIP`,
		tribes: [robot],
		extension: "UTY",
		rarity: "COMMON"
	});

    c.newCard({
		name: "{{PLURAL:$1|Daisy|Daisy}}",
		image: "Daisy",
		cost: 4,
		attack: 2,
		hp: 3,
		description: `{{KW:MAGIC}}: Scrap (10): Deal 4 {{DMG}} to an enemy monster. If it died, heal 8 {{HP}} to you.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "COMMON"
	});

    c.newCard({
		name: "{{PLURAL:$1|Manta Raybot|Manta Raybots}}",
		image: "Manta_Raybot",
		cost: 7,
		attack: 7,
		hp: 7,
		description: `{{KW:DELAY}}: ${scrap.me()} (7): Draw up to 3 cards costing 7 or more.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "RARE"
	});

    c.newCard({
		name: "{{PLURAL:$1|Robomit|Robomit}}",
		image: "Robomit",
		cost: 7,
		attack: 5,
		hp: 7,
		description: `{{KW:HASTE}}. {{KW:MAGIC}}: If played on the left, ${scrap.me()} (4): lose {{KW:HASTE}} to gain +3/+2 and {{KW:TAUNT}}.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "RARE"
	});

    c.newCard({
		name: "{{PLURAL:$1|Vendy|Vendys}}",
		image: "Vendy",
		cost: 4,
		attack: 3,
		hp: 4,
		description: `{{KW:MAGIC}}: Add a {{CARD:576}} to your hand. ${scrap.me()} (1): Add a {{CARD:511}} to your hand. ${scrap.me()} (2): Add a {{CARD:677}} to your hand. ${scrap.me()} (3): Shuffle 3 {{CARD:596}} into your hand.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "RARE"
	});

    c.newCard({
		name: "{{PLURAL:$1|Sousborg|Sousborgs}}",
		image: "Sousborg",
		cost: 4,
		attack: 3,
		hp: 4,
		description: `{{KW:MAGIC}}: Summon a {{STATS:3|3}} {{CARD:459}}. Scrap (10): Kill this to turn it into a {{CARD:431}}.`,
		tribes: [robot],
		extension: "UTY",
		rarity: "EPIC"
	});

    c.newCard({
		name: "{{PLURAL:$1|Clock|Clocks}}",
		image: "Clock",
		cost: 12,
		attack: 7,
		hp: 8,
		description: `{{KW:TAUNT}}. {{KW:MAGIC}}: ${scrap.me()} (20): Both players skip their next turn`,
		tribes: [robot],
		extension: "UTY",
		rarity: "EPIC"
	});

    

	prettycards.scrap_collection = c;
	
})

export {};