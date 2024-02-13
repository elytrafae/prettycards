import { prettycards, PrettyCards_plugin, settings } from "./underscript_checker";
import {getOrCreateCardBottomLeftInfo} from "./card_modifyers/basic_universal_card_additions";
import { Currency } from "./shared_types/currency";

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

const accessExceptions = ["elytrafae", "Jazmin290"]; // Usernames to let use Translator features for obvious reasons. Might use this for other types of permissions as well later? IDK.

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


class SortedUniqueEntryHolder {

	constructor(mapFunc = (ele) => ele) {
		this.arr = [];
		this.mapFunc = mapFunc;
	}

	insert(value) {
		var s = 0, e = this.arr.length - 1;
		while (s <= e) {
			var m = (s + e) >>> 1;
			var ele = this.arr[m];
			var mappedEle = this.mapFunc(ele);
			var mappedVal = this.mapFunc(value);
			if (mappedEle === mappedVal) {
				// Already exists. Will not to anything.
				return false;
			}
			if (mappedVal > mappedEle) {
				s = m+1;
			} else {
				e = m - 1;
			}
		}
		this.arr.splice(s, 0, value);
		return true;
	}

	getPos(value) {
		return utility.binarySearch(this.arr, value, this.mapFunc);
	}

	includes(value) {
		return utility.binarySearch(this.arr, value, this.mapFunc) !== null;
	}

}

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
		this.SortedUniqueEntryHolder = SortedUniqueEntryHolder;
		/*
		this.githubCSSSources = {};
		this.addCSSSourceData("base", {
			version: GM_info.script.version,
			eventName: "PrettyCards:CommitCSSLoad",
			apiLink: "https://api.github.com/repos/elytrafae/prettycards/commits",
			urlLinkFunc: (data, name) => `https://cdn.jsdelivr.net/gh/elytrafae/prettycards@${data}/css/${name}.css`
		});
		*/
	}

	/*
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
	*/

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
		$.post("Friends", {username: username, addFriend: "Add friend"}, callback);
	}
	
	appendCardFriendship(card, container, level, currentXp, maxXp) { // Why must you torture me . . . ?
		var $card = window.appendCardFriendship(card, level, currentXp, maxXp);
		$card.find('.cardDesc').empty();
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
	downloadFile(content, fileName, contentType = "text/plain") {
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
			return `/afi/cards/${image}.png`;
		}
		return `/images/cards/${image}.png`;
	}

	/**@deprecated Use getArtifactImage instead unless very necessary!*/
	getArtifactImageLink(image, forceNoHd = false) {
		if (this.getSeasonMonth() == 3) { // Is it an April Season?
			return `/afi/artifacts/${image}.png`;
		}
		if (settings.hd_artifacts.value() && !forceNoHd) {
			return `https://raw.githubusercontent.com/elytrafae/prettycards/master/img/HDArtifacts/${image}.png`;
		}
		return `/images/artifacts/${image}.png`;
	}

	getArtifactImage(/**@type {string}*/ image) {
		var mainImage = `/images/artifacts/${image}.png`;
		var backupImage = mainImage;
		if (this.getSeasonMonth() == 3) { // Is it an April Season?
			mainImage = `/afi/artifacts/${image}.png`;
		} else if (settings.hd_artifacts.value()) {
			mainImage = `https://raw.githubusercontent.com/elytrafae/prettycards/master/img/HDArtifacts/${image}.png`;
		}
		var element = new Image();
		element.onerror = function() {
			this.src = backupImage;
			element.onerror = function() {}
		}
		element.src = mainImage;
		return element;
	}

	getSoulImageLink(image, forceNoHd = false) {
		if (!forceNoHd) {
			return `https://github.com/elytrafae/prettycards/raw/master/img/Souls/${image}.png`;
		}
		return `/images/souls/${image}.png`;
	}

	getCardJingleLink(card_name = "") {
		card_name = card_name.replaceAll(" ", "_");
		if (this.getSeasonMonth() == 3) { // Is it an April Season?
			return `/afm/cards/${card_name}.ogg`;
		}
		return `/musics/cards/${card_name}.ogg`;
	}

	preloadAudio(url) {
		return new Promise((resolve, reject) => {
			var audio = new Audio();
			audio.onload = function() {resolve(audio)};
			audio.onerror = reject;
			audio.src = url;
		})
		
	}

	preloadImage(url) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.onload = function() {resolve(image)};
			image.onerror = reject;
			image.src = url;
		})
	}

	resizePixelArt(img, scale = 1) {
		console.log(img, scale);
		var offtx = document.createElement('CANVAS').getContext('2d');
		offtx.height = img.height;
		offtx.width = img.width;
		offtx.drawImage(img,0,0);
		var imgData = offtx.getImageData(0,0,img.width,img.height).data;

		var retCanv = document.createElement("CANVAS");
		retCanv.height = img.height * scale;
		retCanv.width = img.width * scale;
		var ctx2 = retCanv.getContext('2d');
		for (var x=0;x<img.width;++x){
			for (var y=0;y<img.height;++y){
			  	// Find the starting index in the one-dimensional image data
				var i = (y*img.width + x)*4;
				var r = imgData[i  ];
				var g = imgData[i+1];
				var b = imgData[i+2];
				var a = imgData[i+3];
				ctx2.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
				ctx2.fillRect(x*scale,y*scale,scale,scale);
			}
		}

		document.body.appendChild(retCanv);

		return retCanv;
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
				element.style.setProperty("display", "none", "important");
				element.className += " PrettyCards_Hidden";
			}
		}
	}

	binarySearch(array, value, mapFunc = (ele) => ele) {
		var s = 0, e = array.length - 1;
		while (s <= e) {
			var m = (s + e) >>> 1;
			var ele = array[m];
			var mappedVal = mapFunc(ele);
			if (mappedVal === value) {
				return array[m];
			}
			if (value > mappedVal) {
				s = m+1;
			} else {
				e = m - 1;
			}
		}
		return null;
	}

	// From StackOverflow: https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
	getCoordsRelativeToDocument(elem) { // crossbrowser version
		var box = elem.getBoundingClientRect();
	
		var body = document.body;
		var docEl = document.documentElement;
	
		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
	
		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;
	
		var top  = box.top +  scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;
	
		return { top: Math.round(top), left: Math.round(left), width: box.width, height: box.height };
	}

	addCustomSimpleTextIconToCard(cardElement, iconSrc, text, windowTitle = window.$.i18n('dialog-information')) {
		this.addCustomSimpleTextIconToCard2(cardElement, iconSrc, text, text, windowTitle);
	}

	addCustomSimpleTextIconToCard2(cardElement, iconSrc, text, windowText = text, windowTitle = window.$.i18n('dialog-information')) {
		var icon = document.createElement("IMG");
		icon.src = iconSrc;
		if (cardElement[0]) {
			cardElement = cardElement[0];
		}
		getOrCreateCardBottomLeftInfo(cardElement).appendChild(icon);

		var tooltip = window.tippy(icon, {
			content: text,
			allowHTML: true,
			arrow: true,
			inertia: true,
			placement: "top",
			appendTo: window.document.body,
			boundary: 'window',
			getReferenceClientRect: window.document.body.getBoundingClientRect
		});

		icon.oncontextmenu = function(e) {
			e.preventDefault();
			e.stopPropagation();
			BootstrapDialog.show({
				title: windowTitle,
				message: windowText,
				buttons: [{
					label: window.$.i18n('dialog-ok'),
					cssClass: 'btn-primary',
					action: function(dialog) {
						dialog.close();
					}
				}]
			});
		}
		//return {icon: icon, tooltip: tooltip, }
	}

	getResizedFontSizeHorizontal(text, initSize, maxWidth, minSize = 10, step = 0.5) {
		var ele = document.createElement("SPAN");
		ele.innerHTML = text;
		ele.style.fontSize = initSize + "px";
		var textSize = initSize;
		document.body.appendChild(ele);

		while (textSize > minSize && ele.getBoundingClientRect().width > maxWidth) {
			console.log(text, ele.getBoundingClientRect().width, maxWidth);
			textSize -= step;
			ele.style.fontSize = textSize + "px";
		}
		ele.remove();
		return textSize;
	}

	/*
	isImgUrl(url) {
		const img = new Image();
		var prom = new Promise((resolve) => {
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
		});
		img.src = url;
		return prom;
	}
	*/

	isImgUrl(url) {
		return new Promise((resolve, reject) => {
			fetch(url, {method: 'HEAD'}).then(res => {
				var contentType = res.headers.get('Content-Type');
				console.log("CONTENTTYPE", contentType);
				if (contentType.startsWith('image')) {
					console.log("RESOLVING!");
					resolve();
				} else {
					console.log("REJECTING!");
					reject();
				}
			}).catch( () => {
				reject();
			})
		})
	}

	
	/**@returns {Currency|null} */
	/**@description Does not work on cards! */
	feildItemsToMyCurrencies(item) {
		const usconst = window.underscript.constants;
		switch (item) {
			case usconst.GOLD: return Currency.GOLD;
			case usconst.UCP: return Currency.UCP;
			case usconst.DUST: return Currency.DUST;
			case usconst.DT_FRAGMENT: return Currency.DTFRAG;
			case usconst.UT_PACK: return Currency.UT_PACK;
			case usconst.DR_PACK: return Currency.DR_PACK;
			case usconst.SHINY_PACK: return Currency.SHINY_PACK;
			case usconst.SUPER_PACK: return Currency.SUPER_PACK;
			case usconst.FINAL_PACK: return Currency.FINAL_PACK;
			case usconst.SKIN: return Currency.CARD_SKIN;
			case usconst.PROFILE: return Currency.PROFILE_SKIN;
			case usconst.AVATAR: return Currency.AVATAR;
			case usconst.EMOTE: return Currency.EMOTE;
			case usconst.EXP: return Currency.XP;
			case usconst.ELO: return Currency.ELO;
			default: return null;
		}
	}
	
}

/**@template L,R */
class Pair {
    
    constructor(/**@type {L} */ left, /**@type {R} */ right) {
        /**@type {L} */
        this.left = left;
        /**@type {R} */
        this.right = right;
    }

    getLeft() {
        return this.left;
    }

    getRight() {
        return this.right;
    }

    setLeft(/**@type {L} */ left) {
        this.left = left;
    }

    setRight(/**@type {R} */ right) {
        this.right = right;
    }

}

var utility = new Utility();

prettycards.utility = utility;

export {utility, Pair};