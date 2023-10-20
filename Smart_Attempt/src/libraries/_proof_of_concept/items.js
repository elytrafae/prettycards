import { PrettyCards_plugin } from "../underscript_checker";


PrettyCards_plugin.events.on("connect", () => {
    console.log("CONNECTED!");
});