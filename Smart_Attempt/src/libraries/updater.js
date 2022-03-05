
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";

// https://github.com/CMD-God/prettycards/releases/latest/download/prettycards.user.js
// function Toast({title, text, footer, className, css={}, buttons, timeout, onClose}={}) {

var version = GM_info.script.version;
var lastChecked = window.localStorage.getItem("PrettyCards_LastCheckedUpdate");
var now = Date.now();

function dayDifference(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
}

if (dayDifference(now, lastChecked) >= 1) {
	window.localStorage.setItem("PrettyCards_LastCheckedUpdate", now);
	$.get("https://api.github.com/repos/CMD-God/prettycards/releases/latest", {}, function(data) {
		//console.log("data: ", data, "version: ", version);
		if (version != "local" && version != data.tag_name) {
			PrettyCards_plugin.toast(
				{
					title: "New PrettyCards version!",
					text: "There is a new version of PrettyCards available for download!<br>" + data.name,
					footer: "Click here to update!",
					onClose() {
						localStorage.setItem("PrettyCards_UpdateToVersion", data.tag_name);
						window.open(data.assets[0].browser_download_url, '_blank').focus();
					}
				}
			);
		} else if (localStorage.getItem("PrettyCards_UpdateToVersion") == version) {
			console.log("Update Successful Toast!");
			PrettyCards_plugin.toast(
				{
					title: "Update Successful!<br>" + data.name,
					text: (data.body || "No patch notes attached")
				}
			);
			localStorage.removeItem("PrettyCards_UpdateToVersion");
		}
	})
}

export {};