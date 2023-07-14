
// I REALLY need to make this more flexible!

import {PrettyCards_plugin, settings, prettycards, addSetting} from "/src/libraries/underscript_checker.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";
import {utility} from "/src/libraries/utility.js";

import { loadCSS } from "../../libraries/css_loader";
import css from "../../css/MobileSidebar.css";
loadCSS(css);

ExecuteWhen("translation:loaded", function () {
	var $ = window.$;
});

var menu_data_nologin = {
	"pc-navbar-home" : "/",
	"header-sign-in" : "SignIn",
	"header-register" : "SignUp"
}

var menu_data = {
	"pc-navbar-home" : "/",
	"header-play" : "Play",
	"header-cards" : {
		"header-decks" : "Decks",
		"header-crafting" : "Crafting",
		"header-friendship" : "Friendship",
		"header-hub" : "Hub"
	},
	"header-shops" : {
		"header-packs ({packs})" : "Packs",
		"header-artifacts": "Artifacts",
		"header-card-skins": "CardSkinsShop",
		"header-your-shop": '/CardSkinsShop?&discount',
		"header-cosmetics": "CosmeticsShop",
		"item-ucp": "Shop"
	},
	"{quests}" : "Quests"
}

var user_menu_data = {
	"header-profile" : "Profile",
	"header-history" : "History",
	"header-avatars" : "Avatars",
	"header-card-skins" : "CardSkins",
	"header-profile-skins" : "ProfileSkins",
	"header-frame-skins" : "FrameSkins",
	"header-settings" : "Settings",
	"pc-navbar-pcsettings": "js:prettycards.openSettings()",
	"header-translate" : "Translate",
	"pc-navbar-dc" : "Disconnect"
}

var footer_data = {
	'{friends}' : "Friends",
	'<span class="glyphicon glyphicon-comment blue"></span>' : "js:openChatsList()",
	'<img src="/images/leaderboard.png">' : "/leaderboard.jsp",
	'<img src="/images/friendship.png">' : "/friendshipLeaderboard.jsp",
	'<img src="/images/social/discord.png">' : "https://discord.gg/wVmCQk6",
	'<img src="/images/social/twitter.png">' : "https://twitter.com/undercardsgame",
	'<img src="/images/social/facebook.png">' : "https://www.facebook.com/undercards",
	'<img src="/images/social/reddit.png">' : "https://www.reddit.com/r/UnderCards",
	'<img src="/images/social/wiki.png">' : "http://undercards.wikia.com/",
	'<img src="./images/cardBacks/BASECardDETERMINATION.png">' : "https://undercard.feildmaster.com"
}

var footer_about_data = {
	'footer-about' : {
		'footer-staff' : "Staff",
		'footer-legal' : "legal.jsp",
		'<img alt="mail" src="/images/social/gmail.png"> footer-mail' : "mailto:undercardsgame@gmail.com"
	}
}

addSetting({
	'key': 'mobile_mode',
	'name': 'Mobile Mode', // Name in settings page
	'note': 'Experimental feature to make the game more mobile-friendly.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'hidden' : true,
	'default': () => window.mobile, // default value
});

function SetMobileView() {
	$("nav").css("display", "none");
	$("footer").addClass("PrettyCards_Hidden");
	//$(".mainContent").css("width", "100%");
	
	var temp = $('header').contents();
	//console.log(temp);
	$("header").html(`<div class="PrettyCards_HeaderFlex"><div id="PrettyCards_HeaderLeft"></div><div id="PrettyCards_HeaderMid"></div><div id="PrettyCards_HeaderRight"></div></div>`);
	$("#PrettyCards_HeaderMid").append(temp);
	
	var menu_button = $('<button class="btn btn-outline-secondary PrettyCards_Mobile_HeaderButton"><i class="glyphicon glyphicon-menu-hamburger"></i></button>');
	menu_button.click(function() {
		$("#PrettyCards_Mobile_NavBar").toggleClass("PrettyCards_Hidden");
		$("#PrettyCards_Mobile_NavBarBG").toggleClass("PrettyCards_Hidden");
	});
	$("#PrettyCards_HeaderLeft").prepend(menu_button);
	
	var menu_bg = $('<div id="PrettyCards_Mobile_NavBarBG" class="PrettyCards_Hidden"></div>');
	menu_bg.click(function() {
		$("#PrettyCards_Mobile_NavBarBG").addClass("PrettyCards_Hidden");
		$("#PrettyCards_Mobile_NavBar").addClass("PrettyCards_Hidden");
	});
	$("body").append(menu_bg);
}

function AddToggleFunctionTo(parent, child) {
	parent.click(function() {
		child.toggleClass("PrettyCards_Hidden");
	})
}

function ProcessName(name) {
	var a = name.split(" ");
	for (var i=0; i < a.length; i++) {
		a[i] = $.i18n(a[i]);
	}
	var b = a.join(" ");
	b = b.replace("{packs}", packs);
	b = b.replace("{quests}", quests);
	b = b.replace("{friends}", friends);
	return b;
}

function ProcessLink(link) {
	var isfunc = false;
	if (typeof(link) == "string") {
		isfunc = link.startsWith("js:");
		link = link.replace("js:", "");
	}
	return {link, isfunc};
}

function CreateSideBarPortion(obj, bg_color = "#000000", inline = false) {
	var container = $("<div></div>");
	container.css("background-color", bg_color);
	var class_name = "PrettyCards_NavBarItem";
	if (inline) {
		class_name += " PrettyCards_NavBarInline"
	}
	for (var name in obj) {
		var {link, isfunc} = ProcessLink(obj[name]);
		var line;
		var actual_name = ProcessName(name);
		if (actual_name.length > 0) {
			if (typeof(link) == "string") {
				var txt = '<a href="' + link + '">' + actual_name + '</a>';
				if (isfunc) {
					txt = '<span onclick="' + link + '">' + actual_name + '</span>';
				}
				line = $('<div class="' + class_name + '">' + txt + '</div>');
			} else {
				line = $('<div class="' + class_name + '"><span>' + actual_name + '</span></div>');
				var cont = CreateSideBarPortion(link);
				cont.addClass("PrettyCards_Hidden");
				AddToggleFunctionTo(line.find("span"), cont);
				line.append(cont);
			}
			container.append(line);
		}
	}
	return container;
}

var packs;
var quests;
var friends;

function CreateSideNavMenu() {
	friends = window.selfId ? '<span class="glyphicon glyphicon-user green"></span>' : "";
	
	$("#PrettyCards_Mobile_NavBar").remove();
	var menu_obj = $('<div id="PrettyCards_Mobile_NavBar" class="PrettyCards_Hidden"></div>');
	menu_obj.append(CreateSideBarPortion(window.selfId ? menu_data : menu_data_nologin));
	$("body").append(menu_obj);
	
	if (window.selfId) {
		var user_menu = CreateSideBarPortion(user_menu_data, "#333333");
		user_menu.addClass("PrettyCards_Hidden");
		menu_obj.prepend(user_menu);
		
		var avatar = $("nav .avatar")[0];
		var gold = $("#golds").text();
		var ucp = $("#ucp").text();
		//console.log("AVATAR", avatar);
		var user_part = $(`<div>DATA_PULL_ERROR</div>`);
		if (avatar && gold && ucp) {
			user_part = $(`
			<table class="PrettyCards_NavBarProfile">
				<tr>
					<td rowspan="2"><img class="${avatar.className}" src="${avatar.src}"></td>
					<td>${selfUsername}</td>
				</tr>
				<tr>
					<td>(<span class="yellow">${gold}</span> <img src="images/icons/gold.png" class="height-32"> / <span class="ucp">${ucp}</span> ${$.i18n("item-ucp")})</td>
				</tr>
			</table>
		`);
		}
		
		user_part.click(function() {
			user_menu.toggleClass("PrettyCards_Hidden");
		})
		menu_obj.prepend(user_part);
	}
	
	menu_obj.append('<div class="PrettyCards_Divider"></div>');
	menu_obj.append(CreateSideBarPortion(footer_data, "#000000", true));
	menu_obj.append(CreateSideBarPortion(footer_about_data));
	menu_obj.append('<div class="PrettyCards_NavBarCopyright">Undercards © 2021<br>' + $.i18n("footer-copyright") + '</div>');
}

prettycards.openSettings = function() {
	PrettyCards_plugin.settings().open();
}

if (!underscript.onPage("Game") && settings.mobile_mode.value()) {
	ExecuteWhen("PrettyCards:onPageLoad PrettyCards:TranslationExtReady", function() {
		packs = $(".nbPacksHeader").text();
		quests = $("a[href=Quests]").text();
		SetMobileView();
		CreateSideNavMenu();
		ExecuteWhen("Chat:Connected", function () {
			CreateSideNavMenu();
		});
	})
}

