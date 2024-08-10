console.log("PrettyCards: Events library loaded!");

function _GetCards() {
	console.log("GetCards called!");
	if (window.allCards != undefined) {
		if (allCards.length > 0) {
			console.log("Calling CardsLoad event!");
			PrettyCards_plugin.events.emit('CardsLoad', {allCards: window.allCards});
		} else {
			console.log("Cards Not Fetched yet. Retry in 0.5 seconds.");
			setTimeout(_GetCards, 500);
		}
	} else {
		console.log("This page does not handle cards!");
	}
}

_GetCards();
