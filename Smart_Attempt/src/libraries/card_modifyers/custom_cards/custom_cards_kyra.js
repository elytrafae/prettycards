
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {

    if (!settings.my_own_custom_cards.value()) {return;}

    var c = window.prettycards.newCollection({
		name: "Kyra x CMD_God Sheet",
		author: "Kyra and CMD_God",
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/Kyra/",
		cardSongPrefix: "https://github.com/CMD-God/prettycards/raw/master/audio/cards/Kyra/",
		//rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Kyra/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		aprilCardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/Kyra/aprilFools/",
		aprilArtifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/aprilFools/",
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

	var tagled_wires2 = c.newCard({
        name: "{{PLURAL:$1|Tangled Wires|Tangled Wires}}",
		image: "Tangled_Wires",
		cost: 5,
		attack: 4,
		hp: 3,
		description: `{{KW:MAGIC}}: Catch an ally {{TRIBE:PLUG}} or {{TRIBE:AMALGAMATE}} and copy its stat buffs. {{KW:DUST}}: Release it with {{KW:SWITCH}}: this card's stat buffs or +2/+3.`,
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

	var tem_bomb1 = c.newCard({
        name: "{{PLURAL:$1|Tem Bomb|Tem Bomb}}",
		image: "Tem_Bomb",
		cost: 3,
		attack: 1,
		hp: 4,
        charge: true,
		description: `{{KW:CHARGE}}. {{KW:TURN_START}}: Burn this to summon 3 {{CARD:50|2}}.`,
		tribes: ["TEMMIE", "BOMB"],
		extension: "BASE",
		rarity: "EPIC"
    });

	var tem_bomb2 = c.newCard({
        name: "{{PLURAL:$1|Tem Bomb|Tem Bomb}}",
		image: "Tem_Bomb",
		cost: 3,
		attack: 1,
		hp: 3,
        charge: true,
		description: `{{KW:CHARGE}}. After this attacked an enemy monster and survived, burn this and {{KW:DELAY}}: Add 2 1-{{cost}} {{CARD:356|2}} to your hand.`,
		tribes: ["TEMMIE", "BOMB"],
		extension: "BASE",
		rarity: "EPIC"
    });

    var tem_bomb3 = c.newCard({
        name: "{{PLURAL:$1|Tem Bomb|Tem Bomb}}",
		image: "Tem_Bomb",
		cost: 3,
		attack: 1,
		hp: 3,
        charge: true,
		description: `{{KW:CHARGE}}. After this attacked an enemy monster and survived, burn this and {{KW:DELAY}}: Add 2 0-{{cost}} {{CARD:356|2}} to your hand.`,
		tribes: ["TEMMIE", "BOMB"],
		extension: "BASE",
		rarity: "EPIC"
    });

})