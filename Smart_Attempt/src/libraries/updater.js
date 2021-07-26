
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

// https://github.com/CMD-God/prettycards/releases/latest/download/prettycards.user.js
// function Toast({title, text, footer, className, css={}, buttons, timeout, onClose}={}) {

var version = GM_info.script.version;

$.get("https://api.github.com/repos/CMD-God/prettycards/releases/latest", {}, function(data) {
	console.log("data: ", data, "version: ", version);
	if (version != "local" && version != data.tag_name) {
		PrettyCards_plugin.toast(
			{
				title: "New PrettyCards version!",
				text: "There is a new version of PrettyCards available for download!<br>" + data.name,
				footer: "Click here to update!",
				onClose() {
					sessionStorage.setItem("PrettyCards_UpdateToVersion", data.tag_name);
					window.open(data.assets[0].browser_download_url, '_blank').focus();
				}
			}
		);
	} else if (sessionStorage.getItem("PrettyCards_UpdateToVersion") == version) {
		PrettyCards_plugin.toast(
			{
				title: "Update Successful: " + data.name,
				text: "insert patch notes here!" + data.name
			}
		);
		sessionStorage.removeItem("PrettyCards_UpdateToVersion");
	}
})

export {};