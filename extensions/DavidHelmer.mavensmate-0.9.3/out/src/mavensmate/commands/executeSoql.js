"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
const vscode = require("vscode");
module.exports = class ExecuteSoql extends clientCommand_1.ClientCommand {
    static create() {
        return new ExecuteSoql();
    }
    constructor() {
        super('Execute SOQL', 'execute-soql');
        this.async = true;
        this.body.soql = '';
    }
    execute(selectedResource) {
        let inputBoxOptions = {
            prompt: 'Enter SOQL to execute',
            ignoreFocusOut: true
        };
        let inputBox = vscode.window.showInputBox(inputBoxOptions).then((soql) => {
            this.body.soql = soql;
            return super.execute();
        });
        return inputBox;
    }
    onStart() {
        return super.onStart()
            .then(() => {
            let executeSoqlMessage = 'Executing SOQL: ' + this.body.soql;
            this.mavensMateChannel.appendLine(executeSoqlMessage);
        });
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => this.handleExecuteSoqlResponse(response));
    }
    handleExecuteSoqlResponse(response) {
        vscode.workspace.openTextDocument(response.result.path)
            .then((document) => {
            vscode.window.showTextDocument(document);
        });
    }
};
//# sourceMappingURL=executeSoql.js.map