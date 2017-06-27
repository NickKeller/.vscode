"use strict";
const pathsCommand_1 = require("./pathsCommand");
const ResourceBundleQuickPick = require("../../vscode/resourceBundleQuickPick");
const vscode = require("vscode");
class DeployResourceBundle extends pathsCommand_1.PathsCommand {
    static create() {
        return new DeployResourceBundle();
    }
    constructor() {
        super('Resource Bundle', 'deploy-resource-bundle');
    }
    execute(selectedResource) {
        return ResourceBundleQuickPick.showResourceBundleQuickPick()
            .then((selectedResourceBundle) => {
            let selectedResource = vscode.Uri.file(selectedResourceBundle.path);
            return super.execute(selectedResource);
        });
    }
}
module.exports = DeployResourceBundle;
//# sourceMappingURL=deployResourceBundle.js.map