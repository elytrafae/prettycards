import { addSetting, PrettyCards_plugin, settings } from "./underscript_checker";


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

function AskRemoval() {
    BootstrapDialog.show({
        title: window.$.i18n("pc-footerremove-ask-title"),
        message: window.$.i18n("pc-footerremove-ask"),
        buttons: [{
            label: $.i18n('pc-navigate-nevermind'),
            cssClass: 'btn-danger',
            action: function (dialog) {
                dialog.close();
            }
        },{
            label: $.i18n('pc-navigate-yes'),
            cssClass: 'btn-primary',
            action: function (dialog) {
                settings.remove_footer.set(true);
                dialog.close();
            }
        }]
    });
}

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
    li.style = "border-left: 1px solid white;"

    var a = document.createElement("A");
    a.style = "padding: 8px 10px 10px 10px;";

    var span = document.createElement("SPAN");
    span.style.fontSize = "18px";
    span.className = "glyphicon glyphicon-chevron-down white";
    
    a.appendChild(span);
    li.appendChild(a);

    a.onclick = AskRemoval;

    navbarRight.appendChild(li);

    PrettyCards_plugin.events.on("PrettyCards:TranslationExtReady", function() {
        window.tippy(a, {
            content: window.$.i18n("pc-footerremove-hover"),
            arrow: true,
            inertia: true,
            placement: "auto",
            appendTo: window.document.body,
            boundary: 'window',
            getReferenceClientRect: window.document.body.getBoundingClientRect
        });
    })
}

AddRemoveFooterButton();