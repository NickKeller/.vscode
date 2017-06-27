"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
const vscode = require("vscode");
module.exports = class EditProject extends clientCommand_1.ClientCommand {
    static create() {
        return new EditProject();
    }
    constructor() {
        super('New Apex Script', 'new-apex-script');
        this.async = false;
        this.body.args.ui = true;
    }
    execute() {
        let inputBoxOptions = {
            prompt: 'Provide a name for the Apex Script',
            ignoreFocusOut: true
        };
        let inputBoxPromise = vscode.window.showInputBox(inputBoxOptions).then((apexScriptName) => {
            if (apexScriptName && apexScriptName.length > 0) {
                this.body.name = apexScriptName;
                return super.execute();
            }
        });
        return inputBoxPromise;
    }
};
//# sourceMappingURL=newApexScript.js.map