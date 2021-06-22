
import {NormalPackOpenAnimation} from "./../libraries/pack_open_animation_templates/normal.js";

function StartOpenPackAnimation(pack_data, open_data) {
	var pack_image = document.createElement("IMG");
	pack_image.className = "PrettyCards_AnimationPack";
	pack_image.src = pack_data.image;
	
	var viewportOffset = document.querySelector(".PrettyCards_PackCell[data-packid="+ pack_data.code_id +"] .PrettyCards_InvisiblePack").getBoundingClientRect();
	console.log("viewportOffset", viewportOffset);
	
	pack_image.style.top = (viewportOffset.top /*+ window.scrollY*/) + "px";
	pack_image.style.left = (viewportOffset.left /*+ window.scrollX*/) + "px";
	pack_image.style.width = viewportOffset.width + "px";
	
	document.getElementById("PrettyCards_PackOpenContent").appendChild(pack_image);
	
	NormalPackOpenAnimation.OnPackMoveBegin((window.innerWidth-viewportOffset.width)/2, (window.innerHeight-viewportOffset.height)/2);
}


export {StartOpenPackAnimation};