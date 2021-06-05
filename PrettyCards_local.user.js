// ==UserScript==
// @name         PrettyCards (local)
// @namespace    http://tampermonkey.net/
// @version      local
// @description  Make Undercards look fabulous!
// @author       CMD_God
// @match        https://*.undercards.net/*
// @exclude      https://*.undercards.net/*/*
// @grant        none

// @resource   PACKS_CSS file:///D:/Undercards/PrettCards_Git/prettycards/css/Packs.css
// @grant      GM_getResourceText
// @grant      GM_addStyle

// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/UnderscriptChecker.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/Events.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/Utility.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/TextLibrary.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/CardIntroSongManager.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/SoulDisplay.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/ArtifactDisplay.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/Localization.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/Libraries/CustomCards.js

// @require     file:///D:/Undercards/PrettCards_Git/prettycards/PageSpecific/Play.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/PageSpecific/Packs.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/PageSpecific/Artifacts.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/PageSpecific/Decks.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/PageSpecific/Game.js
// @require     file:///D:/Undercards/PrettCards_Git/prettycards/PageSpecific/GamesList.js

// @require     file://D:/Undercards/PrettCards_Git/prettycards/PrettyCards.user.js

// ==/UserScript==

//https://media.discordapp.net/attachments/147063257436258305/637627137276510208/y47orgr08su31.png <------ FACTS!



const my_css = GM_getResourceText("PACKS_CSS");
console.log("CSS Loaded: ", my_css);
GM_addStyle(my_css);

(function() {
    'use strict';
	

})();
