import { addSetting, settings } from "./underscript_checker";


function RemoveFooter() {
	window.$("footer").css("display", settings.remove_footer.value() ? "none" : "block");
}

addSetting({
	'key': 'remove_footer',
	'name': 'Remove Footer', // Name in settings page
	'note': "Sayonara, ugly!",
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'default': false, // default value
	'onChange' : RemoveFooter
});

RemoveFooter();

function AddRemoveFooterButton() {
    var footer = window.$("footer");
    if (footer.length == 0) {
        return;
    }
    var navbarRight = footer[0].querySelector(".navbar-right");
    if (!navbarRight) {
        return;
    }

    var li = document.createElement("LI");

    var a = document.createElement("A");

    var span = document.createElement("SPAN");
    span.style.fontSize = "18px";
    span.className = "glyphicon glyphicon-chevron-down white";
    
    a.appendChild(span);
    li.appendChild(a);

    navbarRight.appendChild(li);
}

AddRemoveFooterButton();