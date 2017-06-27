"use strict";
const clientCommand_1 = require("./clientCommand");
const vscode = require("vscode");
const Promise = require("bluebird");
const path = require("path");
class RunTests extends clientCommand_1.ClientCommand {
    static create() {
        return new RunTests();
    }
    constructor() {
        super('Run Apex Tests', 'run-tests');
        this.async = false;
        this.body.args.ui = true;
    }
    execute(selectedResource) {
        if (selectedResource && selectedResource.scheme === 'file') {
            this.filePath = selectedResource.fsPath;
        }
        else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
            this.filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        }
        return this.confirmPath()
            .then(() => {
            this.body.classes = [this.baseName];
            return super.execute();
        });
    }
    confirmPath() {
        if (this.filePath && this.filePath.length > 0) {
            this.baseName = path.basename(this.filePath, '.cls');
        }
        return Promise.resolve();
    }
    onStart() {
        return super.onStart()
            .then(() => {
            return this.outputPathProcessed();
        });
    }
    outputPathProcessed() {
        if (this.baseName && this.filePath) {
            let message = `${this.baseName} (${this.filePath})`;
            return this.mavensMateChannel.appendLine(message);
        }
        else {
            return Promise.resolve();
        }
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => {
            this.outputPathProcessed();
            return response;
        });
    }
    onFailure(response) {
        return super.onFailure(response)
            .then(() => {
            this.outputPathProcessed().then(response);
            return response;
        });
    }
}
module.exports = RunTests;
//# sourceMappingURL=runTests.js.map