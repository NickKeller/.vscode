"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
const vscode = require("vscode");
module.exports = class NewProjectFromExistingDirectory extends clientCommand_1.ClientCommand {
    static create() {
        return new NewProjectFromExistingDirectory();
    }
    constructor() {
        super('Convert To MavensMate Project', 'new-project-from-existing-directory');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.origin = vscode.workspace.rootPath;
        this.allowWithoutProject = true;
    }
};
//# sourceMappingURL=convertProject.js.map