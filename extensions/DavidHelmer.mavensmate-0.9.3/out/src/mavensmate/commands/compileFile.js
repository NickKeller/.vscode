"use strict";
const pathsCommand_1 = require("./pathsCommand");
const compileResponseHandler_1 = require("../handlers/compileResponseHandler");
const vscode = require("vscode");
const Promise = require("bluebird");
let languagesToCompileOnSave = new Set(['apex', 'visualforce', 'xml', 'javascript', 'css']);
class CompileFile extends pathsCommand_1.PathsCommand {
    static create(label) {
        if (!label) {
            label = 'Compile File';
        }
        return new CompileFile(label);
    }
    constructor(label) {
        super(label, 'compile-metadata');
    }
    confirmPath() {
        let uriToOpen = vscode.Uri.file(this.filePath);
        let confirmPromise = vscode.workspace.openTextDocument(uriToOpen)
            .then((textDocument) => {
            if (!languagesToCompileOnSave.has(textDocument.languageId)) {
                return Promise.reject(`Can not compile this file: ${this.filePath}`);
            }
            else if (this.filePath.includes('apex-scripts')) {
                return Promise.reject(`Local Apex Scripts can't be compiled. You can run them with Run Apex Script`);
            }
            else if (this.filePath.includes('resource-bundles')) {
                return Promise.reject(`Files inside Resource Bundles cannot be compiled. Use Deploy Resource Bundle instead`);
            }
            else {
                return super.confirmPath();
            }
        });
        return confirmPromise;
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => compileResponseHandler_1.handleCompileResponse(response));
    }
}
module.exports = CompileFile;
//# sourceMappingURL=compileFile.js.map