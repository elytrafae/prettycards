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
// @require      https://raw.githubusercontent.com/CMD-God/prettycards/master/Utility.js
// @require      https://raw.githubusercontent.com/CMD-God/prettycards/master/TextLibrary.js
// ==/UserScript==

//https://media.discordapp.net/attachments/147063257436258305/637627137276510208/y47orgr08su31.png <------ FACTS!

function openPageSpecific() {
	var length = location.pathname.length, temp;
	if ((temp = location.pathname.indexOf(".")) === -1 && (temp = location.pathname.indexOf("/")) === -1) {
		temp = null;
	}
	loadScript("https://raw.githubusercontent.com/CMD-God/prettycards/master/PageSpecific/" + location.pathname.substring(1, temp || length) + ".js");
}

openPageSpecific();

(function() {
    'use strict';

    
})();