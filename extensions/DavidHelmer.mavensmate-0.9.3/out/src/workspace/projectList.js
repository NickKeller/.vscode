"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("./readDirAsync");
const Promise = require("bluebird");
const mavensMateAppConfig = require("../mavensmate/mavensMateAppConfig");
const projectSettings_1 = require("../mavensmate/projectSettings");
function promiseList() {
    let projects = [];
    let config = mavensMateAppConfig.getConfig();
    for (let workspace of config.mm_workspace) {
        let listProjects = (fileList) => {
            return listProjectsInWorkspaceFileList(workspace, fileList);
        };
        let listProjectsInWorkplace = fs.readdir(workspace)
            .then(listProjects, console.error);
        projects.push(listProjectsInWorkplace);
    }
    return Promise.all(projects).then(flattenToListOfProjects);
}
exports.promiseList = promiseList;
function listProjectsInWorkspaceFileList(workspace, fileList) {
    let projects = [];
    for (let fileName of fileList) {
        if (notHiddenFile(fileName)) {
            projects.push(getProjectFromFileName(workspace, fileName));
        }
    }
    return Promise.all(projects);
}
function notHiddenFile(fileName) {
    return !fileName.startsWith('.');
}
function getProjectFromFileName(workspace, fileName) {
    let projectPath = path.join(workspace, fileName);
    return Promise.resolve().then(() => {
        if (projectSettings_1.ProjectSettings.hasProjectSettings(projectPath)) {
            return { name: fileName, path: projectPath, workspace: baseName(workspace) };
        }
        else {
            console.warn(`MavensMate: No project settings found at ${projectPath}`);
        }
    });
}
function baseName(path) {
    return path.split(/[\\/]/).filter(notBlank).pop();
}
function notBlank(string) {
    return string != null && string.length > 0;
}
function flattenToListOfProjects(listsOfProjects) {
    return Array.prototype.concat.apply([], listsOfProjects).filter(project => project);
}
//# sourceMappingURL=projectList.js.map