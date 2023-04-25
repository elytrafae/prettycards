import { PrettyCards_plugin, settings , addSetting } from "../underscript_checker";
import { utility } from "../utility";

addSetting({
	'key': 'switch_highlight',
	'name': 'Switch Highlight', // Name in settings page
	'note': 'Adds some handy highlighting to Switch cards while they are being hovered over the arena mid-game.',
	'type': 'boolean',
	'refresh': true, // true to add note "Will require you to refresh the page"
	'disabled': false,
	'default': true, // default value
    'category': "card"
});

function isElementSwitchCard(ele) {
    if (ele.hasClass("PrettyCards_SwitchHighlight_Cyan")) {
        return true;
    }
    if (ele.hasClass("PrettyCards_SwitchHighlight_Red")) {
        return true;
    }
    return ele.find(".PrettyCards_SwitchHighlight_Cyan").length > 0 || ele.find(".PrettyCards_SwitchHighlight_Red").length > 0;
}

function doYouHaveEndgame() {
    var art = $(`#yourArtifacts img[artifactid="47"]`);
    return art.length > 0;
}

function isCardElementAPiece(ele) {
    var tribe = ele.find(`.cardTribes img[src="images/tribes/PIECE.png"]`);
    return tribe.length > 0;
}

var didAlreadyUpdateThisFrame = false;
function onUpdate() {
    didAlreadyUpdateThisFrame = false;
    window.requestAnimationFrame(onUpdate);
}
window.requestAnimationFrame(onUpdate);

function setSwitchAreaAndCard(ele, state = 0) {
    $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Cyan");
    $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Red");
    var descDiv = ele.find(".cardDesc > div");
    var id = ele.attr("fixedId");
    if (state == 1) {
        $("#yourSide").addClass("PrettyCards_SwitchHighlight_SwitchBoard_Cyan");
        descDiv.html($.i18n(`card-${id}-cyan`));
    } else if (state == 2) {
        $("#yourSide").addClass("PrettyCards_SwitchHighlight_SwitchBoard_Red");
        descDiv.html($.i18n(`card-${id}-red`));
    } else if (state == 3) {
        $("#yourSide").addClass("PrettyCards_SwitchHighlight_EndgameBoard");
        descDiv.html($.i18n(`card-${id}-both`));
    } else {
        descDiv.html($.i18n(`card-${id}`));
    }
    if (state != 3) {
        $("#yourSide").removeClass("PrettyCards_SwitchHighlight_EndgameBoard"); // Added this separately because of the animations!
    }
}

function gameSetup() {
    var oldMakeDraggable = window.makeDraggable;
    window.makeDraggable = function() {
        oldMakeDraggable();
        if (window.userId !== window.userTurn || window.spectate) {return;}
        $("#handCards .canPlay").each(function(i, e) {
            const $e = $(e);
            $e.on("dragstart", function() {
                if (!isElementSwitchCard($e)) {return;}
                $("#yourSide").addClass("PrettyCards_SwitchHighlight_SwitchBoard");
                if (doYouHaveEndgame() && isCardElementAPiece($e)) {
                    setSwitchAreaAndCard($e, 3);
                }
            });
            $e.on("dragstop", function() {
                $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard");
                setSwitchAreaAndCard($e, 0);
            });
            window.enableDraggable();
        })
    }

    var oldUpdateDroppables = window.updateDroppables;
    window.updateDroppables = function($card) {
        oldUpdateDroppables($card);
        if ($card.hasClass('canPlay')) {
            if ($card.hasClass('monster')) {

                var selectoredCard = $('.droppableMonster:not(:has(.monster))');

                selectoredCard.on("dropout", function( event, ui ) { // I hate how this reminded me of my childhood . . .
                    var $card = ui.draggable;
                    if (didAlreadyUpdateThisFrame) {return;}
                    if (!isElementSwitchCard($card)) {return;}
                    if (doYouHaveEndgame() && isCardElementAPiece($card)) {
                        setSwitchAreaAndCard($card, 3);
                    } else {
                        setSwitchAreaAndCard($card, 0);
                    }
                    //console.log("DROPOUT", event, ui);
                });

                selectoredCard.on( "dropover", function( event, ui ) {
                    var $card = ui.draggable;
                    if (!isElementSwitchCard($card)) {return;}
                    var position = Number(event.target.getAttribute("x"));
                    if (isNaN(position)) {return;}
                    if (doYouHaveEndgame() && isCardElementAPiece($card)) {
                        setSwitchAreaAndCard($card, 3);
                     } else {
                        setSwitchAreaAndCard($card, (position < 2) ? 1 : 2);
                    }
                    didAlreadyUpdateThisFrame = true;
                });

                selectoredCard.on("drop", function(event, ui) {
                    var $card = ui.draggable;
                    $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard");
                    setSwitchAreaAndCard($card, 0);
                });
            }
            // So far, there are no Switch Spells. I'll worry about this later.
        }
    }

    PrettyCards_plugin.events.on("func:appendCard", function(card, element) {
        var id = card.fixedId || card.id;
        //console.log("ASSIGN FIXED ID", card, id);
        element.attr("fixedId", id);
    })

}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("SwitchHighlight");
    if (underscript.onPage("Game") && settings.switch_highlight.value()) {
        gameSetup();
    }
})