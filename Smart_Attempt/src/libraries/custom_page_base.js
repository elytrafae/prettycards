
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var custom_pages = ["CustomCardSkins", "CustomCards"];

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
		pageLoadEventFired = true;
	}
}

$(document).ready(function () {
	page_loads++;
	//console.log("PAGE LOAD NR. " + page_loads);
	SendOnPageLoadEvent();
})

function waitTillNextDocumentReady() {
    return new Promise((resolve) => {
        $(document).ready(function () {
			resolve(console.log('Between'));
		})
    });
}

if (IsOnCustomPage()) {
	//console.log("CUSTOM PAGE!");
	
	/*
	$.get("https://raw.githubusercontent.com/CMD-God/prettycards/master/html_templates/undercards.html", function (data) {
		console.log(data);
		document.open();
		document.write(data);
		document.close();
		$.cache = {};
	}, "text");
	*/
	
	//console.log("underscript", underscript);
	$.ajax({
		url: "https://raw.githubusercontent.com/CMD-God/prettycards/master/html_templates/undercards.html",
		success: function (data) {
			//console.log(data);
			document.open();
			document.write(data);
			document.close();
			$.cache = {};
			
			document.body.onload = function(){SendOnPageLoadEvent();};
		},
		//async: false
    });
	
	//waitTillNextDocumentReady().then(function() {
	//	console.log("THIS DOESN'T MATTER BECAUSE THE CODE GOES ON REGARDLESS!");
	//});
	
	ExecuteWhen("PrettyCards:onPageLoad", function () { // I did this only to make sure this works on custom pages, too . . . For some reason underscript breaks there.
		window.socketChat.onmessage = function (event) {
			window.onMessageChat(event);
			var data = JSON.parse(event.data);
			//console.log(data);
			PrettyCards_plugin.events.emit("PC_Chat:" + data.action, data); 
		};
	});
}