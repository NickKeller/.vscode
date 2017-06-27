"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("./readDirAsync");
const Promise = require("bluebird");
const vscode = require("vscode");
function promiseList() {
    let resourceBundlesPath = buildResourceBundlesPath();
    let listResourceBundlesInWorkspace = fs.readdir(resourceBundlesPath)
        .then(resourceBundlesFromFileList);
    return listResourceBundlesInWorkspace;
}
exports.promiseList = promiseList;
function buildResourceBundlesPath() {
    let workspaceRoot = vscode.workspace.rootPath;
    let resourceBundlesPath = path.join(workspaceRoot, 'resource-bundles');
    return resourceBundlesPath;
}
function resourceBundlesFromFileList(fileList) {
    let resourceBundles = [];
    for (let fileName of fileList) {
        if (isResourceBundle(fileName)) {
            resourceBundles.push(getResourceBundleFrom(fileName));
        }
    }
    return Promise.all(resourceBundles);
}
function isResourceBundle(fileName) {
    return !fileName.startsWith('.');
}
function getResourceBundleFrom(fileName) {
    let resourceBundlesPath = buildResourceBundlesPath();
    let resourceBundlePath = path.join(resourceBundlesPath, fileName);
    let resourceBundleInfo = {
        name: fileName, path: resourceBundlePath
    };
    return Promise.resolve(resourceBundleInfo);
}
//# sourceMappingURL=resourceBundleList.js.map