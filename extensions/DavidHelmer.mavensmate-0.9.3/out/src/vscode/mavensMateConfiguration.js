"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getConfiguration(key) {
    return vscode_1.workspace.getConfiguration().get(key);
}
exports.getConfiguration = getConfiguration;
//# sourceMappingURL=mavensMateConfiguration.js.map