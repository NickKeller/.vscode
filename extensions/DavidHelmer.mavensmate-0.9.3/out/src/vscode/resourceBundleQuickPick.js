'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const vscode_1 = require("vscode");
const resourceBundleList_1 = require("../../src/workspace/resourceBundleList");
function showResourceBundleQuickPick() {
    return resourceBundleList_1.promiseList().then((resourceBundles) => {
        if (resourceBundles && resourceBundles.length > 0) {
            return Promise.map(resourceBundles, buildQuickPickResourceBundle)
                .then(vscode_1.window.showQuickPick);
        }
        else {
            return vscode_1.window.showWarningMessage('No Resource Bundles Found');
        }
    });
}
exports.showResourceBundleQuickPick = showResourceBundleQuickPick;
function buildQuickPickResourceBundle(resourceBundle) {
    return {
        description: resourceBundle.name,
        detail: resourceBundle.path,
        label: resourceBundle.name,
        path: resourceBundle.path
    };
}
//# sourceMappingURL=resourceBundleQuickPick.js.map