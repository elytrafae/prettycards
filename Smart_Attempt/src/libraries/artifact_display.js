
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@68a145e64b796c36bf3b02b2f4abda3f40ebfc60/css/Artifacts.css");

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

	GetAllArtifacts() {
		console.log("Getting Artifact Data!");
		$.get("https://undercards.net/DecksConfig", {}, function(data) {
			//console.log("Data", data);
			this.artifacts = JSON.parse(data.allArtifacts);
			//console.log("All Artifacts", artifacts);
			PrettyCards_plugin.events.emit("PrettyCards:onArtifacts", this.artifacts);
		}.bind(this))
	}
}

var artifactDisplay = new ArtifactDisplay();

window.artifactDisplay = artifactDisplay;

artifactDisplay.GetAllArtifacts();


export {artifactDisplay};