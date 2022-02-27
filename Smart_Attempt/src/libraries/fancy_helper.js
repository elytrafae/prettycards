
// Currently only for the fancy Artifact And Soul display thingy.

import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import { PrettyCards_plugin } from "./underscript_checker";

const disabledText = "<span class='gray'>(Disabled)</span>";

class FancyListDisplay {
	
	constructor(datas) {
		var container = window.$(`<div class="PrettyCards_ArtifactListContainer"></div>`);
		
		for (var i=0; i < datas.length; i++) {
			var data = datas[i];
			var row = window.$(`<div class="PrettyCards_ArtifactListRow"></div>`);
			var circle = window.$(`<div class="PrettyCards_ArtifactListCircle"><img class="PrettyCards_ArtifactListImage ${data.image_class} ${data.disabled ? "transparent" : ""}" src="${data.image}"></img></div>`);
			row.append(circle);
			
			if (data.counter && data.counter > 0) {
				var counter = window.$(`<div class="PrettyCards_ArtifactListCounter">${data.counter}</div>`);
				row.append(counter);
			}

			var name = window.$(`<div class="PrettyCards_ArtifactListName ${data.text_class}">${data.name} (${data.rarity_text}) ${data.disabled ? disabledText : ""}</div>`);
			var description = window.$(`<div class="PrettyCards_ArtifactListDescription"></div>`);
			description.append(data.description);
			
			row.append(name);
			row.append(description);
			container.append(row);
		}
		
		window.BootstrapDialog.show({
            title: window.$.i18n("artifacts-title"),
            message: container,
			//onshow: this.OnShow
			buttons: [
				{
					label: window.$.i18n("dialog-ok"),
					cssClass: 'btn-primary',
					action: function(dialog) {
						dialog.close();
					}
				}
			]
        });
		
	}
	
}

class FancyDisplay {
	
	constructor(data) {
		this.data = data;
		//this.backdrop = window.$(`<div class="PrettyCards_ScreenCover PrettyCards_HalfTransparentBG"></div>`);
		//this.backdrop.click(function() {this.remove();});
		
		this.box = window.$(`<div class="PrettyCards_ArtifactDisplayBox"></div>`);
		this.box.click(function (e) {e.stopPropagation();});
		//this.backdrop.append(this.box);
		
		this.circle = window.$(`<div class="PrettyCards_ArtifactCircle"><img class="PrettyCards_ArtifactImage ${data.image_class} ${data.disabled ? "transparent" : ""}" src="${data.image}"></img></div>`);
		this.box.append(this.circle);
		
		this.name = window.$(`<div class="PrettyCards_ArtifactDisplayName ${data.text_class}">${data.name}</div>`);
		this.rarity = window.$(`<div class="PrettyCards_ArtifactDisplayRarity ${data.text_class}">${data.rarity_text}</div>`);
		this.description = window.$(`<div class="PrettyCards_ArtifactDisplayDescription"></div>`);
		this.description.append(data.description);
		if (data.counter && data.counter > 0) {
			this.counter = window.$(`<div class="PrettyCards_ArtifactDisplayCounter">${data.counter}</div>`);
			this.box.append(this.counter);
		}
		
		this.box.append(this.name);
		this.box.append(this.rarity);

		if (data.disabled) {
			this.disabled = window.$(`<div class="PrettyCards_ArtifactDisplayDisabled gray">(Disabled)</div>`);
			this.box.append(this.disabled);
		}

		this.box.append(this.description);
		
		if (data.note && data.note.length > 0) {
			this.noteTitle = window.$(`<div class="PrettyCards_ArtifactDisplayNoteTitle">Author's Note</div>`);
			this.note = window.$(`<div class="PrettyCards_ArtifactDisplayNote">${data.note}</div>`);
			
			this.box.append(this.noteTitle);
			this.box.append(this.note);
		}
		
		//$("body").append(this.backdrop);
		window.BootstrapDialog.show({
            title: 'You shouldn\'t be able to see this!',
            message: this.box,
			onshow: this.OnShow
        });
		
	}
	
	OnShow(dial) {
		//console.log(dial);
		dial.$modalFooter.css("display", "none");
		dial.$modalHeader.css("display", "none");
		dial.$modalContent.css("background-color", "transparent").css("box-shadow", "initial").css("border", "none").css("padding", "0px");
		dial.$modalBody.css("border", "none").css("background-color", "transparent").css("padding", "0px").css("box-shadow", "initial");
		
	}
	
	static ViewArtifactInfo(id) {
		var artifact = artifactDisplay.GetArtifactById(id);
		PrettyCards_plugin.events.emit("pre:viewArtifact()", artifact);
		var image_src = "images/artifacts/" + artifact.image + ".png";
		if (artifact.collection) {
			image_src = artifact.collection.artifactImagePrefix + artifact.image + ".png";
		}
		var data = {
			name: $.i18n("artifact-name-" + artifact.id),
			image: image_src,
			text_class: artifact.rarity || "COMMON",
			rarity_text: artifact.rarity + " Artifact",
			description: $.i18n("artifact-" + artifact.id),
			image_class: "PrettyCards_ArtifactDisplay_" + artifact.rarity,
			note: window.$.i18n(artifact.note || ""),
			disabled: artifact.disabled,
			counter: artifact.counter
		};
		var helper = new FancyDisplay(data);
		PrettyCards_plugin.events.emit("viewArtifact()", {artifact: artifact, helper: helper});
	}
	
	static ViewSoulInfo(id) {
		PrettyCards_plugin.events.emit("pre:viewSoul", id);
		var customObj = null;
		for (var i = 0; i < FancyDisplay.customSouls.length; i++) {
			var soul = FancyDisplay.customSouls[i];
			if (soul.name === id) {
				customObj = soul;
				break;
			}
		}
		var image_src = "https://github.com/CMD-God/prettycards/raw/master/img/Souls/" + id + ".png";
		if (customObj) {
			
			image_src = customObj.collection.soulImagePrefix + customObj.image + ".png";
		}
		//console.log("CUSTOM SOUL", customObj, FancyDisplay.customSouls, image_src);
		
		var desc = window.$(`<div><div>${window.$.i18n("soul-" + id.toLowerCase() + "-desc")}</div><div class="PrettyCards_SoulDisplay_SpellsHeader">${id} Spells:</div></div>`);
		var cards = window.$(`<div class="PrettyCards_SoulDisplay_Spells"></div>`);
		for (var i=0; i < window.allCards.length; i++) {
			var card = window.allCards[i];
			if (card.soul && card.soul.name === id) {
				window.appendCard(card, cards);
			}
		}
		
		desc.append(cards);
		
		var data = {
			name: window.$.i18n("soul-" + id.toLowerCase()),
			text_class: id,
			rarity_text: "Soul",
			description: desc,
			image: image_src,
			image_class: "PrettyCards_ArtifactDisplay_Floating PrettyCards_DisplaySoul_" + id,
			note: (customObj ? window.i18n(customObj.note || "") : "")
		};
		var helper = new FancyDisplay(data);
		PrettyCards_plugin.events.emit("viewSoul()", {id: id, helper: helper});
	}
	
	static ViewArtifactsInfo(box) {
		PrettyCards_plugin.events.emit("pre:viewArtifacts", box);
		//console.log(box);
		 if (window.$(box).find('.artifact-img').length > 0) {
			var datas = [];
			$(box).find('.artifact-img').each(function() {
				var artifactId = Number($(this).attr("artifactId"));
				var artifactCounter = Number($(this).next(".artifact-custom").html());
				var isDisabled = $(this).hasClass("artifact-disabled");
				var artifact = artifactDisplay.GetArtifactById(artifactId);
				//console.log("ARTIFACT_ID", artifactId, artifact, artifactDisplay);
				var image_src = "images/artifacts/" + artifact.image + ".png";
				if (artifact.collection) {
					image_src = artifact.collection.artifactImagePrefix + artifact.image + ".png";
				}
				datas.push({
					name: $.i18n("artifact-name-" + artifact.id),
					image: image_src,
					text_class: artifact.rarity || "COMMON",
					rarity_text: artifact.rarity + " Artifact",
					description: $.i18n("artifact-" + artifact.id),
					image_class: "PrettyCards_ArtifactDisplay_" + artifact.rarity,
					disabled: isDisabled, // || artifact.disabled,
					counter: artifactCounter || artifact.counter
				});
			});
			var helper = new FancyListDisplay(datas);
			PrettyCards_plugin.events.emit("viewArtifacts()", {box: box, helper: helper});
		 }
	}
	
	static TestArtifactsInfo() {
		PrettyCards_plugin.events.emit("pre:viewArtifacts", box);
		var box = window.$("<div></div>");
		for (var i=0; i < artifactDisplay.artifacts.length; i++) {
			var art = artifactDisplay.artifacts[i];
			box.append(`<img class="artifact-img" artifactId="${art.id}">`);
		}
		window.artifactsInfo(box);
		PrettyCards_plugin.events.emit("viewArtifacts()", {});
	}
	
}

FancyDisplay.customSouls = [];

ExecuteWhen("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@57daa38bc3b9368d702810055c5f74cb3e90b196/css/CustomCards.css");
	
	window.artifactInfo = FancyDisplay.ViewArtifactInfo.bind(this);
	window.showArtifactDescBox = FancyDisplay.ViewArtifactInfo.bind(this);
	window.soulInfo = FancyDisplay.ViewSoulInfo.bind(this);
	window.artifactsInfo = FancyDisplay.ViewArtifactsInfo.bind(this);
	
	// Test functions
	window.testArtifactsInfo = FancyDisplay.TestArtifactsInfo.bind(this);
	//
});

export {FancyDisplay};