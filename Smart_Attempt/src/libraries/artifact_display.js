
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
		return `<img class="pointer" style="height: 24px;" name="${artifact.name}" image="${artifact.image}" legendary="${artifact.legendary.toString()}" artifactid="${artifact.id}" onclick="artifactInfo(${artifact.id});" src="images/artifacts/${artifact.image}.png"> `;
	}
	
	SetRarityForArtifact(artifact) {
		if (artifact.rarity) {
			return artifact.rarity;
		}
		if (artifact.cost != ArtifactDisplay.commonArtifactCost && artifact.cost != ArtifactDisplay.legendaryArtifactCost) {
			artifact.rarity = ArtifactDisplay.DTArtifactIds.includes(artifact.id) ? "DETERMINATION" : "TOKEN";
		} else {
			artifact.rarity = artifact.legendary ? "LEGENDARY" : "COMMON";
		}
		return artifact.rarity;
	}

	GetAllArtifacts() {
		console.log("Getting Artifact Data!");
		$.get("https://undercards.net/DecksConfig", {}, function(data) {
			this.artifacts = JSON.parse(data.allArtifacts);

			// Setting artifact rarities for my system.
			for (var i=0; i < this.artifacts.length; i++) {
				var artifact = this.artifacts[i];
				this.SetRarityForArtifact(artifact);
			}
			PrettyCards_plugin.events.emit("PrettyCards:onArtifacts", this.artifacts);
		}.bind(this));
	}
	
}

// The following three variables are the reason why I can even check what an artifact's rarity should be. 
// Only used on artifacts the server sends. Custom ones should be handled by the author.
ArtifactDisplay.commonArtifactCost = 300;
ArtifactDisplay.legendaryArtifactCost = 1000;
ArtifactDisplay.DTArtifactIds = [25, 34, 43]; // Genocide, Outbreak and Ultimate Fusion respectively.
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var artifactDisplay = new ArtifactDisplay();

window.artifactDisplay = artifactDisplay;

ExecuteWhen("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@3167253c681ccc05712fd2863d46f5240851b1b5/css/Artifacts.css");
	artifactDisplay.GetAllArtifacts();
});

export {artifactDisplay};