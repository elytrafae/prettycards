
import { pagegetters } from "./page_getters";
import { addSetting, prettycards } from "./underscript_checker";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {utility} from "./utility";

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
		this.buyableArtifactIds = {};
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

	AddCustomArtifact(artifact) {
		this.artifacts[artifact.id] = artifact;
	}

	/**@returns {object|null} */
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
		var img = utility.getArtifactImage(artifact.image);
		img.style = "height: 24px;";
		img.className = `pointer PrettyCards_AverageSizedArtifact PrettyCards_Artifact_${artifact.rarity || "COMMON"}`;
		img.setAttribute("name", artifact.name);
		img.setAttribute("image", artifact.image);
		img.setAttribute("legendary", artifact.rarity === "LEGENDARY");
		img.setAttribute("artifactid", artifact.id);
		img.onclick = function () {
			window.artifactInfo(parseInt(this.getAttribute("artifactid")));
		}
		return img;
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

	GetPage(artifactId = -1) {
		return new Promise((resolve, reject) => {
			if (artifactId === -1 && window.underscript.onPage("Artifacts")) {
				resolve(document.getElementsByClassName("mainContent")[0]);
				return;
			}
			var data = {};
			if (artifactId >= 0) {
				data = {idArtifact : artifactId, unlock: "Unlock"};
			}
			//console.log(data);
			$.post("/Artifacts", data, function(data) {
				var $page = $(data);
				// I am officially dead inside.
				// Shout out to my dad for figuring out that doing it with fancy JQuery stuff is not gonna cut it, no matter what we try.
				for (var i=0; i < $page.length; i++) {
					var element = $page[i];
					if (element && element.className && element.classList.contains('mainContent')) {
						resolve(element);
						return;
					}
				}
				reject("ELEMENT_NOT_FOUND_ERROR");
			});
		})
	}

	GetPurchasableArtifacts(artifactId = -1) {
		return new Promise((resolve, reject) => {
			this.GetPage(artifactId).catch(reject).then((page) => {
				var gold = page.querySelector("nav.navbar div .navbar-right .dropdown .dropdown-toggle #golds");
				if (gold) {
					pagegetters.gold = parseInt(gold.innerText);
				}
				var table = page.querySelector("table.table");
				if (!table) {
					resolve([]);
					return;
				}
				var tbody = table.querySelector("tbody");
				if (!tbody) {
					resolve([]);
					return;
				}
				this.buyableArtifactIds = [];
				for (var i=0; i < tbody.children.length; i++) {
					var row = tbody.children[i];
					if (!row) {
						console.error("Somehow, someway, row #" + i + " does not exist, despite tbody.children.length being " + tbody.children.length);
						resolve(this.buyableArtifactIds);
						return;
					}
					/**@type {String} */
					var nameId = row.children[1].getAttribute("data-i18n");
					var price = parseInt(row.children[4].firstChild.innerText);
					var id = parseInt(lastOf(nameId.split('-')));
					//console.log(row, nameId, id);
					this.buyableArtifactIds[id] = price;
				}
				resolve(this.buyableArtifactIds);
			})
		});
	}

	IsArtifactPurchasable(artifactId) {
		return this.BuyPriceForArtifact(artifactId) > -1;
	}

	BuyPriceForArtifact(artifactId) {
		if (artifactId in this.buyableArtifactIds) {
			return this.buyableArtifactIds[artifactId];
		}
		return -1;
	}

	BuyArtifact(artifactId) {
		this.GetPurchasableArtifacts(artifactId).catch((err) => {
			console.error(err);
			PrettyCards_plugin.events.emit("PrettyCards:artBuyError");
		}).then((list) => {
			if (this.IsArtifactPurchasable(artifactId)) {
				console.warn("Server error when buying artifact");
				PrettyCards_plugin.events.emit("PrettyCards:artBuyError");
				return;
			}
			// Gold being set the the correct amount is fixed in GetPurchasableArtifacts!
			PrettyCards_plugin.events.emit("PrettyCards:artBuySuccess", {idArtifact: artifactId, artifact: this.GetArtifactById(artifactId)});
		})
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
	artifactDisplay.GetPurchasableArtifacts();
});

function lastOf(list) {
	if (list.length <= 0) {
		return null;
	}
	return list[list.length-1];
}

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
