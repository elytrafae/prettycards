
const IMPOSSIBLE_CHARACTER = "␚"; // IDK, a character that Onu's chat does not accept

class CommandTextPair {


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
    ":upper:": [":fullcaps:", ":uppercase:"],
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
    }
}

function processMessage(message) {
    var commands = [];
    message.replaceAll(IMPOSSIBLE_CHARACTER, ""); // Delete all IMPOSSIBLE_CHARACTERS so they don't mess with the system
    message.replace(/:[a-z]:/gi, (part) => {
        commands.push(part);
        return IMPOSSIBLE_CHARACTER;
    })

    // Handle Aliases
    for (var i=0; i < commands.length; i++) {
        var command = commands[i];
        for (var aliasTarget in commandAliases) {
            if (commandAliases[aliasTarget].contains(command.toLowerCase())) {
                commands[i] = aliasTarget;
            }
        }
    }

    // Go over commands and check what modifications the user would like
    // Do modifictions to the message string, make sue not to touch IMPOSSIBLE_CHARACTERs.

    var i = 0;
    message.replaceAll(IMPOSSIBLE_CHARACTER, () => {
        return commands[i++];
    })
    return message;
}