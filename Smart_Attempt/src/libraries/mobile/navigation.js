
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import {ExecuteWhen} from "/src/libraries/pre_load/event_ensure.js";

var $ = window.$;

var menu_data_nologin = {
	"Home" : "/",
	"header-sign-in" : "SignIn",
	"header-register" : "SignUp"
}

var menu_data = {
	"Home" : "/",
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
		"header-cosmetics": "CosmeticsShop",
		"item-ucp": "Shop"
	},
	"{quests}" : "Quests",
	"Disconnect" : "Disconnect"
}

$("head").append(`<style>

	.PrettyCards_Mobile_HeaderButton {
		font-size: 30px;
		padding: 5px;
		height: 50px;
		width: 50px;
		color: black;
	}
	
	.PrettyCards_HeaderFlex {
		display: flex;
	}
	
	#PrettyCards_HeaderMid {
		width: 100%;
	}
	
	#PrettyCards_Mobile_NavBar {
		background-color: black;
		border: 3px solid white;
		position: fixed;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		overflow-y: auto;
		z-index: 100;
	}
	
	.PrettyCards_NavBarItem {
		font-size: 40px;
		margin-left: 20px;
	}
	
	.PrettyCards_NavBarItem a {
		color: white;
	}
	
	.PrettyCards_Hidden {
		display: none;
	}
	
	#PrettyCards_Mobile_NavBarBG {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
		opacity: 0.5;
		background-color: black;
	}
	
	.PrettyCards_NavBarProfile {
		font-size: 25px;
		margin: 5px;
	}
	
	.PrettyCards_NavBarProfile td {
		padding: 0px 5px;
	}
	
	
</style>`);

settings.mobile_mode = PrettyCards_plugin.settings().add({
	'key': 'mobile_mode',
	'name': 'Mobile Mode', // Name in settings page
	'note': 'Experimental feature to make the game more mobile-friendly.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': () => window.mobile, // default value
});

function SetMobileView() {
	$("nav").css("display", "none");
	$("nav").css("display", "none");
	//$(".mainContent").css("width", "100%");
	
	var temp = $('header').contents();
	console.log(temp);
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
	return b;
}

function CreateSideBarPortion(obj) {
	var container = $("<div></div>");
	for (var name in obj) {
		var link = obj[name];
		var line;
		var actual_name = ProcessName(name);
		if (typeof(link) == "string") {
			line = $('<div class="PrettyCards_NavBarItem"><a href="' + link + '">' + actual_name + '</a></div>');
		} else {
			line = $('<div class="PrettyCards_NavBarItem"><a href="#">' + actual_name + '</a></div>');
			var cont = CreateSideBarPortion(link);
			cont.addClass("PrettyCards_Hidden");
			AddToggleFunctionTo(line.find("a"), cont);
			line.append(cont);
		}
		container.append(line);
	}
	return container;
}

var packs;
var quests;

function CreateSideNavMenu() {
	$("#PrettyCards_Mobile_NavBar").remove();
	var menu_obj = $('<div id="PrettyCards_Mobile_NavBar" class="PrettyCards_Hidden"></div>');
	menu_obj.append(CreateSideBarPortion(window.selfId ? menu_data : menu_data_nologin));
	$("body").append(menu_obj);
	
	if (window.selfId) {
		var avatar = $("nav .avatar")[0];
		var gold = $("#golds").text();
		var ucp = $("#ucp").text();
		console.log("AVATAR", avatar);
		var user_part = $(`
			<table class="PrettyCards_NavBarProfile">
				<tr>
					<td rowspan="2"><img class="${avatar.className}" src="${avatar.src}"></td>
					<td>${selfUsername}</td>
				</tr>
				<tr>
					<td>( <span class="yellow">${gold}</span> <img src="images/icons/gold.png" class="height-32"> / <span class="ucp">${ucp}</span> ${$.i18n("item-ucp")} )</td>
				</tr>
			</table>
		`);
		menu_obj.prepend(user_part);
	}
}

if (!underscript.onPage("Game") && settings.mobile_mode.value()) {
	ExecuteWhen("translation:loaded", function () {
		packs = $(".nbPacksHeader").text();
		quests = $("a[href=Quests]").text();
		SetMobileView();
		CreateSideNavMenu();
		ExecuteWhen("Chat:Connected", function () {
			CreateSideNavMenu();
		});
	});
}