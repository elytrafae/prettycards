
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";
import { ExecuteWhen } from "./pre_load/event_ensure";

// https://github.com/elytrafae/prettycards/releases/latest/download/prettycards.user.js
// function Toast({title, text, footer, className, css={}, buttons, timeout, onClose}={}) {

/*
var options = [
	["All the time", 0], 
	["Hourly", 1], 
	["Daily", 2], 
	["Never", 3]
];
*/
var options = ["All the time", "Hourly", "Daily", "Never"];
var times = [0, 3600000, 3600000*24, 9007199254740991];

addSetting({
	'key': 'update_frequency',
	'name': 'Update Check Frequency', // Name in settings page
	'type': 'select',
	'options': options,
	'refresh': false, // true to add note "Will require you to refresh the page"
	'default': options[2], // default value; Daily
});

var version = GM_info.script.version;
var lastChecked = window.localStorage.getItem("PrettyCards_LastCheckedUpdate");
var now = Date.now();

function dayDifference(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
}

var setting_time_id = options.indexOf(settings.update_frequency.value() || options[2]) || settings.update_frequency.value();

if (now - lastChecked >= times[setting_time_id]) {
	window.localStorage.setItem("PrettyCards_LastCheckedUpdate", now);
	$.get("https://api.github.com/repos/elytrafae/prettycards/releases/latest", {}, function(data) {
		//console.log("data: ", data, "version: ", version);
		if (version != "local" && version != data.tag_name) {
			var toastData = {
				name: data.name,
				tag_name: data.tag_name,
				body: data.body,
				download_url: data.assets[0].browser_download_url
			}
			window.localStorage.setItem("prettycards.update.toastdata", JSON.stringify(toastData));
		}
	})
}

var updateToastData = window.localStorage.getItem("prettycards.update.toastdata");

ExecuteWhen("PrettyCards:TranslationExtReady", function() {
	if (updateToastData) {
		var data = JSON.parse(updateToastData);
		PrettyCards_plugin.toast(
			{
				title: window.$.i18n("pc-updater-new-title"),
				text: window.$.i18n("pc-updater-new-text") + "<br>" + data.name,
				footer: window.$.i18n("pc-updater-new-footer"),
				onClose() {
					localStorage.setItem("PrettyCards_UpdateToVersion", data.tag_name);
					window.open(data.download_url, '_blank').focus();
				}
			}
		);

		if (localStorage.getItem("PrettyCards_UpdateToVersion") == version) {
			//console.log("Update Successful Toast!");
			PrettyCards_plugin.toast(
				{
					title: window.$.i18n("pc-updater-success-title") + "<br>" + (data.name || "No name available"),
					text: (data.body || "No patch notes attached")
				}
			);
			localStorage.removeItem("prettycards.update.toastdata");
			localStorage.removeItem("PrettyCards_UpdateToVersion");
		}
	}
});

export {};
