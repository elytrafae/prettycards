import { PrettyCards_plugin } from "./underscript_checker";

var collectionPlace = document.getElementById("collection"); // This is for a workaround with how friendship cards are added.
if (!collectionPlace) {
	collectionPlace = document.createElement("DIV");
	collectionPlace.id = "collection";
	collectionPlace.className = "PrettyCards_Hidden";
	document.body.appendChild(collectionPlace);
}

var lastSHA;
window.$.get("https://api.github.com/repos/CMD-God/prettycards/commits", function(data) {
	console.log("REPOS", data);
	lastSHA = data[0].sha;
	PrettyCards_plugin.events.emit.singleton("PrettyCards_CommitCSSLoad");
});

class Utility {
	
	loadCSSFromGH(name) {
		PrettyCards_plugin.events.on("PrettyCards_CommitCSSLoad", function() {
			const url = `https://cdn.jsdelivr.net/gh/CMD-God/prettycards@${lastSHA}/css/${name}.css`;
			utility.loadCSSFromLink(url);
		});
	}

	loadCSSFromLink(url) {
		var e = document.createElement("link");
		e.rel  = 'stylesheet';
		e.type = 'text/css';
		e.href = url;
		document.head.appendChild(e);
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
	
}

var utility = new Utility();

export {utility};