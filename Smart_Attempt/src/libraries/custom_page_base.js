import {PrettyCards_plugin} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";
import {utility} from '/src/libraries/utility.js';

var custom_pages = ["CustomCardSkins", "CustomCards", "SmashOrPass", "CustomTranslations"];

function IsOnCustomPage() {
	for (var i = 0; i < custom_pages.length; i++) {
		if (window.underscript.onPage(custom_pages[i])) {
			return true;
		}
	}
	return false;
}

var page_loads = 0;
var pageLoadEventFired = false;

function SendOnPageLoadEvent() {
	if (window.$ && !pageLoadEventFired) {
		PrettyCards_plugin.events.emit.singleton("PrettyCards:onPageLoad");
		PrettyCards_plugin.events.on("PrettyCards:TranslationExtReady", function() {
			$("#PrettyCards_GoBack").html(window.$.i18n("pc-navigate-goback"));
		})
		pageLoadEventFired = true;
	}
}

$(document).ready(function () {
	page_loads++;
	//console.log("PAGE LOAD NR. " + page_loads);
	SendOnPageLoadEvent();
})

if (IsOnCustomPage()) {
	const toastBox = document.querySelector('#AlertToast');
	//console.log("underscript", underscript);
	$.ajax({
		url: utility.asset("html_templates/undercards.html"),
		success: function (data) {
			document.open();
			document.write(data);
			document.body.append(toastBox);
			$.cache = {};
			document.addEventListener('DOMContentLoaded', () => {
				PrettyCards_plugin.events.emit.singleton(":preload");
			});
			document.close();

			document.body.onload = function(){
				PrettyCards_plugin.events.emit.singleton(":load");
				SendOnPageLoadEvent();
			};
		},
		//async: false
    });

	//waitTillNextDocumentReady().then(function() {
	//	console.log("THIS DOESN'T MATTER BECAUSE THE CODE GOES ON REGARDLESS!");
	//});

	PrettyCards_plugin.events.on('ChatMessage', (data) => {
		if (data.action === "getSelfInfos") {
			PrettyCards_plugin.events.emit.singleton("PC_Chat:" + data.action, data);
		} else {
			PrettyCards_plugin.events.emit("PC_Chat:" + data.action, data);
		}
	});
}