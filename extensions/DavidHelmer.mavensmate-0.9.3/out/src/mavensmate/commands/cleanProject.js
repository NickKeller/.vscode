"use strict";
const clientCommand_1 = require("./clientCommand");
const vscode = require("vscode");
class CleanProject extends clientCommand_1.ClientCommand {
    static create() {
        return new CleanProject();
    }
    constructor() {
        super('Clean Project', 'clean-project');
        this.async = true;
        this.body = {
            args: {
                ui: false
            }
        };
    }
    execute() {
        let confirmMessage = 'Confirm clean project? All local (non-server) files will be deleted and your project will be refreshed from the server';
        return vscode.window.showWarningMessage(confirmMessage, 'Yes').then((answer) => {
            if (answer === 'Yes') {
                return super.execute();
            }
            else {
                return;
            }
        });
    }
}
module.exports = CleanProject;
//# sourceMappingURL=cleanProject.js.map