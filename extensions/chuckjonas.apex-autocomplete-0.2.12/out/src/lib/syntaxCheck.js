"use strict";
const vscode = require('vscode');
class ApexSyntax {
    constructor(toolingService, collection, delay) {
        this.toolingService = toolingService;
        this.collection = collection;
        this.doneTypingInterval = delay;
    }
    checkSyntax(document, collection) {
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
            this.doneTyping(document, collection);
        }, this.doneTypingInterval);
    }
    doneTyping(document, collection) {
        clearTimeout(this.typingTimer);
        this.toolingService.checkSyntax(document)
            .then((data) => {
            console.log(data);
            let cleanData = data.replace('RESULT=SUCCESS', '');
            let parts = cleanData.split('\n');
            let problems = new Array();
            for (let i = 0; i < parts.length; i++) {
                try {
                    let line = parts[i];
                    if (line.startsWith('ERROR:')) {
                        let obj = JSON.parse(line.replace('ERROR:', ''));
                        let problem = new vscode.Diagnostic(new vscode.Range(new vscode.Position(obj.line - 1, obj.column), new vscode.Position(obj.line - 1, 100)), obj.text, vscode.DiagnosticSeverity.Warning);
                        problems.push(problem);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            collection.set(document.uri, problems);
        });
    }
}
exports.ApexSyntax = ApexSyntax;
//# sourceMappingURL=syntaxCheck.js.map