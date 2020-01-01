
function AppendArtifactTooltip(img, side, moreText) {
	var art_id = img.getAttribute("artifactid");
	var name = $.i18n('artifact-name-' + art_id);
	var desc = $.i18n('artifact-' + artifactId);
	var image = img.src;
	var legendary = img.getAttribute("legendary");

	var html =	'<div class="PrettyCards_ArtifactHover">'+
					'<img class="PrettyCards_ArtifactHover_Artifact PrettyCards_Artifact" src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + soul + '.png">'+
					'<p class="PrettyCards_ArtifactHover_Name '+ (legendary === 'true' ? 'yellow' : '') +'" >' + name + '</p>'+
					'<p class="PrettyCards_ArtifactHover_Desc">'+ desc + '</p>'+
					'<p class="PrettyCards_ArtifactHover_ClickMe">' + (moreText || '(Click for more info)') + '</p>'+
				'</div>';
	AddTooltip(img, html, side || 4);
}

function CreateArtifactImage(name, src, is_legend, art_id) {
	var img = document.createElement("IMG");
	img.src = "images/artifacts/" + src + ".png";
	img.className = "PrettyCards_Artifact";
	img.addAttribute("legendary", is_legend || false);
	img.addAttribute("name", name);
	img.addAttribute("artifactid", art_id);
	AppendArtifactTooltip(img, 1, "")
	return img
}