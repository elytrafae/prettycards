
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

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

	ReturnArtifactIcon(artifact_id) {
		var artifact = this.GetArtifactById(artifact_id);
		//console.log(this.artifacts, artifact);
		return `<img class="pointer PrettyCards_Artifact_${artifact.rarity || "COMMON"}" style="height: 24px;" name="${artifact.name}" image="${artifact.image}" legendary="${artifact.legendary.toString()}" artifactid="${artifact.id}" onclick="artifactInfo(${artifact.id});" src="${utility.getArtifactImageLink(artifact.image)}"> `;
	}
	
	SetRarityForArtifact(artifact) {
		if (artifact.rarity) {
			return artifact.rarity;
		}
		if (!this.GetArtifactById(artifact.id)) {this.artifacts.push(artifact);}
		if (artifact.cost != ArtifactDisplay.commonArtifactCost && artifact.cost != ArtifactDisplay.legendaryArtifactCost) {
			artifact.rarity = ArtifactDisplay.DTArtifactIds.includes(artifact.id) ? "DETERMINATION" : "TOKEN";
		} else {
			artifact.rarity = artifact.legendary ? "LEGENDARY" : "COMMON";
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
				this.SetRarityForArtifact(artifact);
				// A little school-like code :hue:
				artifact.owned = false;
			}

			for (var i=0; i < ownedArtifacts.length; i++) {
				this.GetArtifactById(ownedArtifacts[i].id).owned = true;
			}
			PrettyCards_plugin.events.emit("PrettyCards:onArtifacts", this.artifacts);
		}.bind(this));
	}
	
}

// The following three variables are the reason why I can even check what an artifact's rarity should be. 
// Only used on artifacts the server sends. Custom ones should be handled by the author.
ArtifactDisplay.commonArtifactCost = 300;
ArtifactDisplay.legendaryArtifactCost = 1000;
ArtifactDisplay.DTArtifactIds = [25, 34, 43, 46]; // Genocide, Outbreak, Ultimate Fusion and FREE KROMER respectively.
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var artifactDisplay = new ArtifactDisplay();

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
		artifactDisplay.SetRarityForArtifact(artifact);
		window.$(".artifact-img[artifactId=" + artifact.id + "]").addClass("PrettyCards_Artifact_" + artifact.rarity);
	}
});

export {artifactDisplay};
