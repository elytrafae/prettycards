import { PrettyCards_plugin } from "../underscript_checker"

function authenticate() {
    console.log(gapi);
    console.log(gapi.auth2);
    console.log(gapi.load());
    return window.gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        //.then(function() { console.log("Sign-in successful"); },
        //        function(err) { console.error("Error signing in", err); });
}
function loadClient() {
    window.gapi.client.setApiKey("YOUR_API_KEY");
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}

function GoogleApiLoaded() {
    console.log("GOOGLE SCRIPT LOADED!");
    authenticate().then(loadClient).then(function() {
        console.log("Sign-in successful");
    }, function(err) {
        console.error("Error signing in", err);
    });
}

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    console.log("ADDED ELEMENT!");
    window.$.holdReady(true);
    window.$.getScript("https://apis.google.com/js/api.js", function() {
        $.holdReady(false);
        GoogleApiLoaded();
    });
    //var script = $(`<script src="https://apis.google.com/js/api.js" async=false defer=false></script>`);
    //script.ready(GoogleApiLoaded);
    //window.$("body").append(script);
})
