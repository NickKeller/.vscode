"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathsCommand_1 = require("./pathsCommand");
const vscode = require("vscode");
module.exports = class DeleteFile extends pathsCommand_1.PathsCommand {
    static create() {
        return new DeleteFile();
    }
    constructor() {
        super('Delete File', 'delete-metadata');
        this.async = true;
        this.body.args.ui = false;
    }
    confirmPath() {
        return super.confirmPath().then(() => this.promptForConfirmation());
    }
    promptForConfirmation() {
        let confirmMessage = `Are you sure you want to delete ${this.baseName} from Salesforce?`;
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if (answer === 'Yes') {
                return Promise.resolve();
            }
            else {
                return Promise.reject('Delete File Cancelled');
            }
        });
    }
};
//# sourceMappingURL=deleteFile.js.map