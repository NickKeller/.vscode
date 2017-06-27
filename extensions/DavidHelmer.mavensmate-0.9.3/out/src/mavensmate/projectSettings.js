"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const file = require("../workspace/jsonFile");
class ProjectSettings {
    static getProjectSettings(projectPath) {
        projectPath = workspaceRootIfBlank(projectPath);
        if (projectPath && !ProjectSettings._instances[projectPath]) {
            let settingsPath = buildSettingsPath(projectPath);
            console.info(`Retrieving settings at path:  ${settingsPath}`);
            ProjectSettings._instances[projectPath] = file.open(settingsPath);
        }
        return ProjectSettings._instances[projectPath];
    }
    static hasProjectSettings(projectPath) {
        projectPath = workspaceRootIfBlank(projectPath);
        if (!ProjectSettings._instances[projectPath]) {
            ProjectSettings.getProjectSettings(projectPath);
        }
        return ProjectSettings._instances[projectPath] !== null
            && ProjectSettings._instances[projectPath] !== undefined;
    }
}
ProjectSettings._instances = {};
exports.ProjectSettings = ProjectSettings;
function workspaceRootIfBlank(projectPath) {
    return projectPath || vscode.workspace.rootPath;
}
function buildSettingsPath(projectPath) {
    return path.join(projectPath, 'config', '.settings');
}
//# sourceMappingURL=projectSettings.js.map