
// Currently only for the fancy Artifact And Soul display thingy.

import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import { prettycards, PrettyCards_plugin } from "./underscript_checker";
import { createFloatingSoul } from "./floating_souls";
import { pagegetters } from "./page_getters";

class FancyListDisplay {
	
	constructor(datas, title) {
		const disabledText = `<span class='gray'>(${window.$.i18n("pc-fd-disabled")})</span>`;

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
            title: title || window.$.i18n("artifacts-title"),
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
		
		// <img class="PrettyCards_ArtifactImage ${data.image_class} ${data.disabled ? "transparent" : ""}" src="${data.image}"></img>
		this.circle = window.$(`<div class="PrettyCards_ArtifactCircle"></div>`);
		this.circle.append(createFloatingSoul(data.image, data.image_class, "", ""));
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
			this.disabled = window.$(`<div class="PrettyCards_ArtifactDisplayDisabled gray">(${window.$.i18n("pc-fd-disabled")})</div>`);
			this.box.append(this.disabled);
		}

		this.box.append(this.description);

		if (data.shopInfo) {
			var priceText = `<span class="yellow">${data.shopInfo.price}</span> <img src="images/icons/gold.png" class="height-16">`;
			var bottomText = window.$.i18n("pc-buyart-nomuns", priceText);
			if (data.shopInfo.hasEnough) {
				bottomText = window.$.i18n("pc-buyart-willyoubuy", priceText) + ` <button class="btn btn-success">${$.i18n("artifacts-unlock")}</button>`;
			}
			this.shop = window.$(`<div class="PrettyCards_ArtifactDisplayShop">${data.shopInfo.topLine}<br>${bottomText}</div>`);
			this.shop.find("button").click(function() {data.shopInfo.action(this)}.bind(this));
			this.box.append(this.shop);
		}
		
		if (data.note && data.note.length > 0) {
			this.noteTitle = window.$(`<div class="PrettyCards_ArtifactDisplayNoteTitle">${window.$.i18n("pc-fd-authornote")}</div>`);
			this.note = window.$(`<div class="PrettyCards_ArtifactDisplayNote">${data.note}</div>`);
			
			this.box.append(this.noteTitle);
			this.box.append(this.note);
		}
		
		//$("body").append(this.backdrop);
		var dial = window.BootstrapDialog.show({
            title: 'You shouldn\'t be able to see this!',
			size: data.size || window.BootstrapDialog.SIZE_NORMAL,
            message: this.box,
			onshow: this.OnShow
        });

		dial.$modalDialog[0].className = "modal-dialog modal-lg";
		
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
		var image_src = utility.getArtifactImageLink(artifact.image);
		if (artifact.collection) {
			var c = artifact.collection;
			var isAprilFools = utility.getSeasonMonth() == 3 && artifact.aprilImage;
			var prefix = isAprilFools ? c.aprilArtifactImagePrefix  : c.artifactImagePrefix;
			var imageName = isAprilFools ? artifact.aprilImage : artifact.image;

			image_src = utility.constructURL(prefix, imageName, "png", c.oldPrefixBehavior);
		}
		var shopInfo;
		if (!artifact.collection && !artifact.owned && !artifact.unavailable && !underscript.onPage("Game") && !underscript.onPage("Spectate")) {
			const artId = id;
			shopInfo = {
				price: artifact.cost,
				topLine: window.$.i18n("pc-buyart-youdonthave"),
				hasEnough: artifact.cost <= pagegetters.gold,
				action: function(helper) {
					PrettyCards_plugin.events.on("PrettyCards:artBuySuccess", function() {
						helper.shop.addClass("PrettyCards_Hidden");
					})
					artifactDisplay.BuyArtifact(artId);
				}
			}
		}
		var imageClass = "PrettyCards_ArtifactDisplay_" + artifact.rarity;
		var rarityText = window.$.i18n("pc-fd-artifactwithrarity", window.$.i18n("rarity-" + artifact.rarity.toLowerCase()));
		if (artifact.soul) {
			imageClass = "PrettyCards_ArtifactDisplay_SoulArt_" + artifact.soul;
			rarityText = window.$.i18n("pc-fd-artifactwithrarity", window.$.i18n("soul-" + artifact.soul.toLowerCase()));
		}
		var data = {
			name: $.i18n("artifact-name-" + artifact.id),
			image: image_src,
			text_class: artifact.soul || artifact.rarity || "COMMON",
			rarity_text: rarityText,
			description: window.$.i18n("artifact-" + artifact.id),
			image_class: imageClass,
			note: window.$.i18n(artifact.note || ""),
			disabled: artifact.disabled,
			counter: artifact.counter,
			shopInfo: shopInfo
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
			var c = customObj.collection;
			var isAprilFools = utility.getSeasonMonth() == 3 && customObj.aprilImage;
			var prefix = isAprilFools ? c.aprilSoulImagePrefix  : c.soulImagePrefix;
			var imageName = isAprilFools ? customObj.aprilImage : customObj.image;

			image_src = utility.constructURL(prefix, imageName, "png", c.oldPrefixBehavior);
		}
		//console.log("CUSTOM SOUL", customObj, FancyDisplay.customSouls, image_src);
		
		var transDesc = window.$.i18n("soul-" + id.toLowerCase() + "-desc");
		var transName = window.$.i18n("soul-" + id.toLowerCase());

		var desc = window.$(`<div><div>${transDesc}</div><div class="PrettyCards_SoulDisplay_SpellsHeader">${window.$.i18n("pc-fd-soulspells", transName)}:</div></div>`);
		var cards = window.$(`<div class="PrettyCards_SoulDisplay_Spells"></div>`);
		for (var i=0; i < window.allCards.length; i++) {
			var card = window.allCards[i];
			if (card.soul && card.soul.name === id) {
				window.appendCard(card, cards);
			}
		}
		
		desc.append(cards);
		
		var data = {
			name: transName,
			text_class: id,
			rarity_text: window.$.i18n("pc-fd-soul"),
			description: desc,
			image: image_src,
			image_class: "PrettyCards_ArtifactDisplay_Floating PrettyCards_DisplaySoul_" + id,
			note: (customObj ? window.$.i18n(customObj.note || "") : ""),
			size: BootstrapDialog.SIZE_LARGE
		};
		var helper = new FancyDisplay(data);
		PrettyCards_plugin.events.emit("viewSoul()", {id: id, helper: helper});
	}

	static ViewArtifactsInfoBox(box) {
		if (window.$(box).find('.artifact-img').length > 0) {
			var datas = [];
			$(box).find('.artifact-img').each(function() {
				var artifactId = Number($(this).attr("artifactId"));
				var artifactCounter = Number($(this).next(".artifact-custom").html());
				var isDisabled = $(this).hasClass("artifact-disabled");
				datas.push({id: artifactId, counter: artifactCounter, disabled: isDisabled});
			});
			FancyDisplay.ViewArtifactsInfo(datas);
		}
	}

	static ViewArtifactsInfoForIdArray(arr, title) {
		var datas = [];
		arr.forEach(id => {
			datas.push({id : id});
		})
		FancyDisplay.ViewArtifactsInfo(datas, title);
	}
	
	static ViewArtifactsInfo(artDatas, title) {
		PrettyCards_plugin.events.emit("pre:viewArtifacts", artDatas);
		//console.log(box);
		if (artDatas.length > 0) {
			var datas = [];
			artDatas.forEach(artData => {
				var artifactId = artData.id;
				var artifactCounter = artData.counter;
				var isDisabled = artData.disabled;
				var artifact = artifactDisplay.GetArtifactById(artifactId);
				//console.log("ARTIFACT_ID", artifactId, artifact, artifactDisplay);
				var image_src = utility.getArtifactImageLink(artifact.image);
				if (artifact.collection) {
					var c = artifact.collection;
					var isAprilFools = utility.getSeasonMonth() == 3 && artifact.aprilImage;
					var prefix = isAprilFools ? c.aprilArtifactImagePrefix  : c.artifactImagePrefix;
					var imageName = isAprilFools ? artifact.aprilImage : artifact.image;

					image_src = utility.constructURL(prefix, imageName, "png", c.oldPrefixBehavior);
				}
				datas.push({
					name: $.i18n("artifact-name-" + artifact.id),
					image: image_src,
					text_class: artifact.rarity || "COMMON",
					rarity_text: window.$.i18n("pc-fd-artifactwithrarity", window.$.i18n("rarity-" + artifact.rarity.toLowerCase())),
					description: window.$.i18n("artifact-" + artifact.id),
					image_class: "PrettyCards_ArtifactDisplay_" + artifact.rarity,
					disabled: isDisabled, // || artifact.disabled,
					counter: artifactCounter || artifact.counter
				});
			});
			var helper = new FancyListDisplay(datas, title);
			PrettyCards_plugin.events.emit("viewArtifacts()", {artDatas: artDatas, helper: helper});
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
	utility.loadCSSFromGH("CustomCards");
	
	window.artifactInfo = FancyDisplay.ViewArtifactInfo.bind(this);
	window.showArtifactDescBox = FancyDisplay.ViewArtifactInfo.bind(this);
	window.soulInfo = FancyDisplay.ViewSoulInfo.bind(this);
	window.artifactsInfo = FancyDisplay.ViewArtifactsInfoBox.bind(this);
	
	prettycards.viewArtifactsInfoForIdArray = FancyDisplay.ViewArtifactsInfoForIdArray.bind(this);

	// Test functions
	window.testArtifactsInfo = FancyDisplay.TestArtifactsInfo.bind(this);
	//
});

prettycards.FancyDisplay = FancyDisplay;

export {FancyDisplay};