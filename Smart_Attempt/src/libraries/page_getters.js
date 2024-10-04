
// Functions that get specific data from the page that SHOULD be stored as variables or smth.
// . . . And other utility functions.

import { prettycards } from "./underscript_checker";
import $ from "/src/third_party/jquery-3.6.0.min.js";

class pagegetters {
	
	static get gold() {
		return Number(document.getElementById("golds").innerHTML);
	}

	static set gold(v) {
		document.getElementById("golds").innerHTML = Number(v);
	}
	
	static get ucp() {
		return Number(document.getElementById("ucp").innerHTML);
	}
	
	static GetNumberOfPacks(code_id) {
		if (!underscript.onPage('Packs')) {
			return -1;
		}
		return Number(document.getElementById("nb" + code_id + "s").innerHTML);
	}

	static get dust() {
		return Number($("#dust").html());
	}
	
	static GetActiveMatchesData(cb) {
		const callback = cb || function() {};
		$.get("/", {}, function(data) {
			var page = $(data);
			var table = page.find("#liste");
			var tableRows = table.find("tr");
			
			var games = [];
			tableRows.each(function (index, element) {
				try {
					var game = {};
					//console.log(index, element);
					
					var player1Cell = element.children[0];
					var player1Data = {};
					
					var player1SpectateFunction = player1Cell.onclick.toString();
					player1Data.spectateLink = player1SpectateFunction.split("'")[1];
					player1Data.id = Number(player1Data.spectateLink.split("playerId=")[1]);
					player1Data.profileSkinUrl = player1Cell.style.backgroundImage;
					player1Data.profilePictureUrl = $(player1Cell).find(".avatar").attr("src");
					player1Data.soul = $(player1Cell).find("> .playerInfo > span").attr("class");
					player1Data.name = $(player1Cell).find("> .playerInfo > span").clone().children().remove().end().text().trim();
					player1Data.level = Number($(player1Cell).find("> .playerInfo > span > span").text().replace( /^\D+/g, ''));
					
					var player2Cell = element.children[1];
					var player2Data = {};
					
					var player2SpectateFunction = player2Cell.onclick.toString();
					player2Data.spectateLink = player2SpectateFunction.split("'")[1];
					player2Data.id = Number(player2Data.spectateLink.split("playerId=")[1]);
					player2Data.profileSkinUrl = player2Cell.style.backgroundImage;
					player2Data.profilePictureUrl = $(player2Cell).find(".avatar").attr("src");
					player2Data.soul = $(player2Cell).find("> .playerInfo > span").attr("class");
					player2Data.name = $(player2Cell).find("> .playerInfo > span").clone().children().remove().end().text().trim();
	;
					player2Data.level = Number($(player2Cell).find("> .playerInfo > span > span").text().replace( /^\D+/g, ''));
					
					game.gameId = Number(player1Data.spectateLink.split("&playerId=")[0].split("gameId=")[1]);
					game.player1 = player1Data;
					game.player2 = player2Data;
					
					//console.log(game);
					games.push(game);
				} catch (e) {
					console.error("Error trying to fetch active game data: " + e);
				}
			});
			callback(games);
		})
	}
	
	static GetActiveMatchForId(matchId, cb) {
		const callback2 = cb || function() {};
		this.GetActiveMatchesData(function(games) {
			for (var i=0; i < games.length; i++) {
				if (matchId === games[i].gameId) {
					var game = games[i];
					callback2(game);
				}
			}
		})
	}
	
	static IsSelfMod() {
		return window.selfMainGroup.priority <= 4;
	}
	
	static IsMyself(id) {
		return window.selfId === id;
	}
	
	static IsMyFriend(id) {
		for (var i=0; i < window.selfFriends.length; i++) {
			if (window.selfFriends[i].id == id) {
				return true;
			}
		}
		return false;
	}
	
	static GetDecks(callback) {
		$.get("/DecksConfig", {}, function(data) {
			var decks = JSON.parse(data.decks);
			callback(decks);
		})
	}
	
}

prettycards.pagegetters = pagegetters;

export {pagegetters};