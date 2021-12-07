
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

ExecuteWhen("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@fb85f11759aca506ceea21d7e4168fec82a054f9/css/Artifacts.css");
	artifactDisplay.GetAllArtifacts();
});

export {artifactDisplay};