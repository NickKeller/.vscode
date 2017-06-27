"use strict";
const vscode = require('vscode');
class ApexCompletionItemProvider {
    constructor(toolingService) {
        this.toolingService = toolingService;
    }
    /**
     * Provide completion items for the given position and document.
     *
     * @param document The document in which the command was invoked.
     * @param position The position at which the command was invoked.
     * @param token A cancellation token.
     * @return An array of completions, a [completion list](#CompletionList), or a thenable that resolves to either.
     * The lack of a result can be signaled by returning `undefined`, `null`, or an empty array.
     */
    provideCompletionItems(document, position, token) {
        return this.toolingService.listCompletions(document, position)
            .then((data) => {
            return new Promise((resolve, reject) => {
                console.log(data);
                let cleanData = data.replace('RESULT=SUCCESS', '');
                let parts = cleanData.split('\n');
                let completions = new Array();
                for (let i = 0; i < parts.length; i++) {
                    try {
                        let obj = JSON.parse(parts[i]);
                        let completion = this.createCompletion(obj);
                        completions.push(completion);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                resolve(completions);
            });
        });
    }
    createCompletion(obj) {
        let kind;
        let label;
        let insertText;
        let documentation;
        if (obj.type == 'Annotation') {
            label = obj.identity;
            insertText = obj.identity;
            kind = vscode.CompletionItemKind.Value;
            documentation = obj.doc;
        }
        else if (!obj.signature.startsWith('private') && !obj.signature.startsWith('public') && !obj.signature.startsWith('global') && !obj.signature.startsWith('protected') && !obj.signature.startsWith('static')) {
            label = obj.identity;
            insertText = obj.identity;
            kind = vscode.CompletionItemKind.Field;
            documentation = `${obj.signature}: ${obj.doc}`;
        }
        else {
            obj.signature = obj.signature.replace('( ', '(');
            if (obj.doc) {
                documentation = obj.doc;
            }
            else {
                documentation = obj.signature;
            }
            const extractFuncRegex = /\b[^()]+(\(.*\))$/g;
            let funcMatch = extractFuncRegex.exec(obj.signature);
            let params;
            if (funcMatch !== null) {
                params = funcMatch[1].trim();
            }
            if (params) {
                label = `${obj.identity}${params}: ${obj.type}`;
                insertText = `${obj.identity}${params}`;
                if (obj.visibility == 'public' || obj.visibility == 'global') {
                    kind = vscode.CompletionItemKind.Method;
                }
                else {
                    kind = vscode.CompletionItemKind.Function;
                }
            }
            else {
                label = `${obj.identity}: ${obj.type}`;
                insertText = obj.identity;
                if (obj.visibility == 'public' || obj.visibility == 'global') {
                    kind = vscode.CompletionItemKind.Property;
                }
                else {
                    kind = vscode.CompletionItemKind.Field;
                }
            }
        }
        let completion = new vscode.CompletionItem(label, kind);
        completion.insertText = insertText;
        completion.documentation = documentation;
        return completion;
    }
}
exports.ApexCompletionItemProvider = ApexCompletionItemProvider;
class CompletionResult {
}
//# sourceMappingURL=apexCompletionProvider.js.map