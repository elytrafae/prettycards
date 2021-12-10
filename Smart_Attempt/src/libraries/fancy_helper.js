
// Currently only for the fancy Artifact And Soul display thingy.

import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";



class FancyDisplay {
	
	constructor(data) {
		this.data = data;
		//this.backdrop = window.$(`<div class="PrettyCards_ScreenCover PrettyCards_HalfTransparentBG"></div>`);
		//this.backdrop.click(function() {this.remove();});
		
		this.box = window.$(`<div class="PrettyCards_ArtifactDisplayBox"></div>`);
		this.box.click(function (e) {e.stopPropagation();});
		//this.backdrop.append(this.box);
		
		this.circle = window.$(`<div class="PrettyCards_ArtifactCircle"><img class="PrettyCards_ArtifactImage ${data.image_class}" src="${data.image}"></img></div>`);
		this.box.append(this.circle);
		
		this.name = window.$(`<div class="PrettyCards_ArtifactDisplayName ${data.text_class}">${data.name}</div>`);
		this.rarity = window.$(`<div class="PrettyCards_ArtifactDisplayRarity ${data.text_class}">${data.rarity_text}</div>`);
		this.description = window.$(`<div class="PrettyCards_ArtifactDisplayDescription">${data.description}</div>`);
		
		this.box.append(this.name);
		this.box.append(this.rarity);
		this.box.append(this.description);
		
		//$("body").append(this.backdrop);
		window.BootstrapDialog.show({
            title: 'You shouldn\'t be able to see this!',
            message: this.box,
			onshow: this.OnShow
        });
		
	}
	
	OnShow(dial) {
		console.log(dial);
		dial.$modalFooter.css("display", "none");
		dial.$modalHeader.css("display", "none");
		dial.$modalContent.css("background-color", "transparent").css("box-shadow", "initial").css("border", "none").css("padding", "0px");
		dial.$modalBody.css("border", "none").css("background-color", "transparent").css("padding", "0px").css("box-shadow", "initial");
		
	}
	
	static ViewArtifactInfo(id) {
		var artifact = artifactDisplay.GetArtifactById(id);
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
			image_class: "PrettyCards_ArtifactDisplay_" + artifact.rarity
		};
		var helper = new FancyDisplay(data);
	}
	
	static ViewSoulInfo(id) {
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
		
		var data = {
			name: $.i18n("soul-" + id.toLowerCase()),
			text_class: id,
			rarity_text: "Soul",
			description: $.i18n("soul-" + id.toLowerCase() + "-desc"),
			image: image_src,
			image_class: "PrettyCards_ArtifactDisplay_Floating PrettyCards_DisplaySoul_" + id
		};
		var helper = new FancyDisplay(data);
	}
	
}

FancyDisplay.customSouls = [];

ExecuteWhen("PrettyCards:onPageLoad", function() {
	window.artifactInfo = FancyDisplay.ViewArtifactInfo.bind(this);
	window.soulInfo = FancyDisplay.ViewSoulInfo.bind(this);
});

export {FancyDisplay};