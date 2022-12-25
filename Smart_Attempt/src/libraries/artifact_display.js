
import { pagegetters } from "./page_getters";
import { addSetting, prettycards } from "./underscript_checker";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

var old_rarity = addSetting({
    'key': 'old_artifact_rarity',
    'name': 'Disable Post-2023 Artifact Rarity System', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': false, // default value
	'category': 'artifact'
});

var no_bg = addSetting({
    'key': 'no_artifact_background',
    'name': 'Disable Artifact Backgrounds', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': false, // default value
	'category': 'artifact'
});

class ArtifactDisplay {
	
	constructor() {
		this.artifacts = [];
	}
	
	GetArtifactById(id) {
		for (var i=0; i < this.artifacts.length; i++) {
			var artifact = this.artifacts[i];
			if (artifact.id === id) {
				return artifact;
			}
		}
		return null;
	}

	GetArtifactByName(name) {
		for (var i=0; i < this.artifacts.length; i++) {
			var artifact = this.artifacts[i];
			if (artifact.name === name) {
				return artifact;
			}
		}
		return null;
	}

	ReturnArtifactIcon(artifact_id) {
		var artifact = this.GetArtifactById(artifact_id);
		//console.log(this.artifacts, artifact);
		return `<img class="pointer PrettyCards_Artifact_${artifact.rarity || "COMMON"}" style="height: 24px;" name="${artifact.name}" image="${artifact.image}" legendary="${artifact.legendary.toString()}" artifactid="${artifact.id}" onclick="artifactInfo(${artifact.id});" src="${utility.getArtifactImageLink(artifact.image)}"> `;
	}
	
	SetAdditionalDataForArtifact(artifact) {
		if (artifact.rarity) {
			return artifact.rarity;
		}
		if (!this.GetArtifactById(artifact.id)) {this.artifacts.push(artifact);}
		if (artifact.unavailable) {
			artifact.rarity = "TOKEN";
		} else {
			artifact.rarity = artifact.legendary ? "LEGENDARY" : "COMMON";
		}

		if (artifact.rarity == "LEGENDARY") {
			artifact.backgroundClass = "PrettyCards_ArtBG_Legendary";
		}

		// Merges current artifact data with additional data.
		for (var i=0; i < ArtifactDisplay.hardcodedAdditionalData.length; i++) {
			var data = ArtifactDisplay.hardcodedAdditionalData[i];
			if (data.id === artifact.id) {
				for (var key in data) {
					artifact[key] = data[key];
				}
				break;
			}
		}
		return artifact.rarity;
	}

	GetAllArtifacts() {
		//console.log("Getting Artifact Data!");
		$.get("/DecksConfig", {}, function(data) {
			this.artifacts = JSON.parse(data.allArtifacts);
			var ownedArtifacts = JSON.parse(data.artifacts);

			// Setting artifact rarities and ownership for my system.
			for (var i=0; i < this.artifacts.length; i++) {
				var artifact = this.artifacts[i];
				this.SetAdditionalDataForArtifact(artifact);
				// A little school-like code :hue:
				artifact.owned = false;
			}

			for (var i=0; i < ownedArtifacts.length; i++) {
				this.GetArtifactById(ownedArtifacts[i].id).owned = true;
			}
			PrettyCards_plugin.events.emit("PrettyCards:onArtifacts", this.artifacts);
		}.bind(this));
	}

	BuyArtifact(artifactId) {
		window.$.post("/Artifacts", {idArtifact : artifactId, unlock: "Unlock"}, function(data) {
			if (data.includes("artifact-name-" + artifactId)) {
				PrettyCards_plugin.events.emit("PrettyCards:artBuyError");
				return;
			}
			var artifact = this.GetArtifactById(artifactId);
			artifact.owned = true;
			pagegetters.gold = pagegetters.gold - artifact.cost;
			PrettyCards_plugin.events.emit("PrettyCards:artBuySuccess", {idArtifact: artifactId, artifact: artifact});
		}.bind(this));
	}

	GetRarityDataFor(artifact) {
		// Card + Soul -> <name>'s <SOUL> Artifact
		// Card -> <name>'s Artifact
		// Soul -> <SOUL> Artifact
		// Rarity only -> <rarity> Artifact
		// TODO: Finish this function and hook it up to both artifact viewing functions in fancy_helper.js
		
		var soul = artifact.soul;
		var rarity = artifact.rarity;
		var hasOwner = artifact.ownerId && (!!window.getCard(artifact.ownerId)); 
		var text = "";
		if (old_rarity.value() || (!hasOwner && !soul)) {
			text = window.$.i18n("pc-fd-artifactwithrarity", window.$.i18n("rarity-" + rarity.toLowerCase()));
		} else if (hasOwner && soul) {
			text = window.$.i18n("pc-fd-artifactwithownerandsoul", window.$.i18n("card-name-" + artifact.ownerId, 1), window.$.i18n("soul-" + soul.toLowerCase()));
		} else if (hasOwner) {
			text = window.$.i18n("pc-fd-artifactwithowner", window.$.i18n("card-name-" + artifact.ownerId, 1));
		} else if (soul) {
			text = window.$.i18n("pc-fd-artifactwithsoul", window.$.i18n("soul-" + soul.toLowerCase()));
		}

		// Image Class
		var imgClass = "PrettyCards_ArtifactDisplay_" + rarity;
		if (artifact.customImgClass) {
			imgClass = artifact.customImgClass;
		} else if (soul) {
			imgClass = "PrettyCards_ArtifactDisplay_SoulArt_" + soul;
		}

		// Text Class
		var txtClass = artifact.customTxtClass || artifact.soul || artifact.rarity;

		return {text: text, txtClass: txtClass, imgClass: imgClass};
	}
	
}

// The following three variables are the reason why I can even check what an artifact's rarity should be. 
// Only used on artifacts the server sends. Custom ones should be handled by the author.
ArtifactDisplay.commonArtifactCost = 300;
ArtifactDisplay.legendaryArtifactCost = 1000;
ArtifactDisplay.hardcodedAdditionalData = [
	{id:  1, rarity: "BASE"},
	{id:  2, rarity: "BASE"},
	{id:  3, rarity: "BASE"},
	{id:  4, rarity: "BASE"},
	{id:  6, rarity: "BASE"},
	{id: 25, rarity: "DETERMINATION", ownerId: 28 , backgroundClass: "PrettyCards_ArtBG_Genocide"},  // Genocide
	{id: 34, rarity: "DETERMINATION", ownerId: 505, backgroundClass: "PrettyCards_ArtBG_DarkFountain"}, // Outbreak/Dark Fountain
	{id: 43, rarity: "DETERMINATION", ownerId: 688, backgroundClass: "PrettyCards_ArtBG_UltimateFusion"}, // Ultimate Fusion
	{id: 46, rarity: "DETERMINATION", ownerId: 717, backgroundClass: "PrettyCards_ArtBG_FreeKromer"}, // FREE KROMER
];
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var artifactDisplay = new ArtifactDisplay();

prettycards.artifactDisplay = artifactDisplay;
window.artifactDisplay = artifactDisplay;

ExecuteWhen("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromGH("Artifacts");
	artifactDisplay.GetAllArtifacts();
});

PrettyCards_plugin.events.on("connect getPlayersStats", function (data) {
	//console.log("DATA", data);
	var backup_artifacts = [];
	if (data.action == "getPlayersStats") {
		var artifacts = JSON.parse(data.artifacts);
		for (var player in artifacts) {
			backup_artifacts = backup_artifacts.concat(artifacts[player]);
		}
	} else {
		backup_artifacts = JSON.parse(data.enemyArtifacts).concat(JSON.parse(data.yourArtifacts));
	}
	//console.log("BACKUP", backup_artifacts);
	for (var i=0; i < backup_artifacts.length; i++) {
		var artifact = backup_artifacts[i];
		artifactDisplay.SetAdditionalDataForArtifact(artifact);
		window.$(".artifact-img[artifactId=" + artifact.id + "]").addClass("PrettyCards_Artifact_" + artifact.rarity);
	}
});

export {artifactDisplay};
