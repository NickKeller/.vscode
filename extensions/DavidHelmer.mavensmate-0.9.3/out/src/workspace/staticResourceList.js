"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("./readDirAsync");
const Promise = require("bluebird");
const vscode = require("vscode");
function promiseList() {
    let staticResourcesPath = buildStaticResourcesPath();
    let listStaticResourcesInWorkspace = fs.readdir(staticResourcesPath)
        .then(staticResourcesFromFileList);
    return listStaticResourcesInWorkspace;
}
exports.promiseList = promiseList;
function buildStaticResourcesPath() {
    let workspaceRoot = vscode.workspace.rootPath;
    let staticResourcesPath = path.join(workspaceRoot, 'src', 'staticresources');
    return staticResourcesPath;
}
function staticResourcesFromFileList(fileList) {
    let staticResources = [];
    for (let fileName of fileList) {
        if (isStaticResource(fileName)) {
            staticResources.push(getStaticResourceFrom(fileName));
        }
    }
    return Promise.all(staticResources);
}
function isStaticResource(fileName) {
    return !(fileName.startsWith('.') || fileName.includes('-meta.xml'));
}
function getStaticResourceFrom(fileName) {
    let staticResourcesPath = buildStaticResourcesPath();
    let staticResourcePath = path.join(staticResourcesPath, fileName);
    let staticResourceInfo = {
        name: fileName, path: staticResourcePath
    };
    return Promise.resolve(staticResourceInfo);
}
//# sourceMappingURL=staticResourceList.js.map