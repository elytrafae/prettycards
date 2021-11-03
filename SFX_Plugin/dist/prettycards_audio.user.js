// ==UserScript==
// @name        PrettyCards Audio
// @version     1.1.0
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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"audioDictionary\", function() { return audioDictionary; });\n\r\nclass AudioDictionary {\r\n\t\r\n\tconstructor() {\r\n\t\tthis.sounds = {\r\n\t\t\t\"your_turn_start\" : \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Turn_Start.ogg\",\r\n\t\t\t\"enemy_turn_start\" : \"\",\r\n\t\t\t\"card_draw\": \"\",\r\n\t\t\t\"monster_buff\": \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Buff.ogg\",\r\n\t\t\t\"monster_nerf\": \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Nerf.ogg\",\r\n\t\t\t\"paralyze\": \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Paralyze.ogg\",\r\n\t\t\t\"kr\": \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/KR.ogg\",\r\n\t\t\t\"silence\": \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Silence.ogg\",\r\n\t\t\t\"crit_spell\": \"https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Spell_Crit.ogg\"\r\n\t\t}\r\n\t\tthis.audio_objects = {}\r\n\t}\r\n\t\r\n\tPlaySoundEffect(name, volume_setting = 50, volume = 0.4) {\r\n\t\tif (!window.soundEnabled || volume_setting <= 0) {\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tif (this.audio_objects[name]) {\r\n\t\t\tthis.audio_objects[name].pause();\r\n\t\t}\r\n\t\tvar musicPath = this.sounds[name];\r\n\t\tvar audio = new Audio(musicPath);\r\n\t\taudio.volume = volume * (volume_setting/100);\r\n\t\taudio.play();\r\n\t\tthis.audio_objects[name] = audio;\r\n\t}\r\n\t\r\n}\r\n\r\nvar audioDictionary = new AudioDictionary();\r\n\r\n\n\n//# sourceURL=webpack:///./src/audio_dictionary.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /src/underscript_checker.js */ \"./src/underscript_checker.js\");\n/* harmony import */ var _src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! /src/audio_dictionary.js */ \"./src/audio_dictionary.js\");\n/* harmony import */ var _src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! /src/wrap_with_event.js */ \"./src/wrap_with_event.js\");\n\r\n\r\n\r\n\r\n\r\nconsole.log(\"PrettyCards Audio!\");\r\n\r\nvar damage_type = \"\"; // Can be \"ATTACK\" or \"SPELL\"\r\nvar damager_id = 0; // The damager id\r\nvar player_id = 0; // In case of souls and artifacts\r\n\r\nfunction CritSpellAnimation() {\r\n\tif (!_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].crit_spell_anim.value()) {\r\n\t\treturn;\r\n\t}\r\n\tvar $mainContent = window.$('.mainContent');\r\n\t$mainContent.effect(\"shake\", {direction: \"up\", times: 1, distance: 5}, 25);\r\n\t$mainContent.effect(\"shake\", {direction: \"right\", times: 1, distance: 5}, 25);\r\n\t$mainContent.effect(\"shake\", {direction: \"up\", times: 1, distance: 5}, 25);\r\n\t$mainContent.effect(\"shake\", {direction: \"right\", times: 1, distance: 5}, 25);\r\n\t\r\n\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"crit_spell\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].crit_spell.value());\r\n}\r\n\r\nif (window.underscript.onPage(\"Game\")) {\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"getTurnStart\", function(data) {\r\n\t\t//console.log(\"DATA\", data);\r\n\t\tif (window.userId == data.idPlayer) {\r\n\t\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"your_turn_start\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].turn_start.value(), 1);\r\n\t\t}\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"attackBuffAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"attackBuffAnimation\", function(data) {\r\n\t\t//console.log(\"ATK_BUFF_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"monster_buff\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].buff.value());\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"hpBuffAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"hpBuffAnimation\", function(data) {\r\n\t\t//console.log(\"HP_BUFF_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"monster_buff\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].buff.value());\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"attackDebuffAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"attackDebuffAnimation\", function(data) {\r\n\t\t//console.log(\"ATK_NERF_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"monster_nerf\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].nerf.value());\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"hpDebuffAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"hpDebuffAnimation\", function(data) {\r\n\t\t//console.log(\"HP_NERF_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"monster_nerf\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].nerf.value());\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"freezeAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"freezeAnimation\", function(data) {\r\n\t\t//console.log(\"FREEZE_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"paralyze\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].paralyze.value());\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"poisonAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"poisonAnimation\", function(data) {\r\n\t\t//console.log(\"KR_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"kr\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].kr.value());\r\n\t});\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"silenceAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"silenceAnimation\", function(data) {\r\n\t\t//console.log(\"SILENCE_DATA\", data);\r\n\t\t_src_audio_dictionary_js__WEBPACK_IMPORTED_MODULE_1__[\"audioDictionary\"].PlaySoundEffect(\"silence\", _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"settings\"].silence.value());\r\n\t});\r\n\t\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"getFight getFightPlayer\", function(data) {\r\n\t\tconsole.log(\"FIGHT_DATA\", data);\r\n\t\tdamage_type = \"ATTACK\";\r\n\t\tdamager_id = data.attackMonster;\r\n\t})\r\n\t\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"getDoingEffect\", function(data) {\r\n\t\tconsole.log(\"CARD_EFFECT_DATA\", data);\r\n\t\tdamage_type = \"CARD_EFFECT\";\r\n\t\tdamager_id = data.monsterId || data.spellId;\r\n\t})\r\n\t\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"getArtifactDoingEffect\", function(data) {\r\n\t\tconsole.log(\"ARTIFACT_EFFECT_DATA\", data);\r\n\t\tdamage_type = \"ARTIFACT_EFFECT\";\r\n\t\tdamager_id = data.artifactId;\r\n\t\tplayer_id = data.playerId;\r\n\t})\r\n\t\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"getSoulDoingEffect\", function(data) {\r\n\t\tconsole.log(\"SOUL_EFFECT_DATA\", data);\r\n\t\tdamage_type = \"SOUL_EFFECT\";\r\n\t\tdamager_id = data.playerId;\r\n\t\tplayer_id = data.playerId;\r\n\t})\r\n\t\r\n\tObject(_src_wrap_with_event_js__WEBPACK_IMPORTED_MODULE_2__[\"WrapWithEvent\"])(\"hpStatAnimation\");\r\n\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.on(\"hpStatAnimation\", function(data) {\r\n\t\tconsole.log(\"HP_SET_ANIMATION_DATA\", data);\r\n\t\tconsole.log(\"HP_CHANGE_SOURCE: \", damage_type, damager_id, player_id);\r\n\t\tif (data[2] <= -7 && damage_type.endsWith(\"_EFFECT\")) {\r\n\t\t\tCritSpellAnimation()\r\n\t\t}\r\n\t});\r\n\t\r\n\t/*\r\n\tplugin.events.on(\"updateMonster\", function(data) {\r\n\t\tconsole.log(\"updateMonster Data\", data);\r\n\t})*/\r\n\t\r\n\t\r\n\t\r\n}\n\n//# sourceURL=webpack:///./src/game.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"plugin\", function() { return plugin; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"settings\", function() { return settings; });\n\r\nif (typeof(window.underscript) === \"undefined\") {\r\n    if ((!window.localStorage.getItem(\"PrettyCardsAudio_DependencyErrorMessageShown\")) || (window.localStorage.getItem(\"PrettyCardsAudio_DependencyErrorMessageShown\") == \"false\")) {\r\n        var dialog = window.BootstrapDialog.show({\r\n                title: \"Oh no!\",\r\n                type: window.BootstrapDialog.TYPE_WARNING,\r\n                message: \"Looks like you don't have Underscript installed, or you deactivated it! In order for PrettyCards Audio to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.\",\r\n                buttons: [{\r\n                        label: \"Proceed\",\r\n                        cssClass: 'btn-primary',\r\n                        action: function (dialog) {\r\n                            dialog.close();\r\n                        }\r\n                    }\r\n                ]\r\n            });\r\n        window.localStorage.setItem(\"PrettyCardsAudio_DependencyErrorMessageShown\", true);\r\n    };\r\n} else {\r\n    window.localStorage.setItem(\"PrettyCardsAudio_DependencyErrorMessageShown\", false);\r\n}\r\n\r\nvar plugin = window.underscript.plugin(\"PrettyCards Audio\");\r\nwindow.PrettyCardsAudio_plugin = plugin;\r\n//var PrettyCards_plugin = underscript.plugin('<span class=\"RARE\">PrettyCards</span>');\r\n//console.log(\"Plugin: \", PrettyCards_plugin);\r\n\r\nvar default_value = 50\r\n\r\nvar settings = [];\r\nsettings.turn_start = plugin.settings().add({\r\n        'key': 'turn_start',\r\n        'name': 'Turn Start volume', // Name in settings page\r\n        'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value\r\n\t\t'reset': true,\r\n    });\r\n\r\nsettings.buff = plugin.settings().add({\r\n        'key': 'buff',\r\n        'name': 'Buff volume', // Name in settings page\r\n        'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value\r\n\t\t'reset': true,\r\n    });\r\n\t\r\nsettings.nerf = plugin.settings().add({\r\n        'key': 'nerf',\r\n        'name': 'Nerf/Debuff volume', // Name in settings page\r\n        'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value,\r\n\t\t'reset': true,\r\n    });\r\n\t\r\nsettings.paralyze = plugin.settings().add({\r\n        'key': 'paralyze',\r\n        'name': 'Paralyze volume', // Name in settings page\r\n        'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value\r\n\t\t'reset': true,\r\n    });\r\n\t\r\nsettings.kr = plugin.settings().add({\r\n        'key': 'kr',\r\n        'name': 'KR volume', // Name in settings page\r\n        'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value\r\n\t\t'reset': true,\r\n    });\r\n\t\r\nsettings.silence = plugin.settings().add({\r\n        'key': 'silence',\r\n        'name': 'Silence volume', // Name in settings page\r\n        'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value\r\n\t\t'reset': true,\r\n    });\r\n\r\nsettings.crit_spell_anim = plugin.settings().add({\r\n        'key': 'crit_spell_anim',\r\n        'name': 'Enable the \"Critical Spell\" animation.', // Name in settings page\r\n        //'note': 'By a \"Critical Spell\", I mean a spell or monster effect that deals 7 or more damage, similar to how attacks have this, too. Unfortunately, this doesn\\'t work properly 100% of the time because the server refuses to tell me what dealt the damage and so I have to do some magic guessing.',\r\n\t\t'type': 'boolean',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': true, // default value\r\n    });\r\n\r\nsettings.crit_spell = plugin.settings().add({\r\n        'key': 'crit_spell',\r\n        'name': 'Critical Spell volume', // Name in settings page\r\n        'note': 'By a \"Critical Spell\", I mean a spell or monster effect that deals 7 or more damage, similar to how attacks have this, too. Unfortunately, this doesn\\'t work properly 100% of the time because the server refuses to tell me what dealt the damage and so I have to do some magic guessing.',\r\n\t\t'type': 'slider',\r\n        'refresh': false, // true to add note \"Will require you to refresh the page\"\r\n        'default': default_value, // default value\r\n    });\r\n\r\n\r\n//console.log(settings);\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/underscript_checker.js?");

/***/ }),

/***/ "./src/wrap_with_event.js":
/*!********************************!*\
  !*** ./src/wrap_with_event.js ***!
  \********************************/
/*! exports provided: WrapWithEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WrapWithEvent\", function() { return WrapWithEvent; });\n/* harmony import */ var _src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /src/underscript_checker.js */ \"./src/underscript_checker.js\");\n\r\n\r\n\r\nfunction WrapWithEvent(func_name) {\r\n\tvar old_func = window[func_name];\r\n\twindow[func_name] = function() {\r\n\t\told_func.apply(null, arguments);\r\n\t\t_src_underscript_checker_js__WEBPACK_IMPORTED_MODULE_0__[\"plugin\"].events.emit(func_name, Array.from(arguments));\r\n\t}\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./src/wrap_with_event.js?");

/***/ })

/******/ });