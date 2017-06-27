"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commandIndex = require("../mavensmate/commands/index");
function registerCommands() {
    let registerCommand = vscode.commands.registerCommand;
    let commandDirectory = commandIndex.commandDirectory();
    for (let commandKey in commandDirectory) {
        let Command = commandDirectory[commandKey];
        registerCommand(commandKey, (selectedResource) => {
            let command = Command.create();
            return command.invoke(selectedResource);
        });
    }
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=commandRegistrar.js.map