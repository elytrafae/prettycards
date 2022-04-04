
import {utility} from "/src/libraries/utility.js";

/*
// Imgur API Stuff.
// Yes, that's my Client ID in the Authorization part. It is required even when I just want to get a freaking image, which anyone can do, sooooo . . .
$.ajax({
	type: "GET",
	url: "https://api.imgur.com/3/album/OoSvaev",
	dataType: 'json',
	headers: {
		"Authorization": "Client-ID fafbe26e15c0a6b"
	},
	data: '',
	success: function (data){
	console.log(data); 
	}
});
*/

import { prettycards, PrettyCards_plugin } from "../underscript_checker";

/*
//  data format: {
//      original_url: "",
//      items: [
//          {url: "", type: "img/png"}
//      ]
//  }
*/
prettycards.displayMediaGallery = function(data) {
	var container = $(`
		<div id="PrettyCards_Media_Content">
			<div id="PrettyCards_Media_ContentTopRow">
				<div></div>
				<div id="PrettyCards_Media_ItemDisplay"></div>
				<div></div>
			</div>
			<div id="PrettyCards_Media_ContentBottomRow"></div>
		</div>
	`);
	$("body").append(container);
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
	utility.loadCSSFromGH("EmbedMedia");
})