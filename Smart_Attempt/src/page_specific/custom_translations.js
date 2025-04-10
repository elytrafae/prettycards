import { prettycards, PrettyCards_plugin } from "../libraries/underscript_checker";
import { utility } from "/src/libraries/utility";
import $ from "/src/third_party/jquery-3.6.0.min.js";

import { loadCSS } from "../libraries/css_loader";
import css from "../css/CustomTranslations.css";
loadCSS(css);

var source; // The source used for custom lines.

var englishOriginal; // Onu's English File
var englishCustom; // My English File
var editedTag; // The initials (aka ID) of the currently edited language
var editedOriginal; // The currently edited language's File from Onu
var editedCustom; // The currently edited language's File from Me

var pages = []; // The list of entry IDs that conform to the current filters.
var currentPage = 0;

function toEncodedHTML(input) {
    return $('<span>').text(input).html();
}

function InitCustomTranslations() {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        $(".mainContent").html("<h1>Please wait until you're logged into chat . . .</h1>");
        PrettyCards_plugin.events.on("PC_Chat:getSelfInfos", function() {
            if (utility.translatorFeaturesAccess()) {
                StartVerified();
            } else {
                $(".mainContent").html("<h1 class='red'>You don't have access to this page!</h1>");
            }
        })
    })

}

function StartVerified() {

    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        window.$("title").html("PrettyCards - Custom Translations");
        $(".mainContent").html(`
            <div id="PrettyCards_CT_Phase0">
                <h1>Please select a source!</h1>
                <div id="PrettyCards_CT_Phase0_SourceSelect"></div>
            </div>
            <div id="PrettyCards_CT_Phase1" class="PrettyCards_Hidden">
                <h1>Please select a language!</h1>
                <div id="PrettyCards_CT_Phase1_LangaugeSelect"></div>
            </div>
            <div id="PrettyCards_CT_Phase2" class="PrettyCards_Hidden">
                <div id="PrettyCards_CT_Phase2_MainContent">
                    <div id="PrettyCards_CT_Phase2_FilterRow">
                        <div>
                            <p>Search</p>
                            <input type="text" class="form-control" id="searchInput" onkeyup="applyFilters(); showPage(0);" placeholder="Search..." style="width: 180px;" data-lpignore="true">
                        </div>
                        <div>
                            <p>Category</p>
                            <select id="selectCategory" class="form-control" style="width: 160px; color: white;" onchange="applyFilters(); showPage(0);"></select>
                        </div>
                        <div>
                            <p>Status</p>
                            <select id="selectStatus" class="form-control" style="width: 170px; color: white;" onchange="applyFilters(); showPage(0);">
                                <option value="ALL">All Entries</option>
                                <option value="DONE">Translated</option>
                                <option value="NEW">New</option>
                            </select>
                        </div>
                        <div>
                            <button class="btn btn-primary" id="PrettyCards_CT_Phase2_QuickRefBtn">Quick Ref</button>
                            <p><select id="selectPage" onchange="showPage(this.value)"></select> / <span id="maxPages"></span></p>
                        </div>
                        <div>
                            <button id="btnPrevious" onclick="previousPage();" class="btn btn-lg btn-primary" disabled=""><span class="glyphicon glyphicon-chevron-left"></span></button>
                            <button id="btnNext" onclick="nextPage();" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-chevron-right"></span></button>
                        </div>
                    </div>

                    <p id="PrettyCards_CT_Phase2_Preview"><span id="PrettyCards_CT_Phase2_PreviewName"></span><span id="PrettyCards_CT_Phase2_Preview"></span></p>

                    <p id="PrettyCards_CT_Phase2_Error" class="red"></p>
                    <table id="PrettyCards_CT_Phase2_Table" class="translation table table-bordered">
                        <tbody>
                            <tr>
                                <td id="PrettyCards_CT_Phase2_TranslationKey" colspan="2">translation-key-here</td>
                                <td style="width:50px; text-align: center;">
                                    <button class="btn btn-sm btn-success" onclick="PrettyCards_CT_downloadJSON()">
                                        <span class="glyphicon glyphicon-send"></span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" id="PrettyCards_CT_Phase2_OGEnglishText">OG ENGLISH TEXT</td>
                            </tr>
                            <tr>
                                <td colspan="3" id="PrettyCards_CT_Phase2_EnglishText">ENGLISH TEXT</td>
                            </tr>
                            <tr>
                                <td colspan="3" id="PrettyCards_CT_Phase2_OGTranslatedText">OG TRANSLATED TEXT</td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <textarea maxlength="500" class="form-control" id="PrettyCards_CT_Phase2_TranslationArea"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="PrettyCards_CT_Phase2_QuickRef" class="PrettyCards_Hidden">
                    <h1>Quick Reference Guide!</h1>
                    <h3><a href="/translateManual.jsp" target="_blank">Onutrem's Guide</a></h3>
                </div>
            </div>
        `);

        setUpQuickRef();

        $("#PrettyCards_CT_Phase2_QuickRefBtn").click(function() {
            $(".mainContent").toggleClass("PrettyCards_WiderMainContent");
            $("#PrettyCards_CT_Phase2_QuickRef").toggleClass("PrettyCards_Hidden");
        })
        PrettyCards_plugin.events.on("PrettyCards:translationSourcesDone", function() {
            prettycards.translationManager.languageSources.forEach((s) => {
                var line = $(`<div>${s.name}</div>`);
                line.click(function() {
                    setSource(s);
                })
                $("#PrettyCards_CT_Phase0_SourceSelect").append(line);
            })
        });

        PrettyCards_plugin.events.on("translation:loaded", function() {
            for (var i=1; i < window.availableLanguages.length; i++) {
                const lan = window.availableLanguages[i];
                var line = $(`<div>${window.$.i18n("chat-" + lan)}</div>`);
                line.click(function() {
                    setLanguage(lan);
                })
                $("#PrettyCards_CT_Phase1_LangaugeSelect").append(line);
            }
        })
    })

    window.applyFilters = applyFilters;
    window.showPage = showPage;
    window.nextPage = nextPage;
    window.previousPage = previousPage;
    window.PrettyCards_CT_downloadJSON = downloadJSON;
}

const openCloseFunction = "$(this).parent().toggleClass('PrettyCards_CT_Phase2_QuickRefEntryOpen')"
function setUpQuickRef() {
    $.getJSON(utility.asset(`json/translationQuickRef.json`), {}, function(data) {
        var parent = $("#PrettyCards_CT_Phase2_QuickRef");
        for (var i=0; i < data.length; i++) {
            var entry = data[i];
            var row = $(`
                <div class="PrettyCards_CT_Phase2_QuickRefEntry">
                    <h2 class="PrettyCards_CT_Phase2_QuickRefEntryTitle" onclick="${openCloseFunction}">${entry.title}</h2>
                    <p>${entry.description}</p>
                    <p>Syntax: <code class="PrettyCards_DarkThemeCode">${entry.syntax}</code></p>
                    <p>Example: <code class="PrettyCards_DarkThemeCode">${entry.example}</code></p>
                </div>
            `)
            parent.append(row);
        }
    });
}

function setSource(s) {
    source = s;
    $("#PrettyCards_CT_Phase0").addClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase1").removeClass("PrettyCards_Hidden");
    loadEnglish();
}

function loadEnglish() {
    $.getJSON(`/translation/en.json`, {}, function(data) {
        englishOriginal = data;
        goToPhase2();
    });
    $.getJSON(source.urlFunc('en'), {}, function(data) {
        englishCustom = data;
        goToPhase2();
    })
}

function setLanguage(lan) {
    editedTag = lan;
    $.getJSON(`/translation/${lan}.json`, {}, function(data) {
        editedOriginal = data;
        window.$.i18n().load({[lan]: data})
        goToPhase2();
    });
    var call = $.getJSON(source.urlFunc(lan), {}, function(data) {
        editedCustom = data;
        goToPhase2();
    });
    call.fail(function() {
        editedCustom = {};
        goToPhase2();
    })
}

function setUpCategorySelect() {
    var categories = [""];
    for (var key in englishCustom) {
        var pos = key.indexOf("-");
        var pref = key.substring(0, pos);
        if (pref === "pc") {
            pos = key.indexOf("-", pos+1);
            pref = key.substring(0, pos);
        }
        if (!categories.includes(pref)) {
            categories.push(pref);
        }
    }
    var inner = "";
    categories.forEach((e) => {
        inner += `<option value="${e}">${e}</option>`;
        
    })
    document.getElementById("selectCategory").innerHTML = inner;
}

function isEntryExpired(key) {
    var entry = editedCustom[key];
    return entry && entry.ifEqual && entry.ifEqual != editedOriginal[key];
}

function verifyExpired() {
    for (var key in editedCustom) {
        var entry = editedCustom[key];
        var englishEntry = englishCustom[key];
        if (isEntryExpired(key)) {
            if (!englishEntry) {
                editedCustom[key] = undefined;
            } else {
                entry.ifEqual = editedOriginal[key];
            }
        }
    }
}

function goToPhase2() {
    if (!(englishOriginal && englishCustom && editedOriginal && editedCustom)) {
        return;
    }
    verifyExpired();
    $("#PrettyCards_CT_Phase1").addClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase2").removeClass("PrettyCards_Hidden");
    console.log("SUCCESS", englishOriginal, englishCustom, editedOriginal, editedCustom);
    setUpCategorySelect();
    applyFilters();
    showPage(0);
}

function isEntryFull(key) {
    var entry = editedCustom[key];
    if (!entry) {return false;}
    if (typeof(entry) == "string" && entry != "") {return true;}
    if (entry.value && entry.value != "") {return true;}
    if (entry.values) {
        for (var i=0; i < entry.values.length; i++) {
            if (!entry.values[i] || entry.values[i] == "") {
                return false;
            }
        }
    }
    return true;
}

function isEntryEmpty(key) {
    var entry = editedCustom[key];
    if (!entry) {return true;}
    if (typeof(entry) == "string" && entry == "") {return true;}
    if (entry.value && entry.value == "") {return true;}
    if (entry.values) {
        for (var i=0; i < entry.values.length; i++) {
            if (entry.values[i] && entry.values[i].length > 0) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function matchesSearch(key, search) {
    if (search === "") {return true;}
    var searchStrings = [key];
    if (!isEntryEmpty(key)) {
        var entry = editedCustom[key];
        if (typeof(entry) == "string") {
            searchStrings.push(entry);
        }
        if (entry.value) {
            searchStrings.push(entry.value);
        }
        if (entry.values) {
            searchStrings = searchStrings.concat(entry.values);
        }
    }
    for (var i=0; i < searchStrings.length; i++) {
        if (searchStrings[i].includes(search)) {
            return true;
        }
    }
    return false;
}

function isRemoved(key) {

    var categoryVal = $("#selectCategory").val();
    var statusVal = $("#selectStatus").val();
    var searchVal = $("#searchInput").val();
    var entry = editedCustom[key];
    //var isFull = isEntryFull(key);
    var isEmpty = isEntryEmpty(key);

    if (categoryVal != "" && !key.startsWith(categoryVal)) {
        return true;
    }

    if (statusVal == "DONE" && isEmpty) {
        return true;
    } else if (statusVal == "NEW" && !isEmpty) {
        return true;
    }/* else if (statusVal == "NEEDS_CHANGE" && isFull) {
        return true;
    }*/

    if (!key.startsWith(categoryVal)) {
        return true;
    }

    if (!matchesSearch(key, searchVal)) {
        return true;
    }

    return false;
}

function applyFilters() {

    pages = [];

    for (var key in englishCustom) {
        if (!isRemoved(key)) {
            pages.push(key);
        }
    }

    $("#maxPages").html(pages.length);

    var select = $("#selectPage");
    select.html("");
    for (var i=0; i < pages.length; i++) {
        select.append(`<option value="${i}">${i+1}</option>`);
    }

}

function nextPage() {
    if (currentPage < pages.length - 1) {
        showPage(currentPage + 1);
    }
}

function previousPage() {
    if (currentPage > 0) {
        showPage(currentPage - 1);
    }
}

function showPage(nr) {
    currentPage = nr;
    $("#selectPage").val(currentPage);

    $('#btnNext').prop('disabled', currentPage + 1 >= pages.length);
    $('#btnPrevious').prop('disabled', currentPage <= 0);

    //console.log(pages, nr);
    if (currentPage < 0) {
        currentPage = 0;
    }
    if (currentPage >= pages.length) {
        currentPage = pages.length - 1;
    }
    if (pages.length <= 0) {
        $("#PrettyCards_CT_Phase2_Table").addClass("PrettyCards_Hidden");
        $("#PrettyCards_CT_Phase2_Error").html("No entry matches the search! Please try something else!");
        console.error("No entry matches the search! Please try something else!");
        return;
    }
    $("#PrettyCards_CT_Phase2_Table").removeClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase2_Error").html("");
    displayEntry(pages[currentPage]);
}

function returnNewEntryBasedOnEnglish(key) {
    var enEntry = englishCustom[key];
    console.log(key, enEntry);
    if (typeof(enEntry) == "string") {
        return "";
    }
    var entry = {};
    if (enEntry.ifEqual) {
        entry.ifEqual = editedOriginal[key] || "";
    }
    if (enEntry.values) {
        entry.values = [];
        for (var i=0; i < enEntry.values.length; i++) {
            entry.values[i] = "";
        }
    } else {
        entry.value = "";
    }
    return entry;
}

function getSingleTextFromEntry(entry) {
    var text = entry;
    if (entry.value || entry.value === "") {
        text = entry.value;
    }
    return text;
}

function setSingleTextToKey(key, str) {
    var entry = editedCustom[key];
    if (entry.value || entry.value === "") {
        entry.value = str;
        return;
    }
    editedCustom[key] = convertValueToString(str);
}

function displayEntry(key) {
    $("#PrettyCards_CT_Phase2_Preview").html("");
    var entry = editedCustom[key];
    $("#PrettyCards_CT_Phase2_TranslationKey").html(key);
    if (!entry) {
        entry = returnNewEntryBasedOnEnglish(key);
        editedCustom[key] = entry;
    }

    $(".PrettyCards_CT_Phase2_ListEntryRow").remove();

    // With this I'll assume that there will never be conditional list entries.
    if (entry.values) {
        displayListEntry(key, entry);
        return;
    }

    var englishText = getSingleTextFromEntry(englishCustom[key]);
    
    $("#PrettyCards_CT_Phase2_EnglishText").removeClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase2_EnglishText").html(getColoredStringReference(englishText));
    if (entry.ifEqual) {
        $("#PrettyCards_CT_Phase2_OGEnglishText").parent().removeClass("PrettyCards_Hidden");
        $("#PrettyCards_CT_Phase2_OGTranslatedText").parent().removeClass("PrettyCards_Hidden");
        $("#PrettyCards_CT_Phase2_OGEnglishText").html(getColoredStringReference(englishOriginal[key]));
        $("#PrettyCards_CT_Phase2_OGTranslatedText").html(getColoredStringReference(editedOriginal[key]));
    } else {
        $("#PrettyCards_CT_Phase2_OGEnglishText").parent().addClass("PrettyCards_Hidden");
        $("#PrettyCards_CT_Phase2_OGTranslatedText").parent().addClass("PrettyCards_Hidden");
    }
    $("#PrettyCards_CT_Phase2_TranslationArea").parent().removeClass("PrettyCards_Hidden");
    var entryText = getSingleTextFromEntry(entry)
    $("#PrettyCards_CT_Phase2_TranslationArea").val(entryText);
    setPreviewTo(convertValueToString(entryText), key);

    const constKey = key;
    $("#PrettyCards_CT_Phase2_TranslationArea").unbind("keyup").keyup(function () {
        var txt = $("#PrettyCards_CT_Phase2_TranslationArea").val();
        var convertedValue = convertValueToString(txt);
        setSingleTextToKey(constKey, convertedValue);
        setPreviewTo(convertedValue, constKey);
    });
}

function displayListEntry(key, entry) {
    var englishEntry = englishCustom[key];
    $("#PrettyCards_CT_Phase2_EnglishText").addClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase2_OGEnglishText").parent().addClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase2_OGTranslatedText").parent().addClass("PrettyCards_Hidden");
    $("#PrettyCards_CT_Phase2_TranslationArea").parent().addClass("PrettyCards_Hidden");

    var parent = $("#PrettyCards_CT_Phase2_Table > tbody");
    const constKey = key; // Just to make sure . . .
    // I'll go after the English entry because that should always be the official one.
    for (var i=0; i < englishEntry.values.length; i++) {
        var val = entry.values[i];
        const index = i;
        const row = $(`
        <tr class="PrettyCards_CT_Phase2_ListEntryRow">
            <td colspan="1">${getColoredStringReference(englishEntry.values[i])}</td>
            <td colspan="2">
                <textarea maxlength="500" class="form-control" class="PrettyCards_CT_Phase2_ListTranslationArea"></textarea>
            </td>
        </tr>`);
        row.find("textarea").val(val || "");
        row.find("textarea").keyup(function () {
            var txt = $(this).val();
            var convertedValue = convertValueToString(txt);
            editedCustom[constKey].values[index] = convertedValue;
            setPreviewTo(convertedValue, constKey);
        });
        parent.append(row);
    }
}

function downloadJSON() {
    var save = JSON.stringify(editedCustom);
    utility.downloadFile(save, editedTag + ".json", "text/plain");

    BootstrapDialog.show({
        title: "Thank you for your collaboration! ^^",
        size: BootstrapDialog.SIZE_WIDE,
        message: `<p>The language JSON file should be downloading now! Please send it to me through Discord to the <span class="PrettyCards_DiscordMention">#translation-files-go-here</span> channel!</p><p>is the file didn't download, you can copy-paste its contents below!</p>
            <code class="PrettyCards_DarkThemeCode PrettyCards_BlockCode" onclick="navigator.clipboard.writeText(this.innerText)">${save}</code>
        `,
        buttons: [{
                label: "Alright!",
                cssClass: 'btn-primary us-normal',
                action(dialog) {
                    dialog.close();
                }
            }
        ]
    });
}

function convertValueToString(value) {
    return value.replaceAll("\\n", "\n").replaceAll("\\r", "\r");
}

// Ok, I have to admit, I could not do this better than Onu. If I wanted to, it would be the exact same result, sooooo . . .
function getColoredStringReference(stringReference, encodeInput = true) {

    var colors = ['#00ff06', '#fc00ff', '#00d6ff', '#ff5300',
        '#0074ff', '#ff0030', '#ffa400'];

    if (encodeInput) {
        stringReference = toEncodedHTML(stringReference);
        var stringReference = stringReference.replaceAll("\n", '<span class="gray">\\n</span>').replaceAll("\r", '<span class="gray">\\r</span>');
    }

    var coloredString = stringReference.replace(/({{[^{}]*?}})/g, function (m) {
        return '<span class="JUSTICE">' + m + '</span>';
    });

    coloredString = coloredString.replace(/(\$[1-9]+)/g, function (m) {
        var number = parseInt(m.replace('$', '')) - 1;
        var color = colors[number % colors.length];
        return '<span style="color: ' + color + '">' + m + '</span>';
    });

    return coloredString;
}

var lastPreviewType;
function setPreviewTo(txt = "", key = "") {
    if (lastPreviewType) {
        lastPreviewType.onremove();
    }
    if (txt === "") {
        $("#PrettyCards_CT_Phase2_Preview").html("");
        return;
    }
    var types = window.prettycards.translationManager.previewTypes;
    var previewType;
    for (var i=0; i < types.length; i++) {
        var type = types[i];
        if (key.match(type.regex)) {
            previewType = type;
            break;
        }
    }
    lastPreviewType = previewType;
    $("#PrettyCards_CT_Phase2_Preview").html(`<span>${utility.toLocale("decks-preview", editedTag)}: </span><span id="PrettyCards_CT_Phase2_PreviewInsert"></span>`);
    $("#PrettyCards_CT_Phase2_PreviewInsert").append(previewType.eleFunc(utility.toLocale(txt, editedTag)));
}

export {InitCustomTranslations};