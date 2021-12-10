
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {utility} from "/src/libraries/utility.js";
import {pagegetters} from "/src/libraries/page_getters.js";
import {AddTooltip} from "/src/libraries/tooltips.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

ExecuteWhen("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromLink("https://cdn.jsdelivr.net/gh/CMD-God/prettycards@2f2f7500c964b9711c2f161b4cf823eefaffcb02/css/Souls.css");
});

var areDecksLoaded = false;
var decks = {};

function UpdateDecks() {
	if (underscript.onPage("Decks")) {
		var decksData = window.decks;
		decks = {};
		for (var deckName in decksData) {
			decks[deckName] = {};
			decks[deckName].cards = decksData[deckName];
			decks[deckName].artifacts = decksArtifacts[deckName];
		}
		if (!areDecksLoaded) {
			areDecksLoaded = true;
			PrettyCards_plugin.events.emit("SoulSelector:decksLoaded");
		}
	} else if ($.isEmptyObject(decks)) {
		pagegetters.GetDecks(function (decksData) {
			for (var i = 0; i < decksData.length; i++) {
				var deck = decksData[i];
				decks[deck.soul.name] = {};
				decks[deck.soul.name].cards = deck.cardsList;
				decks[deck.soul.name].artifacts = deck.artifacts;
			}
			if (!areDecksLoaded) {
				areDecksLoaded = true;
				PrettyCards_plugin.events.emit("SoulSelector:decksLoaded");
			}
		})
	}
}

class SoulSelector {

	constructor() {
		this.selectedSoul = "KINDNESS";
		this.idPrefix = "PrettyCards_ChallengeSoul_";
		this.highlightSelectedSoul = true;
		this.changeSoulCallback = function() {};
		this.soulsToDisplay = [];
	}

	GetPlayableDecks() {
		UpdateDecks();
		var playableDecks = {};
		for (var soul in decks) {
			var deck = decks[soul];
			if (deck.cards.length >= 25 && (deck.artifacts.length >= 2 || (deck.artifacts.length === 1 && deck.artifacts[0].legendary))) {
				playableDecks[soul] = deck;
			}
		}
		return playableDecks;
	}

	GenerateArtifacts(artifacts) {
		var html = '<div class="PrettyCards_ArtifactContainer">';
		for (var i = 0; i < artifacts.length; i++) {
			var artifact = artifacts[i];
			html += `<span class="${artifact.legendary ? 'yellow' : ''}"><img style="height: 16px;" src="images/artifacts/${artifact.image}.png" /> ${artifact.name}</span>${(i < artifacts.length-1) ? "<br>" : ""}`;
		}
		html += '</div>'
		return html;
	}

	GenerateCards(cards) {
		var html = "";
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i];
			html += `${card.shiny ? '<span class="rainbowText">S</span> ' : ''}<span class="${card.rarity}">${card.name}</span><br>`;
		}
		return html;
	}

	ChangeDeck(deckName) {
		//console.log("Changing deck for ", this, document.getElementById(this.idPrefix + this.selectedSoul), this.idPrefix + this.selectedSoul);
		if (this.highlightSelectedSoul) {
			$(document.getElementById(this.idPrefix + this.selectedSoul)).removeClass("PrettyCards_SelectedSoul");
		}
		this.selectedSoul = deckName;
		if (this.highlightSelectedSoul) {
			$(document.getElementById(this.idPrefix + this.selectedSoul)).addClass("PrettyCards_SelectedSoul");
		}
		this.changeSoulCallback(this.selectedSoul);
	}

	SetUp(idPrefix, sizeClass) {
		this.idPrefix = idPrefix;

		var playableDecks = this.GetPlayableDecks();
		if (this.soulsToDisplay.length <= 0) {
			this.soulsToDisplay = Object.keys(playableDecks);
		}
		var html = "";
		var firstSoul = "";
		window["PrettyCards_ChangeDeck_" + this.idPrefix] = this.ChangeDeck.bind(this);
		//for (var deckName in this.soulsToDisplay) {
		for (var i=0; i < this.soulsToDisplay.length; i++) {
			var deckName = this.soulsToDisplay[i];
			if (firstSoul === "") {
				firstSoul = deckName;
			}
			html += `<img src="https://github.com/CMD-God/prettycards/raw/master/img/Souls/${deckName}.png" id="${this.idPrefix}${deckName}" onclick='PrettyCards_ChangeDeck_${this.idPrefix}("${deckName}");' class="PrettyCards_Soul_${deckName} PrettyCards_${sizeClass}Soul ${(deckName === firstSoul && this.highlightSelectedSoul) ? "PrettyCards_SelectedSoul" : ""}"></img>`;
		}
		this.selectedSoul = firstSoul;
		return html;
	}

	AddDeckTooltips() {
		var playableDecks = this.GetPlayableDecks();
		for (var deckName in playableDecks) {
			//console.log("#" + this.idPrefix + deckName, document.querySelector("#" + this.idPrefix + deckName));
			const el = document.querySelector("#" + this.idPrefix + deckName);
			var html = '<div class="PrettyCards_DeckTooltip">' + this.GenerateArtifacts(playableDecks[deckName].artifacts) + this.GenerateCards(playableDecks[deckName].cards) + "</div>";
			//console.log(window.document.body.getBoundingClientRect, window.document.body.getBoundingClientRect());
			
			window.tippy("#" + this.idPrefix + deckName, {
				content: html,
				allowHTML: true,
				arrow: true,
				inertia: true,
				placement: "auto",
				appendTo: window.document.body,
				boundary: 'window',
				getReferenceClientRect: window.document.body.getBoundingClientRect,
				onShow(instance) {
					//console.log(instance, el._tippy, instance == el._tippy);
					//const { popperInstance, options } = el._tippy;
					//options.placement = popperInstance.options.placement = 'right'
					//popperInstance.update()
				},
			});
			
			//AddTooltip(el, html, {});
		}
	}
	
	static ExecuteOnDeckLoad(callback) {
		if (areDecksLoaded) {
			callback();
			return;
		}
		PrettyCards_plugin.events.on("SoulSelector:decksLoaded", callback);
	}
	
	static GetDecks() {
		return decks;
	}

}

if (underscript.onPage("Decks")) {
	PrettyCards_plugin.events.on('Deck:Loaded', function (data) {
		UpdateDecks();
	});
} else {
	UpdateDecks();
}

export {
	SoulSelector
};
