
import { PrettyCards_plugin } from "./underscript_checker";
import { utility } from "./utility";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var credits = `
	<span style="font-size: 2em;">General</span>
	<span>Uses Underscript's API.</span>
	<span>Feildmaster has been a MASSIVE help over the years and I cannot thank him enough! ^^</span>

	<span style="font-size: 2em;">Card Theme Songs</span>
	<span>MysteryHD is the one who makes the audio files, I just paste them in and run a script. <img style="height:3em;" src="images/emotes/Hue.png"></span>
	<span>I could not have pulled this off without the help of HeavenlyFlower, who suggested a genious solution for non-Game pages.</span>
	
	<span style="font-size: 2em;">Custom Cards</span>
	<span>Doki Doki Literature Club by <a href="http://teamsalvato.com/" target="_blank">Team Salvato</a></span>
	<span>Chibi MC sprite by <a href="https://www.deviantart.com/gyletotherescue/art/DDLC-MC-Chibi-Sprites-711310032" target="_blank">GyleToTheRescue on Deviantart</a></span>
	<span>MC SpriteSheet by <a href="https://www.deviantart.com/childish-n/art/DDLC-Protagonist-Sprite-715239172" target="_blank">Childish-N on Deviantart</a></span>
	<span>Amy Sprite Sheet by <a href="https://www.reddit.com/r/DDLC/comments/7qlzao/amy_sprite_sheet_for_those_who_wanted_it/" target="_blank">Meddy-sin on Reddit</a></span>
	<span>File Explorer/Character Folder artifact transparency fixed by @🌸bantikat🌸#6321 on Discord.</span>
`

function showCredits() {
	BootstrapDialog.show({
		title: "PrettyCards Credits!",
		message: credits,
		buttons: [{
				label: "Ok!",
				cssClass: 'btn-primary us-normal',
				action(dialog) {
					dialog.close();
				}
			}
		]
	});
}

var aprilFools = {
	month: 3,
	date: 1
}
  
function isItAprilFoolDay() {
	var now = new Date();
	return (now.getMonth() == aprilFools.month && now.getDate() == aprilFools.date);
}

function isItApril() {
	var now = new Date();
	return (now.getMonth() == aprilFools.month);
}

window.showPrettyCardsCredits = showCredits;
ExecuteWhen("PrettyCards:onPageLoad", function() {
	if (true) {	
		var x = $(document).width() - 450;
		var y = 300;
		
		//<p style="color: grey">More coming . . . Somewhen.</p>
		var menuBase = window.$(`<div class="dropdown" id="PrettyCards_MainMenu">
			<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">PrettyCards Menu</button>
			<div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="padding: 3px 5px;">
				<a><p style="cursor: pointer;" onclick="showPrettyCardsCredits()">Credits</p></a>
				<a href="/CustomCardSkins"><p style="cursor: pointer;">Custom Card Skins</p></a>
				<a href="/CustomCards"><p style="cursor: pointer;">Custom Cards</p></a>
				${ (utility.getSeasonMonth() == 3) ? ('<a href="/SmashOrPass"><p style="cursor: pointer; color: yellow;">Smash or Pass</p></a>') : ""}
				<a href="https://github.com/CMD-God/prettycards/wiki"><p style="cursor: pointer;">API Docs</p></a>
			</div>
		</div>`)
		
		var isfadedIn = false;
		$("body").mousemove(function (e) {
			//console.log(e);
			if (e.pageX >= x && e.pageY <= y) {
				if (!isfadedIn) {
					menuBase.stop().fadeIn();
					isfadedIn = true;
				}
			} else {
				if (isfadedIn) {
					menuBase.stop().fadeOut();
					isfadedIn = false;
				}
			}
		})
		
		$("body").append(menuBase);
	}
});

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromGH("Menu");
	var topAdvertClosed = (localStorage["prettycards.top_advert_closed"] === 'true');

	function turnOffAdvert(forever = false) {
		$("#PrettyCards_TopAdvert").remove();
		$("#PrettyCards_MainMenu").css("top", "0px");
		if (forever) {
			localStorage["prettycards.top_advert_closed"] = true;
		}
	}

	if ( (!topAdvertClosed) && isItAprilFoolDay() && (!window.underscript.onPage("Game")) && (!window.underscript.onPage("SmashOrPass")) ) {
		window.$("#PrettyCards_MainMenu").css("top", "36px");
		PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
			window.$("body").prepend(`
				<div id="PrettyCards_TopAdvert">
					<span>New! Undercards Smash or Pass Game!</span> <a href="/SmashOrPass">Are you brave enough~?</a>
					<div id="PrettyCards_TopAdvert_CloseButtons">
						<div id="PrettyCards_TopAdvert_CloseForever">Don't Remind Me!</div>
						<div id="PrettyCards_TopAdvert_Close">X</div>
					</div>
				</div>
			`);
			window.$("#PrettyCards_TopAdvert_Close").click(function() {
				turnOffAdvert(false);
			})
			window.$("#PrettyCards_TopAdvert_CloseForever").click(function() {
				turnOffAdvert(true);
			})
			//window.scrollTo({ top: 0, behavior: 'smooth' });
		})
	}
})