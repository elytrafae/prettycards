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
                <div id="PrettyCards_CT_Phase2_FilterRow">
                    <div>
                        <p>Search</p>
                        <input type="text" class="form-control" id="searchInput" placeholder="Search..." style="width: 180px;" data-lpignore="true">
                    </div>
                    <div>
                        <p>Category</p>
                        <select id="selectCategory" class="form-control" style="width: 160px; color: white;" onchange="applyFilters(); showPage(0);"><option value=""></option></select>
                    </div>
                    <div>
                        <p>Status</p>
                        <select id="selectStatus" class="form-control" style="width: 170px; color: white;" onchange="applyFilters(); showPage(0);">
                            <option value="NOT_TRANSLATED">Not translated</option>
                            <option value="DONE">Translated</option>
                        </select>
                    </div>
                    <div>
                        <button class="btn btn-primary">Quick Ref</button>
                        <p><span id="currentPage">1</span><select id="selectPage"></select></p>
                    </div>
                </div>
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