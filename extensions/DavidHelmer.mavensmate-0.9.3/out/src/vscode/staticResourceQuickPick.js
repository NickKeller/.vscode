'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const vscode_1 = require("vscode");
const staticResourceList_1 = require("../../src/workspace/staticResourceList");
function showStaticResourceQuickPick() {
    return staticResourceList_1.promiseList().then((staticResources) => {
        return Promise.map(staticResources, buildQuickPickStaticResource)
            .then(vscode_1.window.showQuickPick);
    });
}
exports.showStaticResourceQuickPick = showStaticResourceQuickPick;
function buildQuickPickStaticResource(staticResource) {
    return {
        description: staticResource.name,
        detail: staticResource.path,
        label: staticResource.name,
        path: staticResource.path
    };
}
//# sourceMappingURL=staticResourceQuickPick.js.map