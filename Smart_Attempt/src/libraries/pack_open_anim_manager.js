
import {PrettyCards_plugin, settings} from "./underscript_checker.js";
import {NormalPackOpenAnimation} from "./../libraries/pack_open_animation_templates/normal.js";
import {OnuPackOpenAnimation} from "./../libraries/pack_open_animation_templates/onu.js";

PrettyCards_plugin.events.on('openedPacks', function (open_data) {
	StartOpenPackAnimation(window.PrettyCards_pack_being_opened, open_data.cards);
	this.canceled = true;
});

var currAnim = NormalPackOpenAnimation;
var anims = [NormalPackOpenAnimation, OnuPackOpenAnimation];

var settingsoptions = [];
var settingsnote = "Select the pack opening animation!";

for (var i=0; i < anims.length; i++) {
	settingsoptions[i] = anims[i].displayName;
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

settings.packs_animation_template = PrettyCards_plugin.settings().add({
	'key': 'packs_animation_template', // key
	'name': 'Pack Opening Animation', // Name in settings page
	'type': 'select',
	'note': settingsnote, // Show note when hovering over setting
	'refresh': true, // true to add note "Will require you to refresh the page"
	//'disabled': boolean or `function(): boolean`, // true to disable setting
	'default': settingsoptions[0], // default value
	'options': settingsoptions, // Options for type 'select'
	'reset': true, // Adds a reset button (sets to default)
	'onChange': ChangeTemplate, // called when value is changed
});

ChangeTemplate(settings.packs_animation_template.value() || settingsoptions[0], null);

function StartOpenPackAnimation(pack_data, open_data) {
	var pack_image = document.createElement("IMG");
	pack_image.className = "PrettyCards_AnimationPack";
	pack_image.src = pack_data.image;
	
	console.log(open_data);
	console.log(JSON.stringify(open_data));
	
	var viewportOffset = document.querySelector(".PrettyCards_PackCell[data-packid="+ pack_data.code_id +"] .PrettyCards_InvisiblePack").getBoundingClientRect();
	console.log("viewportOffset", viewportOffset);
	
	pack_image.style.top = (viewportOffset.top /*+ window.scrollY*/) + "px";
	pack_image.style.left = (viewportOffset.left /*+ window.scrollX*/) + "px";
	pack_image.style.width = viewportOffset.width + "px";
	
	document.getElementById("PrettyCards_PackOpenContent").appendChild(pack_image);
	
	currAnim.OnPackMoveBegin((window.innerWidth-viewportOffset.width)/2, (window.innerHeight-viewportOffset.height)/2, pack_data, open_data);
}


export {StartOpenPackAnimation};