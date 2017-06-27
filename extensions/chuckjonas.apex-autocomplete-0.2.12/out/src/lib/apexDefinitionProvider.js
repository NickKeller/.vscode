"use strict";
const vscode = require('vscode');
const path = require('path');
class ApexDefinitionProvider {
    constructor(toolingService) {
        this.toolingService = toolingService;
    }
    /**
     * Provide the definition of the symbol at the given position and document.
     *
     * @param document The document in which the command was invoked.
     * @param position The position at which the command was invoked.
     * @param token A cancellation token.
     * @return A definition or a thenable that resolves to such. The lack of a result can be
     * signaled by returning `undefined` or `null`.
     */
    provideDefinition(document, position, token) {
        return this.toolingService.findSymbol(document, position)
            .then((data) => {
            return new Promise((resolve, reject) => {
                try {
                    let cleanData = data.replace('RESULT=SUCCESS', '');
                    let obj = JSON.parse(cleanData)[0];
                    if (obj.filePath.indexOf(this.toolingService.tempFolder) >= 0) {
                        obj.filePath = document.fileName;
                    }
                    let def = new vscode.Location(vscode.Uri.file(path.normalize(obj.filePath)), new vscode.Range(obj.line - 1, obj.column, obj.line, obj.column));
                    resolve(def);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
exports.ApexDefinitionProvider = ApexDefinitionProvider;
//# sourceMappingURL=apexDefinitionProvider.js.map