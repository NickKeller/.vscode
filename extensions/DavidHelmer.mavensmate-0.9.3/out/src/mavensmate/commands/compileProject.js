"use strict";
const clientCommand_1 = require("./clientCommand");
const compileResponseHandler_1 = require("../handlers/compileResponseHandler");
const vscode = require("vscode");
class CompileProject extends clientCommand_1.ClientCommand {
    static create() {
        return new CompileProject();
    }
    constructor() {
        super('Compile Project', 'compile-project');
        this.async = true;
        this.body.args.ui = false;
    }
    execute(selectedResource) {
        let confirmMessage = 'Would you like to compile the project?';
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if (answer === 'Yes') {
                return super.execute().then(compileResponseHandler_1.handleCompileResponse);
            }
            else {
                return;
            }
        });
    }
}
module.exports = CompileProject;
//# sourceMappingURL=compileProject.js.map