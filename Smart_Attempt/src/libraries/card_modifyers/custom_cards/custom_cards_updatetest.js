
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {

	if (!settings.my_own_custom_cards.value()) {return;}

    var c = window.prettycards.newCollection({
		name: "Update Tester Sheet",
		author: "CMD_God",
		cardImagePrefix: "/images/cards/",
		cardSongPrefix: "https://github.com/CMD-God/prettycards/raw/master/audio/cards/UpdateTest/",
		//rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		aprilCardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/UpdateTest/aprilFools/",
		aprilArtifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/aprilFools/",
		//universalCustomFont: "Aller",
		note: `Test sheet go brrrrrr`
	});

    var frisk = c.newCard({
        name: "{{PLURAL:$1|Frisk|Frisks}}",
		image: "Frisk",
		aprilImage: "Frisk",
		cost: 10,
		attack: 7,
		hp: 8,
		description: ``,
		tribes: [],
		extension: "BASE",
		rarity: "DETERMINATION"
    });

    var act = c.newCard({
        name: "{{PLURAL:$1|ACT Button|ACT Buttons}}",
		image: "ACT_Button",
		aprilImage: "ACT_Button",
		cost: 1,
		description: `{{KW:LOOP}} (2). Look at all spells of the enemy SOUL (max. {{RARITY:RARE}}). Choose one to add to your hand.`,
		tribes: [],
		extension: "BASE",
		rarity: "TOKEN"
    });

    var worn_dagger = c.newArtifact({
		name: "Worn Dagger", 
		image: "Worn_Dagger",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "DETERMINATION",
        backgroundClass: "PrettyCards_ArtBG_WornDagger",
		description: `Whenever a monster dies (except {{TRIBE:LOST_SOUL|2}}), gain a counter. {{KW:TURN-END}}: Spend 7 counters to summon the next {{TRIBE:LOST_SOUL}}. ({{TRIBE:LOST_SOUL}} order is the same as the {{ARTIFACT:33}} artifact.)`
	});

    var tough_glove = c.newArtifact({
		name: "Tough Glove", 
		image: "Tough_Glove",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "BRAVERY",
        backgroundClass: "PrettyCards_ArtBG_ToughGlove",
		description: `At the start of every 3rd turn, add a {{CARD:577}} to your hand. If you have 4 or less cards in hand, add 2 instead. If you have 7 cards in your hand, add it to your deck.`
	});

    var empty_gun = c.newArtifact({
		name: "Empty Gun", 
		image: "Empty_Gun",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "JUSTICE",
        backgroundClass: "PrettyCards_ArtBG_EmptyGun",
		description: `{{KW:TURN-START}} and {{KW:TURN-END}}: Deal 1 {{DMG}} to the lowest {{HP}} enemy monster. If you have less {{HP}} than your opponent, deal 1 {{DMG}} to them too.`
	});

    var burnt_pan = c.newArtifact({
		name: "Burnt Pan", 
		image: "Burnt_Pan",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "KINDNESS",
        backgroundClass: "PrettyCards_ArtBG_BurntPan",
		description: `{{KW:TURN-END}}: Heal 1 {{HP}} to you and 2 {{HP}} to all damaged ally monsters. If there are none, give the rightmost ally monster +1/+1.`
	});

    var toy_knife = c.newArtifact({
		name: "Toy Knife", 
		image: "Toy_Knife",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "PATIENCE",
        backgroundClass: "PrettyCards_ArtBG_ToyKnife",
		description: `{{KW:TURN-END}}: Add a {{CARD:552}} to the top of your deck if you don't have one in hand.`
	});

    var ballet_shoes = c.newArtifact({
		name: "Ballet Shoes", 
		image: "Ballet_Shoes",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "INTEGRITY",
        backgroundClass: "PrettyCards_ArtBG_BalletShoes",
		description: `{{KW:TURN-END}}: Earn 1 {{gold}}. If it's turn 10 or later, earn 1 more.`
	});

    var torn_notebook = c.newArtifact({
		name: "Torn Notebook", 
		image: "Torn_Notebook",
		rarity: "DETERMINATION",
        ownerId: frisk.id,
        soul: "PERSEVERANCE",
        backgroundClass: "PrettyCards_ArtBG_TornNotebook",
		description: `{{KW:TURN-START}}: Give {{KR}} and -1/-1 to the highest {{ATK}} enemy monster without {{KR}}.`
	});

    var frisk_artifacts = [worn_dagger, tough_glove, empty_gun, burnt_pan, toy_knife, ballet_shoes, torn_notebook];
    var upgraded_version_string = "";
    frisk_artifacts.forEach((art) => {
        upgraded_version_string += ("|" + art.id);
    })
    upgraded_version_string = "{{PC_ARTIFACTS:Upgraded Version" + upgraded_version_string + "}}";

    frisk.setDescription(`{{KW:MAGIC}}: Gain an ${upgraded_version_string} of the enemy SOUL. Add an ${act.me(1)} to your hand.`);

})