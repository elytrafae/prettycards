import { PrettyCards_plugin } from "../underscript_checker";

const IMPOSSIBLE_CHARACTER = "␚";//"᭼"; // IDK, a character that Onu's chat does not accept

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
    ":owo:": [":uwu:", ":owofy:"],
    ":upper:": [":fullcaps:", ":uppercase:", ":caps:"],
    ":lower:": ["fulllower", ":lowercase:"],
    ":mock:": [":mockcase:", ":swapcase:", ":alternatecase:"],
    ":shrug:": []
}

const functionsForCommands = {
    ":owo:" : (text) => {
        return new CommandTextPair("", text);
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
    ":shrug:": (text) => {
        return new CommandTextPair("¯\\_(ツ)_/¯", text);
    }
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
    console.log(input);
    $(input).val(processMessage($(input).val()));
}

PrettyCards_plugin.events.on('Chat:send', convert);