import { PrettyCards_plugin, settings } from "./underscript_checker";
import { utility } from "./utility";

/*
settings.persona_overlay = PrettyCards_plugin.settings().add({
	'key': 'persona_overlay',
	'name': 'Persona Overlay', // Name in settings page
	'note': "Just . . . Play a LEGENDARY or DT card to see it.<br>Warning: Looks way worse than in my head!",
	'type': 'boolean',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'default': false, // default value
});
*/

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    utility.loadCSSFromGH("PersonaOverlay");
})

function Linearizer(sin) {
    if (sin > Math.PI/2) {
        return 2-Math.sin(sin);
    }
    return Math.sin(sin);
}

PrettyCards_plugin.events.on("getMonsterPlayed", function(data) {
    return; // Temporarily Removed Feature
    if (!settings.persona_overlay.value()) {return;}
    var card = JSON.parse(data.card);
    // console.log("PLAYED: ", card);
    if (card.rarity == "LEGENDARY" || card.rarity == "DETERMINATION") {
        CreateOverlay(card, null);
    }
})

function CreateOverlay(card, side) {
    var border = $('<div class="PrettyCards_PersonaBorder"></div>');
    var back = $('<div class="PrettyCards_PersonaBack"></div>');
    border.append(back);
    var image = $(`<img src="images/cards/${card.image}.png" class="PrettyCards_PersonaImage">`);
    back.append(image);

    const start = 200;
    const finish = -100;
    const duration = 3000;

    image.css("left", "200%");
    image.animate({"step": duration.toString()}, {
        duration: duration,
        easing: "linear",
        step : function(now, tween) {
            console.log(now, tween);
            var val = (start + Linearizer(now/duration*Math.PI)/2*(finish-start) );
            console.log(val, Math.sin(now/duration*Math.PI));
            image.css("left", val + "%" );
        },
        complete: function() {
            border.remove();
        }
    });

    $("body").append(border);
}

window.prettycards.createPersonaOverlay = CreateOverlay;