import { addSetting, PrettyCards_plugin } from "../libraries/underscript_checker";

var setting = addSetting({
    'key': 'friendship_sort',
    'name': 'Improved Reveal Hand Setting', // Name in settings page
    'type': 'boolean',
    'refresh': true, // true to add note "Will require you to refresh the page"
    'default': true, // default value
})

var spectatorStatus;
var input1;
var input2;

function spectatorToggle() {
    input1.setAttribute("disabled", "true");
    input2.setAttribute("disabled", "true");
    window.$.post("/Settings", {toggleSpectator: "lol"}, function(data) {
        input1.removeAttribute("disabled");
        input2.removeAttribute("disabled");
    }).fail(function() {
        window.location.reload();
    });
}

function InitSettings() {
    if (setting.value()) {
        PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
            var input = document.querySelector("input[name=toggleSpectator]");
            if (input) {
                spectatorStatus = !input.className.includes("btn-success");
                input.parentElement.className = "PrettyCards_Hidden";
                var newCont = document.createElement("P");
                newCont.innerHTML = `
                    <span>${$.i18n("settings-spectator-enable")}</span> 
                    <input id="toggleSpectatorON" type="radio" name="toggleSpectator" value="true" class="toggleSpectator"> 
                    <label for="toggleSpectatorON">${$.i18n("settings-on")}</label> 
                    <input id="toggleSpectatorOFF" type="radio" name="toggleSpectator" value="false" class="toggleSpectator"> 
                    <label for="toggleSpectatorOFF">${$.i18n("settings-off")}</label>
                `;

                input1 = newCont.querySelector("#toggleSpectatorON");
                input2 = newCont.querySelector("#toggleSpectatorOFF");

                (spectatorStatus ? input1 : input2).setAttribute("checked", "true");

                input1.addEventListener("change", spectatorToggle);
                input2.addEventListener("change", spectatorToggle);

                input.parentElement.parentElement.insertBefore(newCont, input.parentElement);
            }
        })
    }
}

export {InitSettings}