
import { prettycards } from "../../underscript_checker";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import { utility } from "../../utility";

const BATTLE_MEW_MEW_BASE = {
	name: "{{PLURAL:$1|Battle Mew Mew|Battle Mew Mews}}",
	image: "Battle_Mew_Mew",
	aprilImage: "Battle_Mew_Mew",
	extension: "BASE",
	rarity: "LEGENDARY",
    //hasThemeSong: false
    themeSongs: [
        "Battle_Mew_Mew_1",
        "Battle_Mew_Mew_2",
        "Battle_Mew_Mew_3"
    ]
}

function returnBattleMewMew(settings) {
    return { ...settings, ...BATTLE_MEW_MEW_BASE};
}

PrettyCards_plugin.events.on("PrettyCards:customCards", function () {
	
	var c = window.prettycards.newCollection({
		name: "UCO Ideas Set",
		author: "elytrafae",
		cardImagePrefix: utility.asset("img/Cards/UCO_Ideas/"),
		cardSongPrefix: utility.asset("audio/cards/UCO_Ideas/"),
		//rarityImagePrefix: utility.asset("img/RarityIcons/"),
		artifactImagePrefix: utility.asset("img/Artifacts/"),
		tribeImagePrefix: utility.asset("img/Tribes/"),
		soulImagePrefix: utility.asset("img/Souls/"),
		aprilCardImagePrefix: utility.asset("img/Cards/UCO_Ideas/aprilFools/"),
		aprilArtifactImagePrefix: utility.asset("img/Artifacts/aprilFools/"),
		//universalCustomFont: "Aller",
		note: `Here are some of my UCO ideas.
        <br>
        This is also the place where I shall document my descent into madness as I try to make an actually good idea for a Battle Mew Mew card. This, of course, only includes the ones that still have the slightest chance of holding up. Purely stat change variations are also not included.
        
        <p style="color:red;font-size:1.2em;">I know these cards aren't perfectly balanced, and are subject to changes. I just want a general idea going on.</p>`
	});

    var murder = c.newKeyword({
		name: "Murder",
		description: "This effect triggers when this monster attacks and kills an enemy monster.",
		id: "MURDER"
	});

    /*
    c.newCard(returnBattleMewMew({
        cost: 7,
        attack: 6,
        hp: 4,
        description: `{{KW:HASTE}}. Whenever this attacks and kills a monster, add a copy of it to your hand and halve its {{cost}}, {{ATK}} and {{HP}} (rounded up).`
    }))
    */

    /*
    c.newCard(returnBattleMewMew({
        cost: 6,
        attack: 6,
        hp: 5,
        haste: true,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Summon an exact copy of an enemy monster for the enemy and halve both monsters' stats (rounded down).`
    }))

    
    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 5,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Deal 3 {{DMG}} to all enemy monsters. {{KW:DELAY}}: Summon 1/1 copies of all monsters killed this turn.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 5,
        haste: true,
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
        attack: 5,
        hp: 3,
        haste: true,
        description: `{{KW:HASTE}}. {{KW:MAGIC}}: Kill an enemy non-{{RARITY:DETERMINATION}} monster. {{KW:DELAY}}: Add a copy with halved {{ATK}} and {{HP}} (rounded up) and {{KW:HASTE}} to your hand.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 6,
        attack: 5,
        hp: 4,
        haste: true,
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
        haste: true,
        dodge: 1,
        description: `{{KW:HASTE}}. {{KW:DODGE}} (1). Ally monsters have +2 {{ATK}} during your turn.`
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
    */

    /*
    var astro = c.newCard(returnBattleMewMew({
        cost: 5,
        attack: 5,
        hp: 3,
        description: `{{KW:HASTE}}. {{KW:NEED}}: Killed an enemy monster this turn. {{KW:MAGIC}}: Draw a card and add an exact copy of this to the top of your deck.`
    }))

    var pit = c.newCard({
        name: "{{PLURAL:$1|Broken Locket|Broken Lockets}}",
		image: "Broken_Locket",
		aprilImage: "Broken_Locket",
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
    */

    c.newCard(returnBattleMewMew({
        cost: 8,
        attack: 5,
        hp: 5,
        haste: true,
        description: `{{KW:HASTE}}. {{KW:DELAY}}: Summon 2/1 copies of all enemy monsters killed this turn.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 7,
        attack: 4,
        hp: 4,
        haste: true,
        description: `{{KW:HASTE}}. Before this attacks a monster, halve the {{ATK}} and {{HP}} of the target.`
    }))

    c.newCard(returnBattleMewMew({
        cost: 6,
        attack: 4,
        hp: 4,
        haste: true,
        description: `{{KW:MAGIC}}: Burn half of your Dustpile, deal 3 {{DMG}} randomly spilt among enemy monsters for each 2 monsters burned.`
    }))

    c.newCard({
        name: "{{PLURAL:$1|NEO Combo|NEO Combos}}",
        image: "NEO_Combo",
        aprilImage: "NEO_Combo",
        extension: "BASE",
        rarity: "LEGENDARY",
        cost: 7,
        attack: 10,
        hp: 1,
        description: `{{KW:MAGIC}}: Choose a {{TRIBE:BARGAIN}} to cast to gain {{KW:CHARGE}}.`
        //hasThemeSong: false
        /*
        themeSongs: [
            "Battle_Mew_Mew_1",
            "Battle_Mew_Mew_2",
            "Battle_Mew_Mew_3"
        ]
        */
    })

    c.newCard({
        name: "{{PLURAL:$1|Gothelle|Gothelles}}",
        image: "Gothelle",
        aprilImage: "Gothelle",
        extension: "DELTARUNE",
        rarity: "EPIC",
        cost: 7,
        attack: 7,
        hp: 7,
        description: `Whenever an enemy monster deals {{DMG}} to an ally, this deals 2 {{DMG}} back.`
    })

    c.newCard({
        name: "{{PLURAL:$1|Gothelle|Gothelles}}",
        image: "Gothelle",
        aprilImage: "Gothelle",
        extension: "DELTARUNE",
        rarity: "EPIC",
        cost: 7,
        attack: 7,
        hp: 7,
        description: `Whenever an enemy monster deals {{DMG}} to you, this deals 3 {{DMG}} back.`
    })

    c.newArtifact({
		name: "BASE Test", 
		image: "File_Explorer",
		aprilImage: "File_Explorer",
		rarity: "BASE",
		description: `Increase the chance of being the second player.`,
	});

    c.newArtifact({
		name: "RARE Test", 
		image: "File_Explorer",
		aprilImage: "File_Explorer",
		rarity: "RARE",
		description: `Old Glamburger lol`,
	});

    c.newArtifact({
		name: "EPIC Test", 
		image: "File_Explorer",
		aprilImage: "File_Explorer",
		rarity: "EPIC",
		description: `Reverberation.`,
	});

    c.newArtifact({
		name: "MYTHIC Test", 
		image: "File_Explorer",
		aprilImage: "File_Explorer",
		rarity: "MYTHIC",
		description: `Win the game XD`,
	});
	
})

export {};
