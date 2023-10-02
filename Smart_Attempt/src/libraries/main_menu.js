
import { CustomChatBadgeSystem } from "./chat/custom_chat_badges";
import { PrettyCards_plugin, prettycards } from "./underscript_checker";
import { utility } from "./utility";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import { showCredits } from "./credits";

import { loadCSS } from "./css_loader";
import css from "../css/MenuOld.css";
loadCSS(css);

var aprilFools = {
	month: 3,
	date: 1
}
  
function isItAprilFoolDay() {
	var now = new Date();
	return (now.getMonth() == aprilFools.month && now.getDate() == aprilFools.date);
}

ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function() {
	if (true) {	
		var x = $(document).width() - 450;
		var y = 300;
		
		//<p style="color: grey">More coming . . . Somewhen.</p>
		var menuBase = window.$(`<div class="dropdown" id="PrettyCards_MainMenu">
			<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${window.$.i18n("pc-menu-title")}</button>
			<div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="padding: 3px 5px;">
				<a><p style="cursor: pointer;" onclick="prettycards.openSettings()">${window.$.i18n("pc-menu-settings")}</p></a>
				<a><p style="cursor: pointer;" onclick="prettycards.showCredits()">${window.$.i18n("pc-menu-credits")}</p></a>
				<a class="PrettyCards_HiddenUntilLogin" href="/CustomCardSkins"><p style="cursor: pointer;">${window.$.i18n("pc-menu-customcardskins")}</p></a>
				<a class="PrettyCards_HiddenUntilLogin" href="/CustomCards"><p style="cursor: pointer;">${window.$.i18n("pc-menu-customcards")}</p></a>
				${ (utility.getSeasonMonth() == 3) ? ('<a href="/SmashOrPass"><p style="cursor: pointer; color: yellow;">' + window.$.i18n("pc-menu-sop") + '</p></a>') : ""}
				<a href="/CustomTranslations" class="PrettyCards_Hidden Translator PrettyCards_Staff"><p style="cursor: pointer;">${window.$.i18n("pc-menu-customtranslate")}</p></a>
				<a class="PrettyCards_Hidden PrettyCards_Staff"><p style="cursor: pointer;" onclick="prettycards.downloadEmotesFile()">${window.$.i18n("pc-menu-emotefile")}</p></a>
				<a href="https://cmd-god.github.io/prettycards/artistConsole.html" class="PrettyCards_Hidden Artist"><p style="cursor: pointer;">${window.$.i18n("pc-menu-customartistconsole")}</p></a>
				<a href="https://github.com/CMD-God/prettycards/wiki"><p style="cursor: pointer;">${window.$.i18n("pc-menu-apidocs")}</p></a>
			</div>
		</div>`)

		PrettyCards_plugin.events.on("PC_Chat:getSelfInfos Chat:Connected", function() {
			$(".PrettyCards_HiddenUntilLogin").css("display", "initial");
			if (utility.translatorFeaturesAccess()) {
				$("#PrettyCards_MainMenu .Translator").removeClass("PrettyCards_Hidden");
			}
			if (utility.featuresAccessForGroupOnly("Artist")) {
				$("#PrettyCards_MainMenu .Artist").removeClass("PrettyCards_Hidden");
			}
			CustomChatBadgeSystem.getInstance().isStaffMember(window.selfId).then(() => {
				$("#PrettyCards_MainMenu .PrettyCards_Staff").removeClass("PrettyCards_Hidden");
			}).catch((e) => {});
		})
		
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