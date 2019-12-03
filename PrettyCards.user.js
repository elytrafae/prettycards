// ==UserScript==
// @name         PrettyCards
// @namespace    http://tampermonkey.net/
// @version      1.0-pre
// @updateURL    https://raw.githubusercontent.com/CMD-God/prettycards/master/PrettyCards.user.js
// @description  Make Undercards look fabulous!
// @author       CMD_God
// @match        https://*.undercards.net/*
// @exclude      https://*.undercards.net/*/*
// @grant        none
// require      https://raw.githubusercontent.com/CMD-God/prettycards/master/Utility.js
// require      https://raw.githubusercontent.com/CMD-God/prettycards/master/TextLibrary.js
// ==/UserScript==

//https://media.discordapp.net/attachments/147063257436258305/637627137276510208/y47orgr08su31.png <------ FACTS!

var PrettyCardsVer = "85d8334";
var PrettyCardsReqLibs = ["Utility", "TextLibrary"];
var PrettyCardsScriptsLoaded = 0;


function openUtilities() {
    console.log("PrettyCardsReqLibs: ", PrettyCardsReqLibs);
	for (var i=0; i < PrettyCardsReqLibs.length; i++) {
		loadScript(PrettyCardsReqLibs[i],
			function() {
				PrettyCardsScriptsLoaded++;
				if (PrettyCardsScriptsLoaded = PrettyCardsReqLibs.length-1) {
					openPageSpecific();
				}
			}
		);
	}
}

function loadScript(lnk, callback) {
	var e = document.createElement("script");
	e.src = "https://cdn.jsdelivr.net/gh/CMD-God/prettycards@"+ PrettyCardsVer +"/PageSpecific/" + lnk + ".js";
	e.onload = callback || function() {};
	document.body.appendChild(e);
}

function GetLatestReleaseInfo() {
    /*
	$.getJSON("https://api.github.com/repos/CMD-God/prettycards/releases/latest").done(function (json) {
		console.log("Json: ", json);
		var release = json[0];
		openUtilities();
	});*/
    openUtilities();
}

function openPageSpecific() {
	var length = location.pathname.length, temp;
	if ((temp = location.pathname.indexOf(".")) === -1 && (temp = location.pathname.indexOf("/")) === -1) {
		temp = null;
	}
	//loadScript("https://raw.githubusercontent.com/CMD-God/prettycards/master/PageSpecific/" + location.pathname.substring(1, temp || length) + ".js");
	loadScript(location.pathname.substring(1, temp || length));
	
}

GetLatestReleaseInfo();

(function() {
    'use strict';

    
})();