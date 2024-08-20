
import {PrettyCards_plugin, settings, addSetting, prettycards} from "./underscript_checker.js";
import {NormalPackOpenAnimation} from "./../libraries/pack_open_animation_templates/normal.js";
import {OnuPackOpenAnimation} from "./../libraries/pack_open_animation_templates/onu.js";
import {InitPacks, GetPageTemplateByName, settingsoptions} from "/src/page_specific/packs.js";
import { utility } from "./utility.js";

PrettyCards_plugin.events.on('openedPacks', function (open_data) {
	console.log(open_data, window.PrettyCards_pack_being_opened);
	window.PrettyCards_pack_being_opened.amount -= open_data.count;
	GetPageTemplateByName(settings.packs_page_template.value() || settingsoptions[0]).updatePackCount(window.PrettyCards_pack_being_opened.code_id);
	StartOpenPackAnimation(window.PrettyCards_pack_being_opened, open_data.cards);
	this.canceled = true;
});

var currAnim = NormalPackOpenAnimation;
var anims = [NormalPackOpenAnimation, OnuPackOpenAnimation];

var animsettingsoptions = [];
var settingsnote = "Select the pack opening animation!";

for (var i=0; i < anims.length; i++) {
	animsettingsoptions[i] = anims[i].displayName;
	settingsnote += ("<br>" + anims[i].displayName + ": " + anims[i].description);
}

function GetAnimByName(name) {
	for (var i=0; i < anims.length; i++) {
		if (anims[i].displayName == name) {
			return anims[i];
		}
	}
	console.error("Cannot find Pack Open Animation Template with name ", name);
	return null;
}

function ChangeTemplate(newname, oldname) {
	currAnim = GetAnimByName(newname);
}

addSetting({
	'key': 'packs_animation_template', // key
	'name': 'Pack Opening Animation', // Name in settings page
	'type': 'select',
	'note': settingsnote, // Show note when hovering over setting
	'refresh': true, // true to add note "Will require you to refresh the page"
	//'disabled': boolean or `function(): boolean`, // true to disable setting
	'default': animsettingsoptions[0], // default value
	'options': animsettingsoptions, // Options for type 'select'
	'refresh': false,
	'reset': true, // Adds a reset button (sets to default)
	'onChange': ChangeTemplate, // called when value is changed
	'category': "packs"
});

ChangeTemplate(settings.packs_animation_template.value() || animsettingsoptions[0], null);

function StartOpenPackAnimation(pack_data, open_data) {
	var pack_image = document.createElement("IMG");
	pack_image.className = "PrettyCards_AnimationPack";
	pack_image.src = utility.asset("img/Packs/" + pack_data.image);
	
	//console.log(open_data);
	//console.log(JSON.stringify(open_data));
	
	var viewportOffset = document.querySelector(".PrettyCards_PackCell[data-packid="+ pack_data.code_id +"] .PrettyCards_InvisiblePack").getBoundingClientRect();
	//console.log("viewportOffset", viewportOffset);
	
	pack_image.style.top = (viewportOffset.top /*+ window.scrollY*/) + "px";
	pack_image.style.left = (viewportOffset.left /*+ window.scrollX*/) + "px";
	pack_image.style.width = viewportOffset.width + "px";
	
	document.getElementById("PrettyCards_PackOpenContent").appendChild(pack_image);
	
	currAnim.OnPackMoveBegin((window.innerWidth-viewportOffset.width)/2, (window.innerHeight-viewportOffset.height)/2, pack_data, open_data);
}


export {StartOpenPackAnimation};