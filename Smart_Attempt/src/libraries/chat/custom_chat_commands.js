import { getSettingType } from "../custom_setting_types";
import { PrettyCards_plugin, addSetting } from "../underscript_checker";
import owoify from "owoify-js";

const IMPOSSIBLE_CHARACTER = "␚";//"᭼"; // IDK, a character that Onu's chat does not accept

var customEmoteSetting = addSetting({
    'key': 'chat_ascii_emotes_list',
    'name': 'Chat Ascii Emotes', // Name in settings page
    'type': getSettingType("EditableList"),
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': {
        "shrug": "¯\\_(ツ)_/¯",
        //":fucku:": asciiEmoteHelper("(ツ)╭∩╮"),
        "shrugl": "¯\\_( ͡° ͜ʖ ͡°)_/¯",
        "above": "☝(ツ)",
        "tableflip": "(╯°□°)╯︵ ┻━┻",
        "tabledown": "┬─┬ノ( º _ ºノ)",
        "lenny": "( ͡° ͜ʖ ͡°)",
        "lelelennynyny": "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)",
        "amog": "ඞ"
    }, // default value
});

class CommandTextPair {

    #command = "";
    #text = "";

    constructor(cmd, txt) {
        this.#command = cmd;
        this.#text = txt;
    }

    getCommand() {
        return  this.#command;
    }

    getText() {
        return this.#text;
    }

}

const commandAliases = {
    ":upper:": [":fullcaps:", ":uppercase:", ":caps:"],
    ":lower:": ["fulllower", ":lowercase:"],
    ":mock:": [":mockcase:", ":swapcase:", ":alternatecase:"],
}

var functionsForCommands = {
    ":owo:" : (text) => {
        return new CommandTextPair("", owoify(text, "owo"));
    },
    ":uwu:" : (text) => {
        return new CommandTextPair("", owoify(text, "uwu"));
    },
    ":uvu:" : (text) => {
        return new CommandTextPair("", owoify(text, "uvu"));
    },
    ":upper:" : (text) => {
        return new CommandTextPair("", text.toUpperCase());
    },
    ":lower:" : (text) => {
        return new CommandTextPair("", text.toLowerCase());
    },
    ":mock:" : (text) => {
        return new CommandTextPair("", text.toMockCase());
    },
    /*
    ":shrug:": asciiEmoteHelper("¯\\_(ツ)_/¯"),
    ":fucku:": asciiEmoteHelper("(ツ)╭∩╮"),
    ":shrugg:": asciiEmoteHelper("¯\\_( ͡° ͜ʖ ͡°)_/¯"),
    ":above:": asciiEmoteHelper("☝(ツ)"),
    ":tableflip:": asciiEmoteHelper("(╯°□°)╯︵ ┻━┻"),
    ":tabledown:": asciiEmoteHelper("┬─┬ノ( º _ ºノ)"),
    ":lenny:": asciiEmoteHelper("( ͡° ͜ʖ ͡°)"),
    ":lelelennynyny:": asciiEmoteHelper("( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)"),
    ":amog:": asciiEmoteHelper("ඞ")
    */
}

var emotes = customEmoteSetting.value();
for (var key in emotes) {
    functionsForCommands[`:${key}:`] = asciiEmoteHelper(emotes[key]);
}

function processMessage(message) {
    var commands = [];
    message = message.replaceAll(IMPOSSIBLE_CHARACTER, ""); // Delete all IMPOSSIBLE_CHARACTERS so they don't mess with the system
    message = message.replace(/:[a-z]*:/gi, (part) => { // BUG: How does this find the string, but not replace?
        commands.push(part);
        return IMPOSSIBLE_CHARACTER;
    })

    // Handle Aliases, then run commands!
    for (var i=0; i < commands.length; i++) {
        var command = commands[i];
        for (var aliasTarget in commandAliases) {
            if (commandAliases[aliasTarget].includes(command.toLowerCase())) {
                commands[i] = aliasTarget;
                command = aliasTarget;
            }
        }
        var func = functionsForCommands[command.toLowerCase()];
        if (func) {
            var ret = func(message);
            commands[i] = ret.getCommand();
            message = ret.getText();
        }
    }

    var i = 0;
    message = message.replaceAll(IMPOSSIBLE_CHARACTER, () => {
        return commands[i++];
    })
    return message;
}

// If anyone can tell me how I could manipulate the characters in JS, I would greatly appreciate it.
// For now, I'll use this.
String.prototype.toMockCase = function() {
    var copy = "";
    var upper = false;
    for (var i=0; i < this.length; i++) {
        var letter = this[i];
        if (this[i].toLowerCase() != this[i].toUpperCase()) {
            letter = upper ? (this[i].toUpperCase()) : (this[i].toLowerCase());
            upper = !upper;
        }
        copy = copy.concat(letter);
    }
    return copy;
}

function convert({ input }) {
    $(input).val(processMessage($(input).val()));
}

function asciiEmoteHelper(emote) {
    return (text) => {
        return new CommandTextPair(emote, text);
    }
}

PrettyCards_plugin.events.on('Chat:send', convert);