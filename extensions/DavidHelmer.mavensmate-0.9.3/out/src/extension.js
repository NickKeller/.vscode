"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mavensMateMateExtension;
function activate(context) {
    let { MavensMateExtension } = require('./mavensMateExtension');
    mavensMateMateExtension = MavensMateExtension.create(context);
    return mavensMateMateExtension.activate();
}
exports.activate = activate;
function deactivate() {
    mavensMateMateExtension.deactivate();
    mavensMateMateExtension = null;
}
exports.deactivate = deactivate;
process.on("unhandledRejection", function (reason, promise) {
    console.error(`MavensMate Unhandled Exception: ${reason}`);
});
//# sourceMappingURL=extension.js.map