// ==UserScript==
// @name        PrettyCards Audio
// @version     1.0.0
// @author      CMD_God
// @description Add vibrant sounds to an Undercards match!
// @homepage    https://github.com/CMD-God/prettycards
// @supportURL  https://github.com/CMD-God/prettycards
// @match       https://*.undercards.net/*
// @exclude     https://*.undercards.net/*/*
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

/***/ "./src/audio_dictionary.js":
/*!*********************************!*\
  !*** ./src/audio_dictionary.js ***!
  \*********************************/
/*! exports provided: audioDictionary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"audioDictionary\", function() { return audioDictionary; });\n\r\nclass AudioDictionary {\r\n\t\r\n\tconstructor() {\r\n\t\tvar sounds = {\r\n\t\t\t\"your_turn_start\" : \"\",\r\n\t\t\t\"enemy_turn_start\" : \"\",\r\n\t\t\t\"card_draw\": \"\",\r\n\t\t\t\"monster_buff\": \"\",\r\n\t\t\t\"monster_nerf\": \"\"\r\n\t\t}\r\n\t\tvar audio_objects = {}\r\n\t}\r\n\t\r\n\tPlaySoundEffect(name) {\r\n\t\tif (false) {}\r\n\t\tif (audio_objects[name]) {\r\n\t\t\taudio_objects[name].stop();\r\n\t\t}\r\n\t\tvar musicPath = this.sounds[name];\r\n\t\tvar audio = new Audio(musicPath);\r\n\t\taudio.volume = 0.1;\r\n\t\taudio.play();\r\n\t\taudio_objects[name] = audio;\r\n\t}\r\n\t\r\n}\r\n\r\nvar audioDictionary = new AudioDictionary();\r\n\r\n\n\n//# sourceURL=webpack:///./src/audio_dictionary.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /src/underscript_checker.js */ \"./src/underscript_checker.js\");\n/* harmony import */ var _src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! /src/audio_dictionary.js */ \"./src/audio_dictionary.js\");\n\r\n\r\n\r\n\r\nif (window.underscript.onPage(\"Game\")) {\r\n\t\r\n}\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /src/underscript_checker.js */ \"./src/underscript_checker.js\");\n/* harmony import */ var _src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! /src/audio_dictionary.js */ \"./src/audio_dictionary.js\");\n/* harmony import */ var _src_game_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! /src/game.js */ \"./src/game.js\");\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/underscript_checker.js":
/*!************************************!*\
  !*** ./src/underscript_checker.js ***!
  \************************************/
/*! exports provided: plugin, settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"plugin\", function() { return plugin; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"settings\", function() { return settings; });\n\r\nif (typeof(window.underscript) === \"undefined\") {\r\n    if ((!window.localStorage.getItem(\"PrettyCardsAudio_DependencyErrorMessageShown\")) || (window.localStorage.getItem(\"PrettyCardsAudio_DependencyErrorMessageShown\") == \"false\")) {\r\n        var dialog = window.BootstrapDialog.show({\r\n                title: \"Oh no!\",\r\n                type: window.BootstrapDialog.TYPE_WARNING,\r\n                message: \"Looks like you don't have Underscript installed, or you deactivated it! In order for PrettyCards Audio to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.\",\r\n                buttons: [{\r\n                        label: \"Proceed\",\r\n                        cssClass: 'btn-primary',\r\n                        action: function (dialog) {\r\n                            dialog.close();\r\n                        }\r\n                    }\r\n                ]\r\n            });\r\n        window.localStorage.setItem(\"PrettyCardsAudio_DependencyErrorMessageShown\", true);\r\n    };\r\n} else {\r\n    window.localStorage.setItem(\"PrettyCardsAudio_DependencyErrorMessageShown\", false);\r\n}\r\n\r\nvar plugin = window.underscript.plugin(\"PrettyCards Audio\");\r\nwindow.PrettyCardsAudio_plugin = plugin;\r\n//var PrettyCards_plugin = underscript.plugin('<span class=\"RARE\">PrettyCards</span>');\r\n//console.log(\"Plugin: \", PrettyCards_plugin);\r\n\r\nvar settings = [];\r\nsettings.turn_start = plugin.settings().add({\r\n        'key': 'turn_start',\r\n        'name': 'Enable the \"Turn Start\" sound.', // Name in settings page\r\n        'type': 'boolean',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': true, // default value\r\n    });\r\n\r\n//console.log(settings);\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/underscript_checker.js?");

/***/ })

/******/ });