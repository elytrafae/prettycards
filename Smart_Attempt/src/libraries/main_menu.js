
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var credits = `
	<span style="font-size: 2em;">General</span>
	<span>Uses Underscript's API.</span>
	
	<span style="font-size: 2em;">Custom Cards</span>
	<span>Doki Doki Literature Club by <a href="http://teamsalvato.com/" target="_blank">Team Salvato</a></span>
	<span>Chibi MC sprite by <a href="https://www.deviantart.com/gyletotherescue/art/DDLC-MC-Chibi-Sprites-711310032" target="_blank">GyleToTheRescue on Deviantart</a></span>
	<span>MC SpriteSheet by <a href="https://www.deviantart.com/childish-n/art/DDLC-Protagonist-Sprite-715239172" target="_blank">Childish-N on Deviantart</a></span>
	<span>Amy Sprite Sheet by <a href="https://www.reddit.com/r/DDLC/comments/7qlzao/amy_sprite_sheet_for_those_who_wanted_it/" target="_blank">Meddy-sin on Reddit</a></span>
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
window.showPrettyCardsCredits = showCredits;
ExecuteWhen("PrettyCards:onPageLoad", function() {
	if (true) {	
		var x = $(document).width() - 450;
		var y = 300;
		
		var menuBase = $(`<div class="dropdown" style="position: absolute; top: 0px; right: 15px; display: none;">
			<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">PrettyCards Menu</button>
			<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
				<p style="cursor: pointer;" onclick="showPrettyCardsCredits()">Credits</p>
				<p style="cursor: pointer;" onclick="window.location.href = '/CustomCardSkins';">Custom Card Skins</p>
				<p style="color: grey">More coming . . . Somewhen.</p>
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