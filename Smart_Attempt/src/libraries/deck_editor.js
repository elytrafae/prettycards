
// A script for editing decks outside of the decks page!

var ajaxUrl = "DecksConfig";

class DeckEditor {
	
	static ImportDeck(deck, cb) {
		if (deck.isBase) {
			cb("success");
			return;
		}
		var posts_in_progress = 0;
		
		var callback = function(data, status) {
			if (status == "success") {
				posts_in_progress--;
				//console.log("Requests left: ", posts_in_progress, data);
				if (posts_in_progress == 0) {
					cb("success");
				}
			} else {
				console.log("ERROR WHILE IMPORTING DECK!", data)
				cb("error", data);
			}
		}
		
		DeckEditor.RemoveEverything(deck.soul, function(data, status) {
			//console.log("Removed everything! ", data, status);
			if (status == "success") {
				for (var i=0; i < deck.cards.length; i++) {
					var card = deck.cards[i];
					posts_in_progress++;
					DeckEditor.AddCard(card.id, card.shiny, deck.soul, callback);
				}
				for (var i=0; i < deck.artifacts.length; i++) {
					var artifact = deck.artifacts[i];
					posts_in_progress++;
					DeckEditor.AddArtifact(artifact, deck.soul, callback);
				}
			} else {
				cb("error");
			}
		})
	}
	
	static AddCard(card_id, shiny, soul, callback) {
		$.ajax({
			url: ajaxUrl,
			type: "POST",
			dataType: "json",
			data: JSON.stringify({
				action: "addCard",
				idCard: card_id,
				isShiny: !(!shiny),
				soul: soul
			}),
			contentType: "application/json",
			success: function(data) {
				if (data.status !== "error") {
					callback(data, "success");
				} else {
					callback(data, "error");
				}
			}
		});
		//console.log("Card Request Sent!", card_id, shiny, soul, callback);
	}
	
	static AddArtifact(artifact_id, soul, callback) {
		$.ajax({
			url: ajaxUrl,
			type: "POST",
			dataType: "json",
			data: JSON.stringify({
				action: "addArtifact",
				idArtifact: artifact_id,
				soul: soul
			}),
			contentType: "application/json",
			success: function(data) {
				if (data.action === "getArtifactAdded") {
					callback(data, "success");
				} else {
					callback(data, "error");
				}
			}
		});
		//console.log("Artifact Request Sent!", artifact_id, soul, callback);
	}
	
	static RemoveEverything(soul, callback) {
		$.ajax({
			url: ajaxUrl,
			type: "POST",
			dataType: "json",
			data: JSON.stringify({
				action: "removeAllCards",
				soul: soul
			}),
			contentType: "application/json",
			success: function(data) {
				if (data.status === undefined) {
					callback(data, "success");
				} else {
					callback(data, "error");
				}
			}
		});
	} 
	
}

export {DeckEditor};