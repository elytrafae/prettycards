import { prettycards } from "./underscript_checker";
import { utility } from "./utility";


prettycards.downloadEmotesFile = () => {
    utility.downloadFile(JSON.stringify(window.chatEmotes), "every_undercards_emote.json");
}