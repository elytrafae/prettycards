import { prettycards, PrettyCards_plugin } from "./underscript_checker";

var collectionPlace = document.getElementById("collection"); // This is for a workaround with how friendship cards are added.
if (!collectionPlace) {
	collectionPlace = document.createElement("DIV");
	collectionPlace.id = "collection";
	collectionPlace.className = "PrettyCards_Hidden";
	document.body.appendChild(collectionPlace);
}

var season_number = -1;
const seasonKeyStart = "quest-s";
const seasonKeyEnd = "-start-1";

const accessExceptions = ["CMD_God", "Jazmin290"]; // Usernames to let use Translator features for obvious reasons. Might use this for other types of permissions as well later? IDK.

PrettyCards_plugin.events.on("translation:loaded", function(data) {
	var messages = $.i18n.messageStore.messages.en;
	var list = Object.keys(messages);
	
    //for (var key in messages) {
    //    if (key.startsWith(seasonKeyStart) && key.endsWith(seasonKeyEnd)) {
	//		var portion = key.substring(seasonKeyStart.length, key.length-seasonKeyEnd.length);
    //        season_number = Math.max(season_number, Number(portion));
    //    }
    //}

	for (var i=list.length-1; i >= 0; i--) {
		var key = list[i];
		if (key.startsWith(seasonKeyStart) && key.endsWith(seasonKeyEnd)) {
			var portion = key.substring(seasonKeyStart.length, key.length-seasonKeyEnd.length);
            season_number = Number(portion);
			break;
        }
	}
	PrettyCards_plugin.events.emit.singleton("PrettyCards:seasonNumber", season_number);
})


if (String.prototype.splice === undefined) {
	/**
	 * Splices text within a string.
	 * @param {int} offset The position to insert the text at (before)
	 * @param {string} text The text to insert
	 * @param {int} [removeCount=0] An optional number of characters to overwrite
	 * @returns {string} A modified string containing the spliced text.
	 */
	String.prototype.splice = function(offset, text, removeCount=0) {
	  let calculatedOffset = offset < 0 ? this.length + offset : offset;
	  return this.substring(0, calculatedOffset) +
		text + this.substring(calculatedOffset + removeCount);
	};
  }


class Utility {

	constructor() {
		this.githubCSSSources = {};
		this.addCSSSourceData("base", {
			version: GM_info.script.version,
			eventName: "PrettyCards:CommitCSSLoad",
			apiLink: "https://api.github.com/repos/CMD-God/prettycards/commits",
			urlLinkFunc: (data, name) => `https://cdn.jsdelivr.net/gh/CMD-God/prettycards@${data}/css/${name}.css`
		});
	}

	addCSSSourceData(name, settings) {
		this.githubCSSSources[name] = settings;
		PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function(data) {
			if (settings.version == "local") {
				window.$.get(settings.apiLink, function(data) {
					PrettyCards_plugin.events.emit.singleton(settings.eventName, data[0].sha);
				});
			} else {
				PrettyCards_plugin.events.emit.singleton(settings.eventName, settings.version);
			}
		});
	}
	
	loadCSSFromGH(name, srcName = "base") {
		return new Promise((resolve, reject) => {
			var src = this.githubCSSSources[srcName];
			PrettyCards_plugin.events.on(src.eventName, function(data) {
				utility.loadCSSFromLink(src.urlLinkFunc(data, name)).then(resolve).catch(reject);
			});
		});
	}

	loadCSSFromLink(url) {
		return new Promise((resolve, reject) => {
			var e = document.createElement("link");
			e.rel  = 'stylesheet';
			e.type = 'text/css';
			e.href = url;
			e.onload = resolve;
			e.onerror = reject;
			document.head.appendChild(e);
		});
	}
	
	// Some code I found on stack overflow. Let's see if it works . . . 
	copyCSS(from_element, to_element) {
		const styles = window.getComputedStyle(from_element);
		if (styles.cssText !== "") {
			to_element.style.cssText = styles.cssText;
		} else {
			const to_styles = window.getComputedStyle(to_element);
			const cssText = Object.values(styles).reduce(
				(css, propertyName) =>
					`${css}${propertyName}:${styles.getPropertyValue(
						propertyName
					)};`
			);
			to_element.style.cssText = cssText
		}
	}
	
	completeCopyArray(arr) {
		if (!Array.isArray(arr)) {
			return this.completeCopy(arr);
		}
		var copy = [];
		for (var i=0; i < arr.length; i++) {
			if (typeof(arr[i]) == "object") {
				copy[i] = this.completeCopy(arr[i]);
			} else {
				copy[i] = arr[i];
			}
		}
		return copy;
	}
	
	completeCopy(object) { // WARNING! Does not handle recursive refernces!
		if (Array.isArray(object)) {
			return this.completeCopyArray(object);
		}
		var copy = {};
		for (var id in object) {
			if (typeof(object[id]) == "object") {
				copy[id] = this.completeCopy(object[id]);
			} else {
				copy[id] = object[id];
			}
		}
		return copy;
	}
	
	deleteByValue(arr, item) {
		var index = arr.indexOf(item);
		if (index !== -1) {
			arr.splice(index, 1);
			return true;
		}
		return false;
	}
	
	// This. Code. Is. ANCIENT. What is up with this, Onu!?!?
	addFriend(username, callback) {
		$.post("Friends", {username: "Jazmin290", addFriend: "Add friend"}, callback);
	}
	
	appendCardFriendship(card, container, level, currentXp, maxXp) { // Why must you torture me . . . ?
		var $card = window.appendCardFriendship(card, level, currentXp, maxXp);
		container.append($card);
		return $card;
	}

	getFriendshipInfo(id, cb) {
		return $.get("https://raw.githubusercontent.com/PrettyCards/friendship-server/main/data/" + id + ".json", {}, function(data) {
			//console.log(JSON.parse(data));
			cb(JSON.parse(data));
		})
	}

	getXpForLevel(level) {
		return window.U0*level + (level*(level-1))/2*window.R;
	}

	onTestServer() {
		return !['www','undercards'].includes(window.location.hostname.split('.')[0]);
	}

	saveCanvasAsImage(canvas, filename) {
		var link = document.createElement("A");
		link.setAttribute("download", filename + ".png");
		link.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
		link.click();
	}

	// Yes, this one is from Stackoverflow.
	downloadFile(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([content], {type: contentType});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}

	randomInt(min=0, max=1) { // WILL ALWAYS BE SMALLER THAN THE MAX VALUE!
		return min + Math.floor(Math.random() * (max-min));
	}

	getRandomFromArray(array) {
		if (array.length <= 0) {
			return undefined;
		}
		if (array.length == 1) {
			return array[0];
		}
		return array[this.randomInt(0, array.length)];
	}

	/**
	 * Returns the season number relative to the new year.
	 * @returns {number} A number from 0 to 11, where 0 is January and 11 is December.
	 */
	getSeasonMonth() {
		return (season_number - 66)%12; // Season 66 was January 2022.
	}

	getSeasonNumber() {
		return season_number;
	}

	getCardImageLink(image) {
		if (this.getSeasonMonth() == 3) { // Is it an April Season?
			return `/images/aprilFools/cards/${image}.png`;
		}
		return `/images/cards/${image}.png`;
	}

	getArtifactImageLink(image) {
		if (this.getSeasonMonth() == 3) { // Is it an April Season?
			return `/images/aprilFools/artifacts/${image}.png`;
		}
		return `/images/artifacts/${image}.png`;
	}

	preloadAudio(url) {
		return new Promise((resolve, reject) => {
			var audio = new Audio();
			audio.onload = resolve;
			audio.onerror = reject;
			audio.src = url; // Just to be sure it works with every browser.
		})
		
	}

	preloadImage(url) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.onload = resolve;
			image.onerror = reject;
			image.src = url;
		})
	}

	featuresAccessForGroupOnly(groups) {
		if (accessExceptions.includes(window.selfUsername)) {
			return true;
		}
		if (typeof(groups) == "string") {
			groups = [groups];
		}
		for (var i=0; i < window.selfGroups.length; i++) {
			var group = window.selfGroups[i];
			if (groups.includes(group.name)) {
				return true;
			}
		}
		return false;
	}

	translatorFeaturesAccess() {
		return this.featuresAccessForGroupOnly("Translator");
	}

	toLocale(key, locale, data = []) {
		const l = window.$.i18n().locale;
		window.$.i18n().locale = locale;
		let text;
		try {
			text = window.$.i18n(key, ...data);
		} catch (e) {
			text = 'ERROR';
		}
		window.$.i18n().locale = l;
		return text;
	}

	constructURL(prefix, filename, defExt, oldLogic = false) {
		if (oldLogic) {
			return prefix + filename + "." + defExt;
		}
		if (prefix.length > 0 && !prefix.endsWith("/")) {
			prefix = prefix + "/";
		}
		var splitFileName = filename.split(".");
		if (splitFileName.length < 2) {
			filename = filename + "." + defExt;
		}
		return prefix + filename;
	}

	hideUglyPage() { // Nothing personal.
		var children = [...document.querySelector(".mainContent").children];
		//console.log(children);
		for (var i=0; i < children.length; i++) {
			var element = children[i];
			if (element.nodeName == "NAV" || element.nodeName == "FOOTER" || element.nodeName == "SCRIPT" /*|| (element.nodeName == "TABLE" && element.id == "cardsOpen")*/) {
				continue;
			} else {
				element.style.display = "none";
			}
		}
	}
	
}

var utility = new Utility();

prettycards.utility = utility;

export {utility};