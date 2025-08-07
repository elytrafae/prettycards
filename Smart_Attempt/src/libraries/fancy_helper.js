
// Currently only for the fancy Artifact And Soul display thingy.

import {utility} from "/src/libraries/utility.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {artifactDisplay} from "/src/libraries/artifact_display.js";
import { addSetting, prettycards, PrettyCards_plugin, settings } from "./underscript_checker";
import { createFloatingSoul } from "./floating_souls";
import { pagegetters } from "./page_getters";

import { loadCSS } from "../libraries/css_loader";
import css1 from "../css/CustomCards.css";
import css2 from "../css/ArtifactBackgrounds.css";
loadCSS(css1);
loadCSS(css2);

class FancyDisplayData {

	constructor() {
		/**@type {string} */
		this.backgroundClass = "";
		/**@type {HTMLImageElement} */
		this.image = null;
		/**@type {string} */
		this.imageClass = "";
		/**@type {boolean} */
		this.disabled = false;
		/**@type {boolean} */
		this.isImageBig = false;
		/**@type {number} */
		this.counter = 0;
		/**@type {string} */
		this.name = "";
		/**@type {string} */
		this.textClass = "";
		/**@type {string} */
		this.rarityText = "";
		/**@type {any} */
		this.description = "";
		this.shopInfo = null;
		/**@type {string} */
		this.note = "";
		/**@type {string} */
		this.size = window.BootstrapDialog.SIZE_NORMAL;
	}

	/**@returns {FancyDisplayData} */
	setBackgroundClass(/**@type {string} */ val) {
		this.backgroundClass = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setImage(/**@type {HTMLImageElement} */ val) {
		this.image = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setImageClass(/**@type {string} */ val) {
		this.imageClass = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setDisabled(/**@type {boolean} */ val) {
		this.disabled = val || false;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setBigImage(/**@type {boolean} */ val) {
		this.isImageBig = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setCounter(/**@type {number} */ val) {
		this.counter = val || 0;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setName(/**@type {string} */ val) {
		this.name = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setTextClass(/**@type {string} */ val) {
		this.textClass = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setRarityText(/**@type {string} */ val) {
		this.rarityText = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setDescription(/**@type {any} */ val) {
		this.description = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setShopInfo(/**@type {any} */ val) {
		this.shopInfo = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setNote(/**@type {string} */ val) {
		this.note = val;
		return this;
	}

	/**@returns {FancyDisplayData} */
	setSize(/**@type {string} */ val) {
		this.size = val;
		return this;
	}

}

class FancyListDisplay {

	constructor(/**@type {Array<FancyDisplayData>}*/ datas, title) {
		const disabledText = `<span class='gray'>(${window.$.i18n("pc-fd-disabled")})</span>`;

		var container = window.$(`<div class="PrettyCards_ArtifactListContainer"></div>`);

		for (var i=0; i < datas.length; i++) {
			var data = datas[i];
			var bgClass = settings.no_artifact_background.value() ? "" : (data.backgroundClass || "");
			var row = window.$(`<div class="PrettyCards_ArtifactListRow"><div class="PrettyCards_ArtifactListBackground ${bgClass}"></div></div>`);
			//var circle = window.$(`<div class="PrettyCards_ArtifactListCircle"><img class="PrettyCards_ArtifactListImage ${data.image_class} ${data.disabled ? "transparent" : ""}" src="${data.image}"></img></div>`);
			var circle = window.$(`<div class="PrettyCards_ArtifactListCircle"></div>`);
			console.log(data);
			var floatingSoul = createFloatingSoul(data.image, `PrettyCards_ArtifactListImage ${data.imageClass} ${data.disabled ? "transparent" : ""}`, "", "", data.isImageBig);
			circle.append(floatingSoul);
			row.append(circle);

			if (data.counter && data.counter > 0) {
				var counter = window.$(`<div class="PrettyCards_ArtifactListCounter">${data.counter}</div>`);
				row.append(counter);
			}

			var namestr = `${data.name} (${data.rarityText}) ${data.disabled ? disabledText : ""}`;
			var name = window.$(`<div class="PrettyCards_ArtifactListName ${data.textClass}">${namestr}</div>`);
			name.css("font-size", utility.getResizedFontSizeHorizontal(namestr, 25, 538, 10, 0.5));
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

	constructor(/**@type {FancyDisplayData}*/ data) {
		this.data = data;
		//this.backdrop = window.$(`<div class="PrettyCards_ScreenCover PrettyCards_HalfTransparentBG"></div>`);
		//this.backdrop.click(function() {this.remove();});

		var bgClass = settings.no_artifact_background.value() ? "" : (data.backgroundClass || "");
		this.box = window.$(`<div class="PrettyCards_ArtifactDisplayBox ${bgClass}"></div>`);
		this.box.click(function (e) {e.stopPropagation();});
		//this.backdrop.append(this.box);

		// <img class="PrettyCards_ArtifactImage ${data.image_class} ${data.disabled ? "transparent" : ""}" src="${data.image}"></img>
		this.circle = window.$(`<div class="PrettyCards_ArtifactCircle"></div>`);
		console.log(data);
		this.circle.append(createFloatingSoul(data.image, data.imageClass, "", "", data.isImageBig));
		this.box.append(this.circle);

		this.name = window.$(`<div class="PrettyCards_ArtifactDisplayName ${data.textClass}">${data.name}</div>`);
		this.rarity = window.$(`<div class="PrettyCards_ArtifactDisplayRarity ${data.textClass}">${data.rarityText}</div>`);
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
		/**@type {HTMLImageElement} */
		var image;
		if (artifact.collection) {
			var c = artifact.collection;
			var isAprilFools = utility.getSeasonMonth() == 3 && artifact.aprilImage;
			var prefix = isAprilFools ? c.aprilArtifactImagePrefix  : c.artifactImagePrefix;
			var imageName = isAprilFools ? artifact.aprilImage : artifact.image;

			image = document.createElement("IMG");
			image.src = utility.constructURL(prefix, imageName, "png", c.oldPrefixBehavior);
		} else {
			image = utility.getArtifactImage(artifact.image);
		}
		var shopInfo;
		if (artifactDisplay.IsArtifactPurchasable(id) && !underscript.onPage("Game") && !underscript.onPage("Spectate")) {
			const artId = id;
			var cost = artifactDisplay.BuyPriceForArtifact(id);
			shopInfo = {
				price: cost,
				topLine: window.$.i18n("pc-buyart-youdonthave"),
				hasEnough: cost <= pagegetters.gold,
				action: function(helper) {
					PrettyCards_plugin.events.on("PrettyCards:artBuySuccess", function() {
						helper.shop.addClass("PrettyCards_Hidden");
					})
					artifactDisplay.BuyArtifact(artId);
				}
			}
		}
		var rarityData = artifactDisplay.GetRarityDataFor(artifact);
		var data = new FancyDisplayData()
			.setName($.i18n("artifact-name-" + artifact.id))
			.setImage(image)
			.setTextClass(rarityData.txtClass)
			.setRarityText(rarityData.text)
			.setDescription(window.$.i18n("artifact-" + artifact.id))
			.setImageClass(rarityData.imgClass)
			.setNote(window.$.i18n(artifact.note || ""))
			.setDisabled(artifact.disabled)
			.setCounter(artifact.counter)
			.setShopInfo(shopInfo)
			.setBackgroundClass(artifact.backgroundClass)
			.setBigImage(artifact.isImageBig || false);
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
		/**@type {HTMLImageElement} */
		var image;
		if (customObj) {
			var c = customObj.collection;
			var isAprilFools = utility.getSeasonMonth() == 3 && customObj.aprilImage;
			var prefix = isAprilFools ? c.aprilSoulImagePrefix  : c.soulImagePrefix;
			var imageName = isAprilFools ? customObj.aprilImage : customObj.image;

			image = document.createElement("IMG");
			image.src = utility.constructURL(prefix, imageName, "png", c.oldPrefixBehavior);
		} else {
			image = utility.getSoulImage(id);
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

		var data = new FancyDisplayData()
			.setName(transName)
			.setImage(image)
			.setTextClass(id)
			.setRarityText(window.$.i18n("pc-fd-soul"))
			.setDescription(desc)
			.setImageClass("PrettyCards_ArtifactDisplay_Floating PrettyCards_DisplaySoul_" + id)
			.setNote(customObj ? window.$.i18n(customObj.note || "") : "")
			.setSize(BootstrapDialog.SIZE_LARGE);
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
				var rarityData = artifactDisplay.GetRarityDataFor(artifact);
				//console.log("ARTIFACT_ID", artifactId, artifact, artifactDisplay);
				/**@type {HTMLImageElement} */
				var image = artifact.image;
				if (artifact.collection) {
					var c = artifact.collection;
					var isAprilFools = utility.getSeasonMonth() == 3 && artifact.aprilImage;
					var prefix = isAprilFools ? c.aprilArtifactImagePrefix  : c.artifactImagePrefix;
					var imageName = isAprilFools ? artifact.aprilImage : artifact.image;

					image = document.createElement("IMG");
					image.src = utility.constructURL(prefix, imageName, "png", c.oldPrefixBehavior);
				}
				datas.push(new FancyDisplayData()
					.setName($.i18n("artifact-name-" + artifact.id))
					.setImage(image)
					.setTextClass(rarityData.txtClass)
					.setRarityText(rarityData.text)
					.setDescription(window.$.i18n("artifact-" + artifact.id))
					.setImageClass(rarityData.imgClass)
					.setNote(window.$.i18n(artifact.note || ""))
					.setDisabled(isDisabled)
					.setCounter(artifactCounter)
					.setBackgroundClass(artifact.backgroundClass)
					.setBigImage(artifact.isImageBig || false)
				);
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

	window.artifactInfo = FancyDisplay.ViewArtifactInfo.bind(this);
	window.showArtifactDescBox = FancyDisplay.ViewArtifactInfo.bind(this);
	window.soulInfo = FancyDisplay.ViewSoulInfo.bind(this);
	window.artifactsInfo = FancyDisplay.ViewArtifactsInfoBox.bind(this);

	prettycards.viewArtifactsInfoForIdArray = FancyDisplay.ViewArtifactsInfoForIdArray.bind(this);

	// Test functions
	prettycards.testArtifactsInfo = FancyDisplay.TestArtifactsInfo.bind(this);
	//
});

prettycards.FancyDisplay = FancyDisplay;

export {FancyDisplay};