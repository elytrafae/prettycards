import { PrettyCards_plugin } from "./underscript_checker";
import { utility } from "./utility";


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
    var card = JSON.parse(data.card);
    console.log("PLAYED: ", card);
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