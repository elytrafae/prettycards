
import {PrettyCards_plugin, settings} from "./underscript_checker.js";
import {NormalPackOpenAnimation} from "./../libraries/pack_open_animation_templates/normal.js";

PrettyCards_plugin.events.on('openedPacks', function (open_data) {
	StartOpenPackAnimation(window.PrettyCards_pack_being_opened, open_data.cards);
	this.canceled = true;
});

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
	
	NormalPackOpenAnimation.OnPackMoveBegin((window.innerWidth-viewportOffset.width)/2, (window.innerHeight-viewportOffset.height)/2, pack_data, open_data);
}


export {StartOpenPackAnimation};