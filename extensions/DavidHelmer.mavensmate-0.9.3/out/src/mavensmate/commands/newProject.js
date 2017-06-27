"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewProject extends clientCommand_1.ClientCommand {
    static create() {
        return new NewProject();
    }
    constructor() {
        super('New Project', 'new-project');
        this.async = false;
        this.body.args.ui = true;
        this.allowWithoutProject = true;
    }
};
//# sourceMappingURL=newProject.js.map