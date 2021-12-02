
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

var custom_pages = ["CustomCardSkins"];

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
		PrettyCards_plugin.events.emit("PrettyCards:onPageLoad");
		pageLoadEventFired = true;
	}
}

$(document).ready(function () {
	page_loads++;
	console.log("PAGE LOAD NR. " + page_loads);
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
	console.log("CUSTOM PAGE!");
	
	/*
	$.get("https://raw.githubusercontent.com/CMD-God/prettycards/master/html_templates/undercards.html", function (data) {
		console.log(data);
		document.open();
		document.write(data);
		document.close();
		$.cache = {};
	}, "text");
	*/
	
	console.log("underscript", underscript);
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
}