
import owoify from "owoify-js";
import { PrettyCards_plugin } from "../underscript_checker";

var regex = /\<[^\<^\>]*\>/gm

var levels = ["none", "owo", "uwu", "uvu"];
var level = 3;

if (level != 0) {
    PrettyCards_plugin.events.on("func:appendCard PC_appendCard", function(card, element) {
        var name = element.find(".cardName div")[0];
        var desc = element.find(".cardDesc div")[0];
        //console.log(name, desc);
        owofy_test(name);
        owofy_test(desc);
    })
}


function owofy_test(element) {
    for (var i=0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i];
        if (child.nodeType == 3) { // TEXT node
            var text = child.textContent;
            var leadingSpace = text[0] == ' ';
            var endingSpace = text[text.length-1] == ' ';
            console.log(text, leadingSpace, endingSpace);
            text = owoify(child.textContent, levels[level]);
            if (leadingSpace && text[0] != ' ') {
                text = " " + text;
            }
            if (endingSpace && text[text.length-1] != ' ') {
                text = text + " ";
            }
            child.textContent = text;
            console.log(text, text[0] == ' ', text[text.length-1] == ' ');
        } else { // Child Element
            owofy_test(child);
        }
    }
}