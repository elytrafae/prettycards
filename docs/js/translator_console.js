
// Nevermind, I can't do this due to the preview system.

function Start() {
    loadEnglish();
    setUpQuickRef();
    $("#PrettyCards_CT_Phase2_QuickRefBtn").click(function() {
        $(".mainContent").toggleClass("PrettyCards_WiderMainContent");
        $("#PrettyCards_CT_Phase2_QuickRef").toggleClass("PrettyCards_Hidden");
    })
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
}