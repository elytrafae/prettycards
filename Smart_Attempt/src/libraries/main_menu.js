
import { CustomChatBadgeSystem } from "./chat/custom_chat_badges";
import { PrettyCards_plugin, prettycards } from "./underscript_checker";
import { utility } from "./utility";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import { showCredits } from "./credits";

import { loadCSS } from "./css_loader";
import css from "../css/MainMenu.css";
loadCSS(css);

const defaultTextKey = "NO_TEXT_KEY";
const defaultNoteKey = null;
const defaultAddress = null;
const defaultOnclick = null;
const defaultPerms = [];

class MainMenuButton {

	#textKey;
	#noteKey;
	#address;
	#onclick;
	#perms;

	constructor(settings = {}) {
		this.#textKey = settings.textKey || defaultTextKey;
		this.#noteKey = settings.noteKey || defaultNoteKey;
		this.#address = settings.address || defaultAddress;
		this.#onclick = settings.onclick || defaultOnclick;
		this.#perms = settings.perms || defaultPerms;
	}

	setTextKey(val = defaultTextKey) {
		this.#textKey = val;
		return this;
	}

	setNoteKey(val = defaultNoteKey) {
		this.#noteKey = val;
		return this;
	}

	setAddress(val = defaultAddress) {
		this.#address = val;
		return this;
	}

	setOnClick(val = defaultOnclick) {
		this.#onclick = val;
		return this;
	}

	setPerms(val = defaultPerms) {
		this.#onclick = val;
		return this;
	}

	getTextKey() {
		return this.#textKey;
	}

	getNoteKey() {
		return this.#noteKey;
	}

	getAddress() {
		return this.#address;
	}

	getOnClick() {
		return this.#onclick;
	}

	getPerms() {
		return this.#perms;
	}

	evaluatePerms() {
		if (this.#perms.length<= 0) {
			return true;
		}
		// Onu's Staff
		for (var i=0; i < window.selfGroups.length; i++) {
			var group = window.selfGroups[i];
			if (this.#perms.includes(group.name)) {
				return true;
			}
		}

		return CustomChatBadgeSystem.getInstance().isStaffMember(window.selfId);
	}

	render() {
		if (!this.evaluatePerms()) {
			return null;
		}
		var a = this.getAddress();
		var elem = document.createElement(a ? "A" : "SPAN");
		if (a) {
			elem.href = a;
		}
		if (this.getOnClick()) {
			elem.onclick = this.getOnClick();
		}
		elem.innerHTML = window.$.i18n(this.#textKey);
		return elem;
	}

}

class MainMenu {

	static INSTANCE = new MainMenu();

	constructor() {
		if (MainMenu.INSTANCE) {
			throw "MainMenuManager should not be instanced! Use MainMenuManager.INSTANCE!";
		}
		this.buttons = [];
		this.addMenuButton({
			textKey: "pc-menu-credits",
			onclick: () => {showCredits();}
		})
	}
	
	show() {
		var backdrop = document.createElement("DIV");
		backdrop.className = "PrettyCards_MainMenu_Backdrop";
		backdrop.innerHTML = `
			<div class="PrettyCards_MainMenu_PosBox">
				<div class="PrettyCards_MainMenu_Layer1 PrettyCards_MainMenu_BorderLayer">
					<div class="PrettyCards_MainMenu_Layer2 PrettyCards_MainMenu_BorderLayer">
						<div class="PrettyCards_MainMenu_Layer3 PrettyCards_MainMenu_BorderLayer">
							<div class="PrettyCards_MainMenu_Layer4 PrettyCards_MainMenu_BorderLayer">
								<div class="PrettyCards_MainMenu_Layer5 PrettyCards_MainMenu_BorderLayer">
									<div class="PrettyCards_MainMenu_ActualContent">
										<h1 class="rainbowText">Greetings!</h1>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
		var menuParent = backdrop.querySelector(".PrettyCards_MainMenu_ActualContent");
		this.buttons.forEach((button) => {
			menuParent.appendChild(button.render());
		})
		document.body.appendChild(backdrop);
	}

	addMenuButton(settings) {
		var mb = new MainMenuButton(settings);
		this.buttons.push(mb);
		return mb;
	}

	static addMenuButton(settings) {
		return this.INSTANCE.addMenuButton(settings);
	}
}

ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function() {
	
});

prettycards.MainMenu = MainMenu;

export {MainMenu}