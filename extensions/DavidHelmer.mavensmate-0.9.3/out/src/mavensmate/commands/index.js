"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function commandDirectory() {
    let commandFiles = fs.readdirSync(__dirname);
    let commandDirectory = {};
    for (let commandFile of commandFiles) {
        if (commandFile.endsWith('js')) {
            let commandBaseName = path.basename(commandFile, '.js');
            let commandKey = 'mavensmate.' + commandBaseName;
            console.info(`MavensMate: Attempting to import ${commandKey}`);
            let importedCommand = require('./' + commandFile);
            if (importedCommand.create) {
                console.info(`MavensMate: Imported ${commandKey}`);
                commandDirectory[commandKey] = importedCommand;
            }
            else {
                console.warn(`MavensMate: ${commandKey} not imported because it does not have a static create method`);
            }
        }
    }
    return commandDirectory;
}
exports.commandDirectory = commandDirectory;
//# sourceMappingURL=index.js.map