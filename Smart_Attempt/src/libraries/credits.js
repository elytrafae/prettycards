import { CustomChatBadgeSystem } from "./chat/custom_chat_badges";


var credits = `
	<span style="font-size: 2em;">General</span>
	<span>Uses Underscript's API.</span>
	<span>Feildmaster has been a MASSIVE help over the years and I cannot thank him enough! ^^</span>
	<span>Also huge thanks to the <span class="Translator">Translator</span> and <span class="Artist">Artist</span> teams for helping me out with certain features, including our team of English Translators!</span>

	<span style="font-size: 2em;">Card Theme Songs</span>
	<span>MysteryHD is the one who makes the audio files, I just paste them in and run a script. <img style="height:3em;" src="images/emotes/Hue.png"></span>
	<span>I could not have pulled this off without the help of HeavenlyFlower, who suggested a genious solution for non-Game pages.</span>

    <span style="font-size: 2em;">PrettyCards Staff</span><span style="color:gray"> (in no particular order)</span>
    <ul class="PrettyCards_Credits_GeneratedStaff"></ul>
	<span style="font-size: 2em;">Custom Cards</span>
	<span>Doki Doki Literature Club by <a href="http://teamsalvato.com/" target="_blank">Team Salvato</a></span>
	<span>Chibi MC sprite by <a href="https://www.deviantart.com/gyletotherescue/art/DDLC-MC-Chibi-Sprites-711310032" target="_blank">GyleToTheRescue on Deviantart</a></span>
	<span>MC SpriteSheet by <a href="https://www.deviantart.com/childish-n/art/DDLC-Protagonist-Sprite-715239172" target="_blank">Childish-N on Deviantart</a></span>
	<span>Amy Sprite Sheet by <a href="https://www.reddit.com/r/DDLC/comments/7qlzao/amy_sprite_sheet_for_those_who_wanted_it/" target="_blank">Meddy-sin on Reddit</a></span>
	<span>File Explorer/Character Folder artifact transparency fixed by @🌸bantikat🌸#6321 on Discord.</span>
	<br>
	<span>Battle Mew Mew theme by <a href="https://www.youtube.com/channel/UChAHYPBvyaQIpjyTSdQhOMQ" target="_blank">FalKKonE</a>. <a href="https://www.youtube.com/watch?v=jSozDtrESQE" target="_blank">Listen to the full remix here</a>.
`

function showCredits() {
    var cont = document.createElement("DIV");
    cont.innerHTML = credits.replaceAll("\n", "<br>");

    var ul = cont.querySelector(".PrettyCards_Credits_GeneratedStaff");
    var roleData = CustomChatBadgeSystem.getInstance().chatRoleUserData;
    for (var badgeId in roleData) {
        if (["pc_owner", "pc_staff", "pc_ministaff"].includes(badgeId)) {
            console.log(roleData[badgeId]);
            roleData[badgeId].forEach((player) => {
                if (player.creditHidden) {
                    return; // This would be a break if this was a for loop
                }
                var line = document.createElement("LI");
                line.innerHTML = player.username + " " + CustomChatBadgeSystem.getInstance().getStatusStringForId(player.id);
                ul.appendChild(line);
            })
        }
    }

	BootstrapDialog.show({
		title: "PrettyCards Credits!",
		message: cont,
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

prettycards.showCredits = showCredits;

export {showCredits};