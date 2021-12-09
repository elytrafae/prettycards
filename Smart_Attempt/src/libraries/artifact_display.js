
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "/src/libraries/utility.js";

class ArtifactDisplay {
	
	constructor() {
		this.artifacts = [];
		
		// The following three variables are the reason why I can even check what an artifact's rarity should be. 
		// Only used on artifacts the server sends. Custom ones should be handled by the author.
		this.commonArtifactCost = 300;
		this.legendaryArtifactCost = 1000;
		this.DTArtifactIds = [25, 34, 43]; // Genocide, Outbreak and Ultimate Fusion respectively.
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		
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
		if (artifact.cost != this.commonArtifactCost && artifact.cost != this.legendaryArtifactCost) {
			artifact.rarity = this.DTArtifactIds.includes(artifact.id) ? "DETERMINATION" : "TOKEN";
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
	
	ViewArtifactInfo(id) {
		var artifact = this.GetArtifactById(id);
		var backdrop = $(`<div class="PrettyCards_ScreenCover PrettyCards_HalfTransparentBG"></div>`);
		backdrop.click(function() {this.remove();});
		
		var box = $(`<div class="PrettyCards_ArtifactDisplayBox"></div>`);
		box.click(function (e) {e.stopPropagation();});
		backdrop.append(box);
		
		var image_src = "images/artifacts/" + artifact.image + ".png";
		if (artifact.collection) {
			image_src = artifact.collection.artifactImagePrefix + artifact.image + ".png";
		}
		
		var artifactCircle = $(`<div class="PrettyCards_ArtifactCircle"><img class="PrettyCards_ArtifactImage" src="${image_src}"></img></div>`);
		box.append(artifactCircle);
		
		var name = $(`<div class="PrettyCards_ArtifactDisplayName ${artifact.rarity || "COMMON"}">${$.i18n("artifact-name-" + artifact.id)}</div>`);
		var rarity = $(`<div class="PrettyCards_ArtifactDisplayRarity ${artifact.rarity || "COMMON"}">${artifact.rarity} Artifact</div>`);
		var description = $(`<div class="PrettyCards_ArtifactDisplayDescription">${$.i18n("artifact-" + artifact.id)}</div>`);
		
		box.append(name);
		box.append(rarity);
		box.append(description);
	
	
		$("body").append(backdrop);
	}
}

var artifactDisplay = new ArtifactDisplay();

window.artifactDisplay = artifactDisplay;

ExecuteWhen("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@d97fc81b32e674d1b23e822468b3f97fa38ed4e4/css/Artifacts.css");
	artifactDisplay.GetAllArtifacts();
	
	window.artifactInfo = artifactDisplay.ViewArtifactInfo.bind(artifactDisplay);
});

export {artifactDisplay};