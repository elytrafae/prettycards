
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {

    if (!settings.my_own_custom_cards.value()) {return;}

    var c = window.prettycards.newCollection({
		name: "Kyra x elytrafae Sheet",
		author: "Kyra and elytrafae",
		cardImagePrefix: "https://raw.githubusercontent.com/elytrafae/prettycards/master/img/Cards/Kyra/",
		cardSongPrefix: "https://github.com/elytrafae/prettycards/raw/master/audio/cards/Kyra/",
		//rarityImagePrefix: "https://raw.githubusercontent.com/elytrafae/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/elytrafae/prettycards/raw/master/img/Kyra/",
		tribeImagePrefix: "https://github.com/elytrafae/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/elytrafae/prettycards/raw/master/img/Souls/",
		aprilCardImagePrefix: "https://raw.githubusercontent.com/elytrafae/prettycards/master/img/Cards/Kyra/aprilFools/",
		aprilArtifactImagePrefix: "https://github.com/elytrafae/prettycards/raw/master/img/Artifacts/aprilFools/",
		//universalCustomFont: "Aller",
		note: `A little sheet I made for ideas that we came up with together :3`
	});

    var moldog = c.newCard({
        name: "{{PLURAL:$1|Moldog|Moldogs}}",
		image: "Moldog",
		cost: 5,
		attack: 4,
		hp: 5,
		description: `{{KW:MAGIC}}: {{KW:Switch}}: Become a {{TRIBE:MOLD}} or {{TRIBE:DOG}}. Give all other ally monsters of the same tribe as this one +1/+2. {{KW:Synergy}}: Heal all allies by 3.`,
		tribes: [],
		extension: "BASE",
		rarity: "EPIC"
    });

    var tagled_wires = c.newCard({
        name: "{{PLURAL:$1|Tangled Wires|Tangled Wires}}",
		image: "Tangled_Wires",
		cost: 6,
		attack: 4,
		hp: 4,
		description: `{{KW:MAGIC}}: Turn an ally {{TRIBE:PLUG}} or {{TRIBE:AMALGAMATE}} into a {{CARD:684|1}} that catches the original. It becomes an {{TRIBE:AMALGAMATE}}, too.`,
		tribes: ["PLUG", "AMALGAMATE"],
		extension: "BASE",
		rarity: "EPIC"
    });

	var tagled_wires1_5 = c.newCard({
        name: "{{PLURAL:$1|Tangled Wires|Tangled Wires}}",
		image: "Tangled_Wires",
		cost: 6,
		attack: 4,
		hp: 4,
		description: `{{KW:MAGIC}}: Turn an ally {{TRIBE:PLUG}} or {{TRIBE:AMALGAMATE}} into a {{CARD:684|1}} that catches the original. It becomes an {{TRIBE:AMALGAMATE}}, too. {{KW:SYNERGY}}: It gains its stat buffs.`,
		tribes: ["PLUG", "AMALGAMATE"],
		extension: "BASE",
		rarity: "EPIC"
    });

    var tembomination = c.newCard({
        name: "{{PLURAL:$1|Tembomination|Tembominations}}",
		image: "Tembomination",
		cost: 5,
		attack: 4,
		hp: 4,
		description: `{{KW:MAGIC}}: {{KW:SWITCH}}: Gain +1 {{ATK}} and {{KW:HASTE}} or +2 {{HP}} and {{KW:TAUNT}}.`,
		tribes: ["TEMMIE", "AMALGAMATE"],
		extension: "BASE",
		rarity: "RARE"
    });

	var hoivemind = c.newCard({
        name: "{{PLURAL:$1|Hoivemind|Hoiveminds}}",
		image: "Hoivemind",
		cost: 4,
		attack: 4,
		hp: 2,
		haste: true,
		description: `{{KW:HASTE}}. {{KW:MAGIC}}: {{KW:SWITCH}}: Draw a {{TRIBE:TEMMIE}} or an {{TRIBE:AMALGAMATE}}. {{KW:SYNERGY}}: If this is not {{KW:GENERATED}}, add two copies of it to your deck.`,
		tribes: ["TEMMIE", "AMALGAMATE"],
		extension: "BASE",
		rarity: "COMMON"
    });

    var ice_cave = c.newCard({
        name: "{{PLURAL:$1|Ice Cave|Ice Cave}}",
		image: "Ice_Cave",
		cost: 7,
		attack: 4,
		hp: 6,
		description: `{{KW:MAGIC}} and {{KW:TURN_START}}: Summon an {{CARD:9}}.`,
		tribes: [],
		extension: "BASE",
		rarity: "EPIC"
    });

	var ice_cave2 = c.newCard({
        name: "{{PLURAL:$1|Ice Cave|Ice Cave}}",
		image: "Ice_Cave",
		cost: 6,
		attack: 2,
		hp: 5,
		candy: true,
		description: `{{KW:CANDY}}. {{KW:MAGIC}} and {{KW:TURN_START}}: Summon an {{CARD:9}}.`,
		tribes: [],
		extension: "BASE",
		rarity: "EPIC"
    });

})