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

/***/ "./src/libraries/packs_page_templates/base.js":
/*!****************************************************!*\
  !*** ./src/libraries/packs_page_templates/base.js ***!
  \****************************************************/
/*! exports provided: PacksPageTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PacksPageTemplate\", function() { return PacksPageTemplate; });\n/* harmony import */ var _libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../libraries/page_getters.js */ \"./src/libraries/page_getters.js\");\n\r\n\r\n\r\n// This is the parent class.\r\n\r\nclass PacksPageTemplate {\r\n\t\r\n\tstatic displayName() { // Required\r\n\t\treturn \"Base\";\r\n\t}\r\n\t\r\n\tstatic description() { // Required\r\n\t\treturn \"This should not be visible!\";\r\n\t}\r\n\t\r\n\tstatic pageAdditions() { // Required\r\n\t\treturn `\r\n\t\t\t<div class=\"PrettyCards_PacksRow\">\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"Pack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"DRPack\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"PrettyCards_PackSpacer\"></div>\r\n\t\t\t<div class=\"PrettyCards_PacksRow\">\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"ShinyPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"SuperPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"FinalPack\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"PrettyCards_PackSpacer\"></div>\r\n\t\t`;\r\n\t}\r\n\t\r\n\tstatic generateBuyRow(pack_data) { // Required?\r\n\t\treturn `\r\n\t\t\t<input type=\"number\" class=\"PrettyCards_PackBuyCount\" data-packid=\"${pack_data.code_id}\" value=\"1\" min=\"1\" pattern=\"[0-9]\">\r\n\t\t\tx <button class=\"PrettyCards_PackGBuy btn-primary\" data-packid=\"${pack_data.code_id}\">Buy (<span class=\"PrettyCards_PackGPrice\" data-packid=\"${pack_data.code_id}\">100</span> <img src=\"images/icons/gold.png\" class=\"height-16\">)</button>\r\n\t\t\t<button class=\"PrettyCards_PackUcpBuy btn-primary\" data-packid=\"${pack_data.code_id}\">Buy (<span class=\"ucp PrettyCards_PackUcpPrice\" data-packid=\"${pack_data.code_id}\">10</span> UCP)</button>\r\n\t\t`;\r\n\t}\r\n\t\r\n\tstatic generateOpenRow(pack_data) { // Required?\r\n\t\treturn `\r\n\t\t\t<input type=\"number\" class=\"PrettyCards_PackOpenCount\" data-packid=\"${pack_data.code_id}\" value=\"1\" min=\"1\" pattern=\"[0-9]\">\r\n\t\t\tx <button class=\"PrettyCards_PackOpen btn-primary\" data-packid=\"${pack_data.code_id}\">Open <span class=\"PrettyCards_PackOpenCountButton\" data-packid=\"${pack_data.code_id}\">1</span></button>\r\n\t\t`;\r\n\t}\r\n\t\r\n\tstatic generatePack(pack_data) { // Required\r\n\t\tvar buystr = (pack_data.does_exist && (pack_data.g_cost > -1)) ? this.generateBuyRow(pack_data) : \"This pack cannot be bought.\";\r\n\t\tvar openstr = pack_data.does_exist ? this.generateOpenRow(pack_data) : \"This pack cannot be opened.\";\r\n\t\treturn `\r\n\t\t<div class=\"PrettyCards_PackContainer\">\r\n\t\t\t<div class=\"PrettyCards_FloatingPack\">\r\n\t\t\t\t<div class=\"PrettyCards_FloatingPackImage\" style=\"background-image: url(${pack_data.image})\">\r\n\t\t\t\t\t\t<div class=\"PrettyCards_PackAmount\">${pack_data.amount}</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"PrettyCards_PackText\">\r\n\t\t\t\t<div class=\"PrettyCards_PackName\">${pack_data.name}</div>\r\n\t\t\t\t<div class=\"PrettyCards_PackDescription\">${pack_data.description}</div>\r\n\t\t\t\t<div class=\"PrettyCards_PackBuy\">${buystr}</div>\r\n\t\t\t\t<div class=\"PrettyCards_PackOpen\">${openstr}</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t`;\r\n\t}\r\n\t\r\n\tstatic sanitizeNumberInput(input) {\r\n\t\tvar val = input.value || \"1\";\r\n\t\tval = val.replace(\"-\", \"\");\r\n\t\tval = val.replace(\",\", \"\");\r\n\t\tval = val.replace(\".\", \"\");\r\n\t\tinput.value = val;\r\n\t}\r\n\r\n\tstatic changePrices(code_id, count) {\r\n\t\tcount = Number(count);\r\n\t\t//console.log(count, code_id);\r\n\t\tif (count == NaN) {\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tvar data = packs_data2[code_id];\r\n\t\tdocument.querySelector(\".PrettyCards_PackGPrice[data-packid=\"+ code_id +\"]\").innerHTML = Math.min(count * data.g_cost, Math.floor(_libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_0__[\"pagegetters\"].gold/data.g_cost)*data.g_cost);\r\n\t\tdocument.querySelector(\".PrettyCards_PackUcpPrice[data-packid=\"+ code_id +\"]\").innerHTML = Math.min(count * data.ucp_cost, Math.floor(_libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_0__[\"pagegetters\"].ucp/data.ucp_cost)*data.ucp_cost);\r\n\t}\r\n\r\n\tstatic changePackCountButton(code_id, count) {\r\n\t\tcount = Number(count);\r\n\t\t//console.log(count, code_id);\r\n\t\tif (count == NaN) {\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tvar data = packs_data2[code_id];\r\n\t\tdocument.querySelector(\".PrettyCards_PackOpenCountButton[data-packid=\"+ code_id +\"]\").innerHTML = Math.min(count, 50);\r\n\t}\r\n\t\r\n\tstatic onPackMouseOver(e) {\r\n\t\t//debugger;\r\n\t\tvar code_id = e.currentTarget.getAttribute(\"data-packid\");\r\n\t\tif (!code_id) {console.log(\"Mouse Over Return\", e);return;}\r\n\t\t//console.log(\"Mouse Over\", e, code_id);\r\n\t\t$(\".PrettyCards_PackCell[data-packid=\"+ code_id +\"] .PrettyCards_PackText\").stop().slideDown( 250, function() {});\r\n\t}\r\n\t\r\n\tstatic onPackMouseLeave(e) {\r\n\t\tvar code_id = e.currentTarget.getAttribute(\"data-packid\");\r\n\t\tif (!code_id) {console.log(\"Mouse Leave Return\", e);return;}\r\n\t\t//console.log(\"Mouse Leave\", e, code_id);\r\n\t\t$(\".PrettyCards_PackCell[data-packid=\"+ code_id +\"] .PrettyCards_PackText\").stop().slideUp( 250, function() {});\r\n\t}\r\n\t\r\n\tstatic onPackOpenCountChange(e) {\r\n\t\tthis.sanitizeNumberInput(e.target);\r\n\t\tthis.changePackCountButton(e.target.getAttribute(\"data-packid\"), e.target.value);\r\n\t}\r\n\t\r\n\tstatic onPackBuyCountChange(e) {\r\n\t\tthis.sanitizeNumberInput(e.target);\r\n\t\tthis.changePrices(e.target.getAttribute(\"data-packid\"), e.target.value);\r\n\t}\r\n\t\r\n\tstatic onPackGeneration(data, pack_cell) { // Optional, but has default behaviour.\r\n\t\tpack_cell.addEventListener( \"mouseover\", this.onPackMouseOver);\r\n\t\tpack_cell.addEventListener( \"mouseleave\", this.onPackMouseLeave);\r\n\t\t$(\".PrettyCards_PackCell[data-packid=\"+ data.code_id +\"] .PrettyCards_PackText\").slideUp(0);\r\n\t\t$(\".PrettyCards_PackCell[data-packid=\"+ data.code_id +\"] .PrettyCards_FloatingPackImage\").css(\"animation-delay\", (Math.random()*1.5) + \"s\");\r\n\t\tif (data.does_exist) {\r\n\t\t\tdocument.querySelector(\".PrettyCards_PackOpenCount[data-packid=\"+ data.code_id +\"]\").onchange = this.onPackOpenCountChange;\r\n\t\t\tif (data.g_cost > -1) {\r\n\t\t\tdocument.querySelector(\".PrettyCards_PackBuyCount[data-packid=\"+ data.code_id +\"]\").onchange = this.onPackBuyCountChange;\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\t\r\n\tstatic generatePagePack(data) { // Required. It's used in generatePage and ran for every individual pack. This function should be responsible for adding them.\r\n\t\tvar txt = this.generatePack(data);\r\n\t\tvar pack_cell = document.querySelector(\".PrettyCards_PackCell[data-packid=\"+ data.code_id +\"]\");\r\n\t\tpack_cell.innerHTML = txt;\r\n\t\t\r\n\t\tthis.onPackGeneration(data, pack_cell);\r\n\t}\r\n\t\r\n\tstatic generatePage(packs_data) { // Required\r\n\t\t\r\n\t\tdocument.getElementById(\"PrettyCards_MainContent\").innerHTML =  this.pageAdditions();\r\n\t\t\t\t\r\n\t\tfor (var i=0; i < packs_data.length; i++) {\r\n\t\t\tthis.generatePagePack(packs_data[i]);\r\n\t\t}\r\n\t}\r\n\t\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./src/libraries/packs_page_templates/base.js?");

/***/ }),

/***/ "./src/libraries/packs_page_templates/classic.js":
/*!*******************************************************!*\
  !*** ./src/libraries/packs_page_templates/classic.js ***!
  \*******************************************************/
/*! exports provided: ClassicPacksTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ClassicPacksTemplate\", function() { return ClassicPacksTemplate; });\n/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ \"./src/libraries/packs_page_templates/base.js\");\n\r\n\r\n\r\nclass ClassicPacksTemplate extends _base_js__WEBPACK_IMPORTED_MODULE_0__[\"PacksPageTemplate\"] {\r\n\t\r\n\tstatic displayName() {\r\n\t\treturn \"Classic\";\r\n\t}\r\n\t\r\n\tstatic description() {\r\n\t\treturn \"For people who liked the old design. WIP, low priority.\";\r\n\t}\r\n\t\r\n\tstatic pageAdditions() { // Required\r\n\t\treturn `\r\n\t\t\t<div class=\"PrettyCards_PacksRow PrettyCards_WideTemplate\">\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"Pack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"DRPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"ShinyPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"SuperPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"FinalPack\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"PrettyCards_PackSpacer\"></div>\r\n\t\t`;\r\n\t}\r\n\t\r\n}\r\n\t\r\n\n\n//# sourceURL=webpack:///./src/libraries/packs_page_templates/classic.js?");

/***/ }),

/***/ "./src/libraries/packs_page_templates/normal.js":
/*!******************************************************!*\
  !*** ./src/libraries/packs_page_templates/normal.js ***!
  \******************************************************/
/*! exports provided: NormalPacksTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NormalPacksTemplate\", function() { return NormalPacksTemplate; });\n/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ \"./src/libraries/packs_page_templates/base.js\");\n\r\n\r\n\r\nclass NormalPacksTemplate extends _base_js__WEBPACK_IMPORTED_MODULE_0__[\"PacksPageTemplate\"] {\r\n\t\r\n\t// The rest is the default functions :P\r\n\t\r\n\tstatic displayName() {\r\n\t\treturn \"Normal\";\r\n\t}\r\n\t\r\n\tstatic description() {\r\n\t\treturn \"The default theme. Looks quite ugly.\";\r\n\t}\r\n\t\r\n}\r\n\t\r\n\n\n//# sourceURL=webpack:///./src/libraries/packs_page_templates/normal.js?");

/***/ }),

/***/ "./src/libraries/packs_page_templates/wide.js":
/*!****************************************************!*\
  !*** ./src/libraries/packs_page_templates/wide.js ***!
  \****************************************************/
/*! exports provided: WidePacksTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WidePacksTemplate\", function() { return WidePacksTemplate; });\n/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ \"./src/libraries/packs_page_templates/base.js\");\n\r\n\r\n\r\nclass WidePacksTemplate extends _base_js__WEBPACK_IMPORTED_MODULE_0__[\"PacksPageTemplate\"] {\r\n\t\r\n\t// The rest is the default functions :P\r\n\t\r\n\tstatic displayName() {\r\n\t\treturn \"Wide\";\r\n\t}\r\n\t\r\n\tstatic description() {\r\n\t\treturn \"Probably the closest to how I envisioned the page.\";\r\n\t}\r\n\t\r\n\tstatic pageAdditions() { // Required\r\n\t\treturn `\r\n\t\t\t<div class=\"PrettyCards_ThirdPackSpacer\"></div>\r\n\t\t\t<div class=\"PrettyCards_PacksRow PrettyCards_WideTemplate\">\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"Pack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"DRPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"ShinyPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"SuperPack\"></div>\r\n\t\t\t\t<div class=\"PrettyCards_PackCell\" data-packid=\"FinalPack\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"PrettyCards_PackSpacer\"></div>\r\n\t\t`;\r\n\t}\r\n\t\r\n}\r\n\t\r\n\n\n//# sourceURL=webpack:///./src/libraries/packs_page_templates/wide.js?");

/***/ }),

/***/ "./src/libraries/page_getters.js":
/*!***************************************!*\
  !*** ./src/libraries/page_getters.js ***!
  \***************************************/
/*! exports provided: pagegetters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"pagegetters\", function() { return pagegetters; });\n\r\n// Functions that get specific data from the page that SHOULD be stored as variables or smth.\r\n\r\nclass pagegetters {\r\n\t\r\n\tstatic get gold() {\r\n\t\treturn Number(document.getElementById(\"golds\").innerHTML);\r\n\t}\r\n\t\r\n\tstatic get ucp() {\r\n\t\treturn Number(document.getElementById(\"ucp\").innerHTML);\r\n\t}\r\n\t\r\n\tstatic GetNumberOfPacks(code_id) {\r\n\t\treturn Number(document.getElementById(\"nb\" + code_id + \"s\").innerHTML);\r\n\t}\r\n}\r\n\r\nconsole.log(\"Page Getters Loaded!\", pagegetters);\r\n\r\n\n\n//# sourceURL=webpack:///./src/libraries/page_getters.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InitPacks\", function() { return InitPacks; });\n/* harmony import */ var _libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../libraries/rarity_icons.js */ \"./src/libraries/rarity_icons.js\");\n/* harmony import */ var _libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../libraries/page_getters.js */ \"./src/libraries/page_getters.js\");\n/* harmony import */ var _libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../libraries/underscript_checker.js */ \"./src/libraries/underscript_checker.js\");\n/* harmony import */ var _libraries_utility_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../libraries/utility.js */ \"./src/libraries/utility.js\");\n/* harmony import */ var _libraries_packs_page_templates_normal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../libraries/packs_page_templates/normal.js */ \"./src/libraries/packs_page_templates/normal.js\");\n/* harmony import */ var _libraries_packs_page_templates_wide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../libraries/packs_page_templates/wide.js */ \"./src/libraries/packs_page_templates/wide.js\");\n/* harmony import */ var _libraries_packs_page_templates_classic_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../libraries/packs_page_templates/classic.js */ \"./src/libraries/packs_page_templates/classic.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nvar pagetemplates = [_libraries_packs_page_templates_normal_js__WEBPACK_IMPORTED_MODULE_4__[\"NormalPacksTemplate\"], _libraries_packs_page_templates_wide_js__WEBPACK_IMPORTED_MODULE_5__[\"WidePacksTemplate\"], _libraries_packs_page_templates_classic_js__WEBPACK_IMPORTED_MODULE_6__[\"ClassicPacksTemplate\"]];\r\n\r\nvar settingsoptions = [];\r\nvar settingsnote = \"Select the look of the Packs Page!\";\r\n\r\nfor (var i=0; i < pagetemplates.length; i++) {\r\n\tsettingsoptions[i] = pagetemplates[i].displayName();\r\n\tsettingsnote += (\"<br>\" + pagetemplates[i].displayName() + \": \" + pagetemplates[i].description());\r\n}\r\n\r\nfunction GetPageTemplateByName(name) {\r\n\tfor (var i=0; i < pagetemplates.length; i++) {\r\n\t\tif (pagetemplates[i].displayName() == name) {\r\n\t\t\treturn pagetemplates[i];\r\n\t\t}\r\n\t}\r\n\treturn null;\r\n}\r\n\r\nfunction ChangeTemplate(newname, oldname) {\r\n\tGetPageTemplateByName(newname).generatePage(packs_data);\r\n}\r\n\r\n_libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__[\"settings\"].packs_page_template = _libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__[\"PrettyCards_plugin\"].settings().add({\r\n\t'key': 'packs_page_template', // key\r\n\t'name': 'Packs Page Template', // Name in settings page\r\n\t'type': 'select',\r\n\t'note': settingsnote, // Show note when hovering over setting\r\n\t'refresh': true, // true to add note \"Will require you to refresh the page\"\r\n\t//'disabled': boolean or `function(): boolean`, // true to disable setting\r\n\t'default': \"Normal\", // default value\r\n\t'options': settingsoptions, // Options for type 'select'\r\n\t'reset': true, // Adds a reset button (sets to default)\r\n\t'onChange': ChangeTemplate, // called when value is changed\r\n});\r\n\r\n//console.log(\"PageGetters\", pagegetters);\r\n\r\nvar packs_data = [\r\n\t{\r\n\t\tg_cost : 100,\r\n\t\tucp_cost : 10,\r\n\t\timage: \"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png\",\r\n\t\tname: \"Undertale Pack\",\r\n\t\tdescription: \"Contains 4 random Undertale Cards.\",\r\n\t\tcode_id: \"Pack\", // Open command: open + ID, Buy G command: add + ID, Buy UCP command: add + ID + Ucp\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : 100,\r\n\t\tucp_cost : 10,\r\n\t\timage: \"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png\",\r\n\t\tname: \"Deltarune Pack\",\r\n\t\tdescription: \"Contains 4 random Deltarune Cards.\",\r\n\t\tcode_id: \"DRPack\",\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : -1,\r\n\t\tucp_cost : -1,\r\n\t\timage: \"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png\",\r\n\t\tname: \"Shiny Pack\",\r\n\t\tdescription: \"Contains 4 random Shiny Cards.\",\r\n\t\tcode_id: \"ShinyPack\",\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : -1,\r\n\t\tucp_cost : -1,\r\n\t\timage: \"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png\",\r\n\t\tname: \"Super Pack\",\r\n\t\tdescription: `Contains a random ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.COMMON}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.COMMON}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.RARE}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.RARE}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.EPIC}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.EPIC} and ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.LEGENDARY}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.LEGENDARY} card.`,\r\n\t\tcode_id: \"SuperPack\",\r\n\t\tdoes_exist: true\r\n\t},\r\n\t{\r\n\t\tg_cost : -1,\r\n\t\tucp_cost : -1,\r\n\t\timage: \"https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack_old.png\",\r\n\t\tname: \"Final Pack\",\r\n\t\tdescription: `Contains a random ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.RARE}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.RARE}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.EPIC}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.EPIC}, ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.LEGENDARY}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.LEGENDARY} and ${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].BASE.DETERMINATION}/${_libraries_rarity_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"rarityIconsHTML\"].DELTARUNE.DETERMINATION} card.`,\r\n\t\tcode_id: \"FinalPack\",\r\n\t\tdoes_exist: true\r\n\t}\r\n]\r\n\r\nvar packs_data2 = {}; // To ease id-based search of pack data.\r\nfor (var i=0; i < packs_data.length; i++) {\r\n\tvar data = packs_data[i];\r\n\tdata.amount = _libraries_page_getters_js__WEBPACK_IMPORTED_MODULE_1__[\"pagegetters\"].GetNumberOfPacks(data.code_id); // Appends how many packs of that kind does the user have to the pack data.\r\n\tpacks_data2[data.code_id] = data;\r\n}\r\n\r\nfunction deletUglyPage() { // Nothing personal.\r\n\tvar children = [...document.querySelector(\".mainContent\").children];\r\n\t//console.log(children);\r\n\tfor (var i=0; i < children.length; i++) {\r\n\t\tvar element = children[i];\r\n\t\tif (element.nodeName == \"NAV\" || element.nodeName == \"FOOTER\" || element.nodeName == \"SCRIPT\" || (element.nodeName == \"TABLE\" && element.id == \"cardsOpen\")) {\r\n\t\t\tcontinue;\r\n\t\t} else {\r\n\t\t\telement.remove();\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction InitPacks() {\r\n\t\r\n\tdeletUglyPage();\r\n\tdocument.querySelector(\".mainContent\").innerHTML += \"<div id='PrettyCards_MainContent'></div>\";\r\n\r\n\tChangeTemplate(_libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__[\"settings\"].packs_page_template.value(), null);\r\n\t\r\n\t_libraries_underscript_checker_js__WEBPACK_IMPORTED_MODULE_2__[\"PrettyCards_plugin\"].events.on(\"openedPacks\", function(a1, a2, a3) {console.log(a1, a2, a3)});\r\n\t\r\n\t_libraries_utility_js__WEBPACK_IMPORTED_MODULE_3__[\"utility\"].loadCSSFromLink(\"https://cdn.jsdelivr.net/gh/CMD-God/prettycards@15b2515bf628fdb78e87ef62e3a8eabe974c5caf/css/Packs.css\");\r\n}\r\n\r\nconsole.log(\"InitPacks\", InitPacks);\r\n\r\n\n\n//# sourceURL=webpack:///./src/page_specific/packs.js?");

/***/ })

/******/ });