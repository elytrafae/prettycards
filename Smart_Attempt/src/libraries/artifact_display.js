
import { pagegetters } from "./page_getters";
import { addSetting, prettycards } from "./underscript_checker";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/Artifacts.css";
loadCSS(css);


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
	
	/*
	GetArtifactById(id) {
		for (var i=0; i < this.artifacts.length; i++) {
			var artifact = this.artifacts[i];
			if (artifact.id === id) {
				return artifact;
			}
		}
		return null;
	}
	*/

	GetArtifactById(id) {
		return this.artifacts[id] || null;
	}

	GetArtifactByName(name) {
		for (var i=0; i < this.artifacts.length; i++) {
			var artifact = this.artifacts[i];
			if (artifact && artifact.name === name) {
				return artifact;
			}
		}
		return null;
	}

	ReturnArtifactIcon(artifact_id) {
		var artifact = this.GetArtifactById(artifact_id);
		//console.log(this.artifacts, artifact);
		return `<img class="pointer PrettyCards_Artifact_${artifact.rarity || "COMMON"}" style="height: 24px;" name="${artifact.name}" image="${artifact.image}" legendary="${artifact.rarity === "LEGENDARY"}" artifactid="${artifact.id}" onclick="artifactInfo(${artifact.id});" src="${utility.getArtifactImageLink(artifact.image)}"> `;
	}

	GetAllArtifacts() {
		//console.log("Getting Artifact Data!");
		$.getJSON("https://raw.githubusercontent.com/PrettyCards/daily-collector/main/allArtifactsProcessed.json", {}, function(data) {
			this.artifacts = [];
			for (var i=0; i < data.length; i++) {
				var art = data[i];
				this.artifacts[art.id] = art;
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
			if (rarity == "LEGENDARY" || rarity == "DETERMINATION" || rarity == "MYTHIC") { // Even if the soul color overrides floating, reapply it!
				imgClass += " PrettyCards_ArtifactDisplay_FloatingForSoul";
			}
		}

		// Text Class
		var txtClass = artifact.customTxtClass || artifact.soul || artifact.rarity;

		return {text: text, txtClass: txtClass, imgClass: imgClass};
	}
	
}

var artifactDisplay = new ArtifactDisplay();

prettycards.artifactDisplay = artifactDisplay;
window.artifactDisplay = artifactDisplay;

ExecuteWhen("PrettyCards:onPageLoad", function() {
	artifactDisplay.GetAllArtifacts();
});

/*
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
		var className = "PrettyCards_Artifact_" + artifact.rarity;
		if (artifact.soul) {
			className = "PrettyCards_Artifact_Soul_" + artifact.soul;
		}
		window.$(".artifact-img[artifactId=" + artifact.id + "]").addClass(className);
	}
});
*/

PrettyCards_plugin.events.on("connect getPlayersStats", function (data) {
	var displayed_artifacts = [];
	if (data.action == "getPlayersStats") {
		var artifacts = JSON.parse(data.artifacts);
		for (var player in artifacts) {
			displayed_artifacts = displayed_artifacts.concat(artifacts[player]);
		}
	} else {
		displayed_artifacts = JSON.parse(data.enemyArtifacts).concat(JSON.parse(data.yourArtifacts));
	}
	for (var i=0; i < displayed_artifacts.length; i++) {
		var artifact = artifactDisplay.GetArtifactById(displayed_artifacts[i].id);
		var className = "PrettyCards_Artifact_" + artifact.rarity;
		if (artifact.soul) {
			className = "PrettyCards_Artifact_Soul_" + artifact.soul;
		}
		window.$(".artifact-img[artifactId=" + artifact.id + "]").addClass(className);
	}
});

export {artifactDisplay};
