
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

const BATTLE_MEW_MEW_BASE = {
	name: "{{PLURAL:$1|Battle Mew Mew|Battle Mew Mews}}",
	image: "Battle_Mew_Mew",
	aprilImage: "Battle_Mew_Mew",
	extension: "BASE",
	rarity: "LEGENDARY"
}

function returnBattleMewMew(settings) {
    return { ...settings, ...BATTLE_MEW_MEW_BASE};
}

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "Battle Mew Mew Set",
		author: "CMD_God",
		cardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/UCO_Ideas/",
		cardSongPrefix: "https://github.com/CMD-God/prettycards/raw/master/audio/cards/UCO_Ideas/",
		//rarityImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/",
		artifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/",
		tribeImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Tribes/",
		soulImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Souls/",
		aprilCardImagePrefix: "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/UCO_Ideas/aprilFools/",
		aprilArtifactImagePrefix: "https://github.com/CMD-God/prettycards/raw/master/img/Artifacts/aprilFools/",
		//universalCustomFont: "Aller",
		note: `This is the place where I shall document my descent into madness as I try to make an actually good idea for a Battle Mew Mew card. This, of course, only includes the ones that still have the slightest chance of holding up. Purely stat change variations are also not included.
        
        <p style="color:red;font-size:1.2em;">I know these cards aren't perfectly balanced, and are subject to changes. I just want a general idea going on.</p>`
	});

    var murder = c.newKeyword({
		name: "Murder",
		description: "This effect triggers when this monster attacks and kills an enemy monster.",
		id: "MURDER"
	});

    c.newCard(returnBattleMewMew({
        cost: 7,
        attack: 6,
        hp: 4,
        description: `{{KW:HASTE}}. Whenever this attacks and kills a monster, add a copy of it to your hand and halve its {{cost}}, {{ATK}} and {{HP}} (rounded up).`
    }))

    c.newCard(returnBattleMewMew({
        cost: 6,
        attack: 6,
        hp: 5,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Summon an exact copy of an enemy monster for the enemy and halve both monsters' stats (rounded down).`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 5,
        description: `{{KW:HASTE}}. {{KW:HASTE}}: Deal 3 {{DMG}} to all enemy monsters. {{KW:DELAY}}: Summon 1/1 copies of all monsters killed this turn.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 5,
        description: `{{KW:HASTE}}. {{KW:DELAY}}: Summon 2/1 copies of all enemy monsters killed this turn.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 7,
        attack: 4,
        hp: 2,
        description: `{{KW:HASTE}}. {{KW:MAGIC}} and ${murder.me()}: Summon a {{CARD:1}}. {{KW:DUST}}: Burn an ally {{CARD:1}} to summon a copy of this.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 7,
        hp: 3,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Kill an enemy non-{{RARITY:DETERMINATION}} monster. {{KW:DELAY}}: Add a copy with halved {{ATK}}, {{HP}} and {{cost}} (rounded up) to your hand.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 7,
        hp: 3,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Kill an enemy non-{{RARITY:DETERMINATION}} monster. {{KW:DELAY}}: Add a copy with halved {{ATK}}, {{HP}} and {{cost}} (rounded up) to your hand.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 3,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Kill an enemy non-{{RARITY:DETERMINATION}} monster. {{KW:DELAY}}: Add a copy with halved {{ATK}} and {{HP}} (rounded up) and {{KW:HASTE}} to your hand.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 6,
        attack: 5,
        hp: 4,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Swap this monster's stats with an enemy monster's.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 9,
        attack: 7,
        hp: 5,
        description: `{{KW:MAGIC}}: Copy the stat buffs, {{KW:HASTE}}, {{KW:TRANSPARENCY}} and {{KW:CANDY}} of an ally monster.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 7,
        hp: 8,
        description: `{{KW:DELAY}}: Attack non-{{KW:Invulnerable}} enemy monsters until there are any on the board.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 9,
        description: `{{KW:HASTE}}. Enemy monsters take +2 {{DMG}} from attacks.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 9,
        description: `After an ally monster attacks, deal its {{ATK}} as {{DMG}} to the target.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 12,
        attack: 4,
        hp: 10,
        description: `{{KW:SUPPORT}}: If the target is a monster, give it -2/-2. If it died, the attacker can attack another monster.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 5,
        attack: 5,
        hp: 3,
        description: `{{KW:HASTE}}. {{KW:NEED}}: Killed an enemy monster this turn. {{KW:MAGIC}}: Draw a card and add an exact copy of this to the top of your deck.`
    }))

    var astro = c.newCard(returnBattleMewMew({
        cost: 5,
        attack: 5,
        hp: 3,
        description: `{{KW:HASTE}}. {{KW:NEED}}: Killed an enemy monster this turn. {{KW:MAGIC}}: Draw a card and add an exact copy of this to the top of your deck.`
    }))

    var pit = c.newCard({
        name: "{{PLURAL:$1|Broken Locket|Broken Lockets}}",
		image: "Broken_Locket",
		aprilImage: "Broken Locket",
		cost: 2,
		attack: 1,
		hp: 2,
		description: `{{KW:SWITCH}}: {{PC_SWITCH_CYAN:1|{{KW:MAGIC}}: Gain +3 {{ATK}} and {{KW:CHARGE}}.}} or {{PC_SWITCH_RED:1|{{KW:TURN-START}}: Turn into a ${astro.me()}.}}`,
		extension: "BASE",
		rarity: "TOKEN"
    });

    astro.setDescription(`{{KW:CHARGE}}. {{KW:DUST}}: Add a ${pit.me()} to your hand.`);
	
    c.newCard(returnBattleMewMew({
        cost: 5,
        attack: 5,
        hp: 3,
        description: `{{KW:MAGIC}}: Summon an exact copy of a non-{{RARITY:DETERMINATION}} ally monster and {{KW:Switch}}: Halve their {{PC_SWITCH_CYAN:1|{{ATK}}}} or {{PC_SWITCH_RED:1|{{HP}}}}.`
    }))
	
})

export {};
