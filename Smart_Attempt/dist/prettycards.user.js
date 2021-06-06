// ==UserScript==
// @name        PrettyCards
// @version     1.5.0
// @author      CMD_God
// @description Make (parts of) Undercards look fabulous!
// @homepage    https://github.com/CMD-God/prettycards
// @supportURL  https://github.com/CMD-God/prettycards
// @match       https://*.undercards.net/*
// @exclude     https://*.undercards.net/*/*
// @updateURL   https://unpkg.com/prettycards/dist/prettycards.meta.js
// @downloadURL https://unpkg.com/prettycards/dist/prettycards.user.js
// @grant       none
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libraries/underscript_checker.js */ \"./src/libraries/underscript_checker.js\");\n/* harmony import */ var _page_specific_packs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./page_specific/packs.js */ \"./src/page_specific/packs.js\");\n\r\n\r\n\r\n\r\n\r\n\r\nconsole.log(\"This is a brand new userscript! ^^\");\r\n\r\nif (_libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].packs.value() && underscript.onPage('Packs')) {\r\n\tconsole.log(\"Packs page!\", _page_specific_packs_js__WEBPACK_IMPORTED_MODULE_1__[\"InitPacks\"]);\r\n\tObject(_page_specific_packs_js__WEBPACK_IMPORTED_MODULE_1__[\"InitPacks\"])();\r\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/libraries/page_getters.js":
/*!***************************************!*\
  !*** ./src/libraries/page_getters.js ***!
  \***************************************/
/*! exports provided: pagegetters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"pagegetters\", function() { return pagegetters; });\n\r\n// Functions that get specific data from the page that SHOULD be stored as variables or smth.\r\n\r\nclass pagegetters {\r\n\t\r\n\tstatic get gold() {\r\n\t\treturn Number(document.getElementById(\"golds\").innerHTML);\r\n\t}\r\n\t\r\n\tstatic get ucp() {\r\n\t\treturn Number(document.getElementById(\"ucp\").innerHTML);\r\n\t}\r\n}\r\n\r\nconsole.log(\"Page Getters Loaded!\", pagegetters);\r\n\r\n\n\n//# sourceURL=webpack:///./src/libraries/page_getters.js?");

/***/ }),

/***/ "./src/libraries/rarity_icons.js":
/*!***************************************!*\
  !*** ./src/libraries/rarity_icons.js ***!
  \***************************************/
/*! exports provided: rarityIconsHTML */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"rarityIconsHTML\", function() { return rarityIconsHTML; });\n\r\nvar rarityIconsHTML = {};\r\nvar rarities = [\"BASE\", \"COMMON\", \"RARE\", \"EPIC\", \"LEGENDARY\", \"DETERMINATION\", \"TOKEN\"];\r\nvar extensions = [\"BASE\", \"DELTARUNE\"];\r\n\r\nfunction GenerateRarityIconHTML(extension, rarity) {\r\n\treturn `<img src=\"images/rarity/${extension}_${rarity}.png\" title=\"${rarity}\">`;\r\n}\r\n\r\nfor (var i=0; i < extensions.length; i++) {\r\n\tvar extension = extensions[i];\r\n\trarityIconsHTML[extension] = {};\r\n\tfor (var j=0; j < rarities.length; j++) {\r\n\t\tvar rarity = rarities[j];\r\n\t\trarityIconsHTML[extension][rarity] = GenerateRarityIconHTML(extension, rarity);\r\n\t}\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./src/libraries/rarity_icons.js?");

/***/ }),

/***/ "./src/libraries/underscript_checker.js":
/*!**********************************************!*\
  !*** ./src/libraries/underscript_checker.js ***!
  \**********************************************/
/*! exports provided: PrettyCards_plugin, settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PrettyCards_plugin\", function() { return PrettyCards_plugin; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"settings\", function() { return settings; });\n\r\nif (typeof(underscript) === \"undefined\") {\r\n    if ((!localStorage.getItem(\"PrettyCards_DependencyErrorMessageShown\")) || (localStorage.getItem(\"PrettyCards_DependencyErrorMessageShown\") == \"false\")) {\r\n        var dialog = BootstrapDialog.show({\r\n                title: \"Oh no!\",\r\n                type: BootstrapDialog.TYPE_WARNING,\r\n                message: \"Looks like you don't have Underscript installed, or you deactivated it! In order for PrettyCards to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.\",\r\n                buttons: [{\r\n                        label: \"Proceed\",\r\n                        cssClass: 'btn-primary',\r\n                        action: function (dialog) {\r\n                            dialog.close();\r\n                        }\r\n                    }\r\n                ]\r\n            });\r\n        localStorage.setItem(\"PrettyCards_DependencyErrorMessageShown\", true);\r\n    };\r\n} else {\r\n    localStorage.setItem(\"PrettyCards_DependencyErrorMessageShown\", false);\r\n}\r\n\r\nvar PrettyCards_plugin = underscript.plugin(\"PrettyCards\");\r\n//console.log(\"Plugin: \", PrettyCards_plugin);\r\n\r\nvar settings = [];\r\nsettings.packs = PrettyCards_plugin.settings().add({\r\n        'key': 'packs_page',\r\n        'name': 'Enable Fancy Packs Page', // Name in settings page\r\n        'type': 'boolean',\r\n        'refresh': true, // true to add note \"Will require you to refresh the page\"\r\n        'default': true, // default value\r\n    });\r\n\r\nsettings.replace_soul_selection = PrettyCards_plugin.settings().add({\r\n        'key': 'replace_soul_selection',\r\n        'name': 'Replace Soul Selection', // Name in settings page\r\n        'type': 'boolean',\r\n        'refresh': true, // true to add note \"Will require you to refresh the page\"\r\n        'default': true, // default value\r\n    });\r\n\r\nsettings.easter_egg_cards = PrettyCards_plugin.settings().add({\r\n        'key': 'enable_easter_egg_cards',\r\n        'name': 'Enable Custom Easter Egg Cards', // Name in settings page\r\n        'note': 'Crossover cards created by me.<br>Warning! Doesn\\'t always work (for some reason)!',\r\n        'type': 'boolean',\r\n        'refresh': true, // true to add note \"Will require you to refresh the page\"\r\n        'default': false, // default value\r\n    });\r\n\r\nsettings.debug_mode = PrettyCards_plugin.settings().add({\r\n        'key': 'debug_mode',\r\n        'name': 'Enable Debug Mode', // Name in settings page\r\n        'type': 'boolean',\r\n        'refresh': true, // true to add note \"Will require you to refresh the page\"\r\n        'default': false, // default value\r\n    });\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/libraries/underscript_checker.js?");

/***/ }),

/***/ "./src/libraries/utility.js":
/*!**********************************!*\
  !*** ./src/libraries/utility.js ***!
  \**********************************/
/*! exports provided: utility */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"utility\", function() { return utility; });\n\r\nclass utility {\r\n\tstatic loadCSSFromLink(url) {\r\n\t\tvar e = document.createElement(\"link\");\r\n\t\te.rel  = 'stylesheet';\r\n\t\te.type = 'text/css';\r\n\t\te.href = url;\r\n\t\tdocument.head.appendChild(e);\r\n\t}\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./src/libraries/utility.js?");

/***/ }),

/***/ "./src/page_specific/packs.js":
/*!************************************!*\
  !*** ./src/page_specific/packs.js ***!
  \************************************/
/*! exports provided: InitPacks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InitPacks\", function() { return InitPacks; });\n/* harmony import */ var _libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../libraries/rarity_icons.js */ \"./src/libraries/rarity_icons.js\");\n/* harmony import */ var _libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../libraries/page_getters.js */ \"./src/libraries/page_getters.js\");\n/* harmony import */ var _libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../libraries/underscript_checker.js */ \"./src/libraries/underscript_checker.js\");\n/* harmony import */ var _libraries_utility_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../libraries/utility.js */ \"./src/libraries/utility.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n//console.log(\"PageGetters\", pagegetters);\r\n\r\nvar packs_data = [\r\n\t{\r\n\t\tg_cost : 100,\r\n\t\tucp_cost : 10,\r\n\t\timage: \"\",\r\n\t\tname: \"Undertale Pack\",\r\n\t\tdescription: \"Contains 4 random Undertale Cards.\",\r\n\t\tcode_id: \"Pack\", // Open command: open + ID, Buy G command: add + ID, Buy UCP command: add + ID + Ucp\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : 100,\r\n\t\tucp_cost : 10,\r\n\t\timage: \"\",\r\n\t\tname: \"Deltarune Pack\",\r\n\t\tdescription: \"Contains 4 random Deltarune Cards.\",\r\n\t\tcode_id: \"DRPack\",\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : -1,\r\n\t\tucp_cost : -1,\r\n\t\timage: \"\",\r\n\t\tname: \"Shiny Pack\",\r\n\t\tdescription: \"Contains 4 random Shiny Cards.\",\r\n\t\tcode_id: \"ShinyPack\",\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : -1,\r\n\t\tucp_cost : -1,\r\n\t\timage: \"\",\r\n\t\tname: \"Super Pack\",\r\n\t\tdescription: `Contains a random ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.COMMON}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.COMMON}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.RARE}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.RARE}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.EPIC}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.EPIC} and ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.LEGENDARY}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.LEGENDARY} card.`,\r\n\t\tcode_id: \"SuperPack\",\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : -1,\r\n\t\tucp_cost : -1,\r\n\t\timage: \"\",\r\n\t\tname: \"Final Pack\",\r\n\t\tdescription: `Contains a random ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.RARE}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.RARE}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.EPIC}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.EPIC}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.LEGENDARY}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.LEGENDARY} and ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.DETERMINATION}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.DETERMINATION} card.`,\r\n\t\tcode_id: \"FinalPack\",\r\n\t\tdoes_exist: true\r\n\t}\r\n]\r\n\r\nvar packs_data2 = {}; // To ease id-based search of pack data.\r\nfor (var i=0; i < packs_data.length; i++) {\r\n\tvar data = packs_data[i];\r\n\tpacks_data2[data.code_id] = data;\r\n}\r\n\r\nfunction GenerateBuyRow(pack_data) {\r\n\treturn `\r\n\t\t<input type=\"number\" class=\"PrettyCards_PackBuyCount\" data-packid=\"${pack_data.code_id}\" value=\"1\" min=\"1\" pattern=\"[0-9]\">\r\n\t\tx <button class=\"PrettyCards_PackGBuy btn-primary\" data-packid=\"${pack_data.code_id}\">Buy (<span class=\"PrettyCards_PackGPrice\" data-packid=\"${pack_data.code_id}\">100</span> <img src=\"images/icons/gold.png\" class=\"height-16\">)</button>\r\n\t\t <button class=\"PrettyCards_PackUcpBuy btn-primary\" data-packid=\"${pack_data.code_id}\">Buy (<span class=\"ucp PrettyCards_PackUcpPrice\" data-packid=\"${pack_data.code_id}\">10</span> UCP)</button>\r\n\t`;\r\n}\r\n\r\nfunction GenerateOpenRow(pack_data) {\r\n\treturn `\r\n\t\t<input type=\"number\" class=\"PrettyCards_PackOpenCount\" data-packid=\"${pack_data.code_id}\" value=\"1\" min=\"1\" pattern=\"[0-9]\">\r\n\t\tx <button class=\"PrettyCards_PackOpen btn-primary\" data-packid=\"${pack_data.code_id}\">Open <span class=\"PrettyCards_PackOpenCountButton\" data-packid=\"${pack_data.code_id}\">1</span></button>\r\n\t`;\r\n}\r\n\r\nfunction GeneratePack(pack_data, pack_count) {\r\n\tvar buystr = (pack_data.does_exist && (pack_data.g_cost > -1)) ? GenerateBuyRow(pack_data) : \"This pack cannot be bought.\";\r\n\tvar openstr = pack_data.does_exist ? GenerateOpenRow(pack_data) : \"This pack cannot be opened.\";\r\n\treturn `\r\n\t<div class=\"PrettyCards_FloatingPack\">\r\n\t\t<img src=\"${pack_data.image}\">\r\n\t\t<div class=\"PrettyCards_PackText\">\r\n\t\t\t<div class=\"PrettyCards_PackName\">${pack_data.name}</div>\r\n\t\t\t<div class=\"PrettyCards_PackDescription\">${pack_data.description}</div>\r\n\t\t\t<div class=\"PrettyCards_PackBuy\">${buystr}</div>\r\n\t\t\t<div class=\"PrettyCards_PackOpen\">${openstr}</div>\r\n\t\t</div>\r\n\t</div>\r\n\t`;\r\n}\r\n\r\nvar mainContent = document.querySelector(\".mainContent\");\r\n\r\nfunction DeleteUglyPage() { // Nothing personal\r\n\tvar children = mainContent.children;\r\n\tfor (var i=0; i < children.length; i++) {\r\n\t\tvar element = children[i];\r\n\t\tif (element.nodeName == \"NAV\" || element.nodeName == \"FOOTER\" || element.nodeName == \"SCRIPT\" || (element.nodeName == \"TABLE\" && element.id == \"cardsOpen\")) {\r\n\t\t\tcontinue;\r\n\t\t}\r\n\t\telement.remove();\r\n\t}\r\n}\r\n\r\nfunction SanitizeNumberInput(input) {\r\n\tvar val = input.value || \"1\";\r\n\tval = val.replace(\"-\", \"\");\r\n\tval = val.replace(\",\", \"\");\r\n\tval = val.replace(\".\", \"\");\r\n\tinput.value = val;\r\n}\r\n\r\nfunction ChangePrices(code_id, count) {\r\n\tcount = Number(count);\r\n\tconsole.log(count, code_id);\r\n\tif (count == NaN) {\r\n\t\treturn;\r\n\t}\r\n\tvar data = packs_data2[code_id];\r\n\tdocument.querySelector(\".PrettyCards_PackGPrice[data-packid=\"+ code_id +\"]\").innerHTML = Math.min(count * data.g_cost, Math.floor(_libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_1__[\"pagegetters\"].gold/data.g_cost)*data.g_cost);\r\n\tdocument.querySelector(\".PrettyCards_PackUcpPrice[data-packid=\"+ code_id +\"]\").innerHTML = Math.min(count * data.ucp_cost, Math.floor(_libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_1__[\"pagegetters\"].ucp/data.ucp_cost)*data.ucp_cost);\r\n}\r\n\r\nfunction ChangePackCountButton(code_id, count) {\r\n\tcount = Number(count);\r\n\tconsole.log(count, code_id);\r\n\tif (count == NaN) {\r\n\t\treturn;\r\n\t}\r\n\tvar data = packs_data2[code_id];\r\n\tdocument.querySelector(\".PrettyCards_PackOpenCountButton[data-packid=\"+ code_id +\"]\").innerHTML = Math.min(count, 50);\r\n}\r\n\r\nfunction InitPacks() {\r\n\tDeleteUglyPage();\r\n\t\r\n\tmainContent.innerHTML += `\r\n\t\t<div class=\"PrettyCards_PacksRow\">\r\n\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"Pack\"></div>\r\n\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"DRPack\"></div>\r\n\t\t</div>\r\n\t\t<div class=\"PrettyCards_PacksRow\">\r\n\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"ShinyPack\"></div>\r\n\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"SuperPack\"></div>\r\n\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"FinalPack\"></div>\r\n\t\t</div>\r\n\t`\r\n\t\r\n\tfor (var i=0; i < packs_data.length; i++) {\r\n\t\tvar data = packs_data[i];\r\n\t\tvar txt = GeneratePack(data);\r\n\t\tdocument.querySelector(\".PrettyCards_PackCell[data-packid=\"+ data.code_id +\"]\").innerHTML = txt;\r\n\t\tconsole.log(packs_data[i], txt);\r\n\t\tif (data.does_exist) {\r\n\t\t\tdocument.querySelector(\".PrettyCards_PackOpenCount[data-packid=\"+ data.code_id +\"]\").onchange = function(e) {SanitizeNumberInput(this);ChangePackCountButton(this.getAttribute(\"data-packid\"), this.value)};\r\n\t\t\tif (data.g_cost > -1) {\r\n\t\t\tdocument.querySelector(\".PrettyCards_PackBuyCount[data-packid=\"+ data.code_id +\"]\").onchange = function(e) {SanitizeNumberInput(this);ChangePrices(this.getAttribute(\"data-packid\"), this.value)};\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\t\r\n\t_libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__[\"PrettyCards_plugin\"].events.on(\"openedPacks\", function(a1, a2, a3) {console.log(a1, a2, a3)});\r\n\t\r\n\t_libraries_utility_js__WEBPACK_IMPORTED_MODULE_3__[\"utility\"].loadCSSFromLink(\"https://cdn.jsdelivr.net/gh/CMD-God/prettycards@c24dbbfdded645980f70657013dcba25fa12acb5/css/Packs.css\");\r\n}\r\n\r\nconsole.log(\"InitPacks\", InitPacks);\r\n\r\n\n\n//# sourceURL=webpack:///./src/page_specific/packs.js?");

/***/ })

/******/ });