"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathsCommand_1 = require("./pathsCommand");
const vscode = require("vscode");
module.exports = class RefreshFile extends pathsCommand_1.PathsCommand {
    static create() {
        return new RefreshFile();
    }
    constructor() {
        super('Refresh File', 'refresh-metadata');
        this.async = true;
        this.body.args.ui = false;
    }
    confirmPath() {
        return super.confirmPath().then(() => this.promptForConfirmation());
    }
    promptForConfirmation() {
        let confirmMessage = `Are you sure you want to refresh ${this.baseName} from Salesforce?`;
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if (answer === 'Yes') {
                return Promise.resolve();
            }
            else {
                return Promise.reject('Refresh File Cancelled');
            }
        });
    }
};
//# sourceMappingURL=refreshFile.js.map