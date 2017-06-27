"use strict";
const clientCommand_1 = require("./clientCommand");
const StaticResourceQuickPick = require("../../vscode/staticResourceQuickPick");
const vscode = require("vscode");
const path = require("path");
const Promise = require("bluebird");
class CreateResourceBundle extends clientCommand_1.ClientCommand {
    static create() {
        return new CreateResourceBundle();
    }
    constructor() {
        super('Create Resource Bundle', 'new-resource-bundle');
    }
    execute(selectedResource) {
        if (selectedResource && selectedResource.scheme === 'file') {
            this.filePath = selectedResource.fsPath;
        }
        return this.confirmPath()
            .then(() => {
            this.body.paths = [this.filePath];
            return super.execute();
        });
    }
    confirmPath() {
        if (this.filePath) {
            let extension = path.extname(this.filePath);
            if (extension == 'resource') {
                return this.promptForConfirmation();
            }
            else {
                return Promise.reject(`${this.baseName} is not a Static Resource`);
            }
        }
        else {
            return StaticResourceQuickPick.showStaticResourceQuickPick()
                .then((selectedStaticResource) => {
                this.filePath = selectedStaticResource.path;
            });
        }
    }
    promptForConfirmation() {
        let confirmMessage = `Are you sure you want to create a resource bundle for ${this.baseName}?`;
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if (answer === 'Yes') {
                return Promise.resolve();
            }
            else {
                return Promise.reject(`${this.label} cancelled`);
            }
        });
    }
}
module.exports = CreateResourceBundle;
//# sourceMappingURL=createResourceBundle.js.map