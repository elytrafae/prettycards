
import { CustomChatBadgeSystem } from "./chat/custom_chat_badges";
import { PrettyCards_plugin, prettycards } from "./underscript_checker";
import { utility } from "./utility";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";


function displayMenu() {
	var backdrop = document.createElement("DIV");
	backdrop.className = "PrettyCards_MainMenu_Backdrop";
	backdrop.innerHTML = `
		<div class="PrettyCards_MainMenu_Layer1">
			<div class="PrettyCards_MainMenu_Layer2">
				<div class="PrettyCards_MainMenu_Layer3">
					<div class="PrettyCards_MainMenu_Layer4">
						<div class="PrettyCards_MainMenu_Layer5">
							<div class="PrettyCards_MainMenu_ActualContent">

							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;

	document.body.appendChild(backdrop);
}

ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function() {
	
});

prettycards.displayMainMenuTest = displayMenu;