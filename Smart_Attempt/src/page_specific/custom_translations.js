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
                <div id="PrettyCards_CT_Phase2_MainContent">
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
                            <button class="btn btn-primary" id="PrettyCards_CT_Phase2_QuickRefBtn">Quick Ref</button>
                            <p><span id="currentPage">1</span><select id="selectPage"></select></p>
                        </div>
                        <div>
                            <button id="btnPrevious" onclick="previousPage();" class="btn btn-lg btn-primary" disabled=""><span class="glyphicon glyphicon-chevron-left"></span></button>
                            <button id="btnNext" onclick="nextPage();" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-chevron-right"></span></button>
                        </div>
                    </div>
                </div>
                <div id="PrettyCards_CT_Phase2_QuickRef" class="PrettyCards_Hidden"></div>
            </div>
        `);

        $("PrettyCards_CT_Phase2_QuickRefBtn").click(function() {
            $(".mainContent").toggleClass("PrettyCards_FullWidthMainContent");
            $("#PrettyCards_CT_Phase2_QuickRef").toggleClass("PrettyCards_Hidden");
        })
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