"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mavensMateChannel_1 = require("../../vscode/mavensMateChannel");
const vscode = require("vscode");
const projectSettings_1 = require("../projectSettings");
class BaseCommand {
    constructor(label) {
        this.label = label;
        this.mavensMateChannel = mavensMateChannel_1.MavensMateChannel.getInstance();
    }
    invoke(selectedResource) {
        if (projectSettings_1.ProjectSettings.hasProjectSettings() || this.allowWithoutProject === true) {
            try {
                return this.execute(selectedResource).then(null, this.handleAuthenticationError);
            }
            catch (commandException) {
                this.logAsErrorAndThrow(commandException);
            }
        }
        else {
            return this.promptToOpenProject();
        }
    }
    logAsErrorAndThrow(commandException) {
        console.error(`MavensMate: ${commandException}`);
        throw (commandException);
    }
    handleAuthenticationError(response) {
        if (response && response.error && response.error.endsWith('Project requires re-authentication.')) {
            console.warn('MavensMate: Need to re-authenticate.');
            return vscode.commands.executeCommand('mavensmate.oAuthProject');
        }
    }
    promptToOpenProject() {
        let message = `${this.label} requires an open MavensMate project`;
        let openProject = 'Open Project';
        return vscode.window.showWarningMessage(message, openProject)
            .then((answer) => {
            if (answer == openProject) {
                return vscode.commands.executeCommand('mavensmate.openProject');
            }
        });
    }
}
exports.BaseCommand = BaseCommand;
//# sourceMappingURL=baseCommand.js.map