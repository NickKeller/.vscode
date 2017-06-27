'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const vscode_1 = require("vscode");
const projectList_1 = require("../../src/workspace/projectList");
function showProjectQuickPick() {
    return projectList_1.promiseList().then((projects) => {
        return Promise.map(projects, buildQuickPickProject)
            .then(vscode_1.window.showQuickPick);
    });
}
exports.showProjectQuickPick = showProjectQuickPick;
function buildQuickPickProject(project) {
    return {
        description: project.workspace,
        detail: project.path,
        label: project.name,
        path: project.path
    };
}
function openProject(projectItem) {
    if (projectItem) {
        let projectUri = vscode_1.Uri.parse(projectItem.path);
        return vscode_1.commands.executeCommand('vscode.openFolder', projectUri).then(null, console.error);
    }
    else {
        console.warn('MavensMate: No project selected');
        return;
    }
}
exports.openProject = openProject;
function showProjectListAndOpen() {
    return showProjectQuickPick().then(openProject);
}
exports.showProjectListAndOpen = showProjectListAndOpen;
//# sourceMappingURL=projectQuickPick.js.map