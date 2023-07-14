import { PrettyCards_plugin, prettycards } from "./underscript_checker";


var container = document.createElement("DIV");
container.id = "PrettyCards_StyleContainer";

function loadCSS(css = "") {
    if (typeof(css) != "string") {
        css = css.toString();
    }
    var ele = document.createElement("STYLE");
    ele.innerHTML = css;
    container.appendChild(ele);
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", () => {
    window.document.head.appendChild(container);
})

prettycards.loadCSS = loadCSS;

export {loadCSS};