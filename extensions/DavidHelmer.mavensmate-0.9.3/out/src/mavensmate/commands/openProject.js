"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("./baseCommand");
const ProjectQuickPick = require("../../vscode/projectQuickPick");
module.exports = class OpenProject extends baseCommand_1.BaseCommand {
    static create() {
        return new OpenProject();
    }
    constructor() {
        super('Open Project');
        this.allowWithoutProject = true;
    }
    execute() {
        return Promise.resolve(ProjectQuickPick.showProjectListAndOpen());
    }
};
//# sourceMappingURL=openProject.js.map