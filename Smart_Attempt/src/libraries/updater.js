import {PrettyCards_plugin} from "/src/libraries/underscript_checker.js";
import { ExecuteWhen } from "./pre_load/event_ensure";

var version = GM_info.script.version;

PrettyCards_plugin.updater?.({
	updateURL: `elytrafae/prettycards`,
});

if (localStorage.getItem("PrettyCards_UpdatedToVersion") !== version && version != "local" ) {
	$.get(`https://api.github.com/repos/elytrafae/prettycards/releases/tags/${version}`, {}, function(data) {
		ExecuteWhen("PrettyCards:TranslationExtReady", function() {
			PrettyCards_plugin.toast({
				title: window.$.i18n("pc-updater-success-title") + "<br>" + (data.name || "No name available"),
				text: (data.body || "No patch notes attached"),
				onClose() {
					localStorage.setItem("PrettyCards_UpdatedToVersion", version);
				}
			});
		});
	})
}
