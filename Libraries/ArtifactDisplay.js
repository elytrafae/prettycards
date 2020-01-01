
GM_addStyle(".PrettyCards_ArtifactHover {background-color: black; border: white solid 4px; width: 25em; text-align: justify;}");
GM_addStyle(".PrettyCards_ArtifactHover_Desc {color: white; padding: 0.3em;}");
GM_addStyle(".PrettyCards_ArtifactHover_Name {text-align: center; font-size: 2em; margin-bottom: 0;}");
GM_addStyle(".PrettyCards_ArtifactHover_Rarity {text-align: center; font-size: 1.2em;}");
GM_addStyle(".PrettyCards_ArtifactHover_Artifact {position: absolute; transform: translate(-50%, -50%); top: 0em; left: 0em;}");
GM_addStyle(".PrettyCards_ArtifactHover_ClickMe {color:white}");
GM_addStyle(".PrettyCards_Artifact {width: 4em}");
GM_addStyle(".PrettyCards_ArtifactContainer {width: 4em}");

function AppendArtifactTooltip(div, src, side, moreText) {
	var art_id = div.getAttribute("artifactid");
	var name_key = $.i18n('artifact-name-' + art_id);
	var desc_key = $.i18n('artifact-' + art_id);
	var image = src;
	var legendary = div.getAttribute("legendary");

	var html =	'<div class="PrettyCards_ArtifactHover">'+
					'<img class="PrettyCards_ArtifactHover_Artifact PrettyCards_Artifact" src="' + image + '">'+
					'<p class="PrettyCards_ArtifactHover_Name '+ (legendary === 'true' ? 'yellow' : '') +'" data-i18n="[html]'+ name_key +'" ></p>'+
                    '<p class="PrettyCards_ArtifactHover_Rarity '+ (legendary === 'true' ? 'yellow' : '') +'" data-i18n="[html]'+ (legendary === 'true' ? "artifacts-legendary" : "artifacts-normal") +'" ></p>'+
					'<p class="PrettyCards_ArtifactHover_Desc" data-i18n="[html]'+ desc_key +'" ></p>'+
					'<p class="PrettyCards_ArtifactHover_ClickMe">' + ((moreText === undefined || moreText === null) ? '(Click for more info)' : moreText) + '</p>'+
				'</div>';
	AddTooltip(div, html, side || 4);
}

function CreateArtifactImage(name, src, is_legend, art_id) {
    var div = document.createElement("DIV");
    div.className = "PrettyCards_ArtifactContainer";
	var img = document.createElement("IMG");
	img.src = "images/artifacts/" + src + ".png";
	img.className = "PrettyCards_Artifact";
	div.setAttribute("legendary", is_legend || false);
	div.setAttribute("name", name);
	div.setAttribute("artifactid", art_id);
	AppendArtifactTooltip(div, img.src, 1, "")
    div.appendChild(img);
	return div
}

document.body.appendChild(CreateArtifactImage("Draw", "Draw", false, 2))