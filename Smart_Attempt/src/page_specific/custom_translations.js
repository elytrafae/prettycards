import { PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "/src/libraries/utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";



function InitCustomTranslations() {
    
    // TODO: Load the always necessary files here.

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        utility.loadCSSFromGH("CustomTranslations");
        $(".mainContent").html(`
            <div id="PrettyCards_CT_Phase1">
                <h1>Please select a language!</h1>
                <div id="PrettyCards_CT_Phase1_LangaugeSelect"></div>
            </div>
            <div id="PrettyCards_CT_Phase2">
                
            </div>
        `);
        PrettyCards_plugin.events.on("translation:loaded", function() {
            for (var i=0; i < window.availableLanguages.length; i++) {
                var lan = window.availableLanguages[i];
                var line = $(`<div>${window.$.i18n("chat-" + lan)}</div>`);
                $("#PrettyCards_CT_Phase1_LangaugeSelect").append(line);
            }
        })
    })
}

export {InitCustomTranslations};