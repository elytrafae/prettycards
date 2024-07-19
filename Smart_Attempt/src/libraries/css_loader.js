import { PrettyCards_plugin, prettycards, settings } from "./underscript_checker";

var container = document.createElement("DIV");
container.id = "PrettyCards_StyleContainer";

function loadCSS(css = "") {
    if (typeof(css) != "string") {
        css = css.toString();
    }
    var ele = document.createElement("STYLE");
    ele.innerHTML = parseCSS(css);
    container.appendChild(ele);
}

function parseCSS(/** @type {string} */text) {
    return text.replace(/\$asset\$/gm, settings.asset_directory.value());
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", () => {
    window.document.head.appendChild(container);
})

prettycards.loadCSS = loadCSS;
PrettyCards_plugin.events.emit.singleton("PrettyCards:cssLoaderReady"); // This has to be used by external scripts using this API only

export {loadCSS};