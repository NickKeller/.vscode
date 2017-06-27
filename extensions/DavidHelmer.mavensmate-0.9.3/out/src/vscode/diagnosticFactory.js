"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function buildDiagnosticsByFilePath(componentFailures) {
    let diagnosticsByFilePath = {};
    for (let componentFailure of componentFailures) {
        if (!diagnosticsByFilePath[componentFailure.fullPath]) {
            diagnosticsByFilePath[componentFailure.fullPath] = [];
        }
        let diagnostic = buildDiagnostic(componentFailure);
        diagnosticsByFilePath[componentFailure.fullPath].push(diagnostic);
    }
    return diagnosticsByFilePath;
}
exports.buildDiagnosticsByFilePath = buildDiagnosticsByFilePath;
function buildDiagnostic(componentFailure) {
    let lineNumber = 0;
    let columnNumber = 0;
    if (componentFailure.lineNumber) {
        lineNumber = componentFailure.lineNumber - 1;
    }
    if (componentFailure.columnNumber) {
        columnNumber = componentFailure.columnNumber - 1;
    }
    let start = new vscode_1.Position(lineNumber, columnNumber);
    let end = new vscode_1.Position(lineNumber + 1, 0);
    let range = new vscode_1.Range(start, end);
    if (componentFailure.document) {
        let document = componentFailure.document;
        let wordRange = document.getWordRangeAtPosition(start);
        if (wordRange) {
            range = wordRange;
        }
    }
    let newDiagnostic = new vscode_1.Diagnostic(range, componentFailure.problem);
    return newDiagnostic;
}
exports.buildDiagnostic = buildDiagnostic;
//# sourceMappingURL=diagnosticFactory.js.map