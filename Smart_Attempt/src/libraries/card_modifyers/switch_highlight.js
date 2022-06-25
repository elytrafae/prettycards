import { PrettyCards_plugin } from "../underscript_checker";
import { utility } from "../utility";

function isElementSwitchCard(ele) {
    if (ele.hasClass("PrettyCards_SwitchHighlight_Cyan")) {
        return true;
    }
    if (ele.hasClass("PrettyCards_SwitchHighlight_Red")) {
        return true;
    }
    return ele.find(".PrettyCards_SwitchHighlight_Cyan").length > 0 || ele.find(".PrettyCards_SwitchHighlight_Red").length > 0;
}

function gameSetup() {
    console.log("GAME SETUP!");
    var oldMakeDraggable = window.makeDraggable;
    window.makeDraggable = function() {
        oldMakeDraggable();
        if (window.userId !== window.userTurn || window.spectate) {return;}
        $("#handCards .canPlay").each(function(i, e) {
            const $e = $(e);
            $e.on("dragstart", function() {
                if (!isElementSwitchCard($e)) {return;}
                $("#yourSide").addClass("PrettyCards_SwitchHighlight_SwitchBoard");
            });
            $e.on("dragstop", function() {
                $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard");
                $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Cyan");
                $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Red");
            });
            window.enableDraggable();
        })

        var oldUpdateDroppables = window.updateDroppables;
        window.updateDroppables = function($card) {
            oldUpdateDroppables($card);
            if ($card.hasClass('canPlay')) {
                if ($card.hasClass('monster')) { //&& $card.find(".PrettyCards_SwitchLeft").length > 0) { // Check disabled for testing purposes.
                    $('.droppableMonster:not(:has(.monster))').on( "dropover", function( event, ui ) {
                        var $card = ui.draggable;
                        if (!isElementSwitchCard($card)) {return;}
                        var position = event.target.getAttribute("x");
                        console.log("DROPOVER", $card, position);
                        if (position < 2) {
                            $("#yourSide").addClass("PrettyCards_SwitchHighlight_SwitchBoard_Cyan");
                            $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Red");
                        } else {
                            $("#yourSide").addClass("PrettyCards_SwitchHighlight_SwitchBoard_Red");
                            $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Cyan");
                        }
                    });

                    $('.droppableMonster:not(:has(.monster))').on("dropout", function( event, ui ) { // I hate how this reminded me of my childhood . . .
                        $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Red");
                        $("#yourSide").removeClass("PrettyCards_SwitchHighlight_SwitchBoard_Cyan");
                        console.log("DROPOUT", event, ui);
                    });
                }
                // So far, there are no Switch Spells. I'll worry about this later.
            }
        }
    }
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("SwitchHighlight");
    if (underscript.onPage("Game")) {
        gameSetup();
    }
})