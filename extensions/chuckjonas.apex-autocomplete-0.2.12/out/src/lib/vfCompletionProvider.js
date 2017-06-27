"use strict";
const vscode = require('vscode');
const vf = require('./visualForce');
//there's gotta be a better way to do this...  Seems to work surprisingly well tho
class VfCompletionItemProvider {
    constructor() {
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
        let completions = new Array();
        let i = position.line;
        let lastOpenTag = -1;
        while (lastOpenTag == -1) {
            if (i < 0) {
                break;
            }
            let line = document.lineAt(i).text;
            if (position.line == i) {
                line = line.substr(0, position.character);
            }
            lastOpenTag = line.lastIndexOf('<');
            let lastCloseTag = line.lastIndexOf('>');
            let isOutside = false;
            if (line.charAt(lastCloseTag - 1) == '/') {
                isOutside = true;
            }
            let lastTagApex = line.lastIndexOf('<apex:');
            if (lastOpenTag != -1 && lastOpenTag > lastCloseTag) {
                if (lastTagApex == lastOpenTag) {
                    let apexTag = this.getApexTag(line, lastTagApex);
                    return this.showTagAttributes(apexTag);
                }
                else {
                    if (lastOpenTag == position.character - 1 && line.substr(lastOpenTag, lastOpenTag + 1) != ' ') {
                        break;
                    }
                    return null;
                }
            }
            i--;
        }
        return this.showApexTags(document, position);
    }
    getApexTag(line, start) {
        let tagObj;
        let lastTag = line.substr(start, line.length);
        if (lastTag.indexOf(' ') != -1) {
            lastTag = lastTag.substring(0, lastTag.indexOf(' ')).replace('<', '');
            tagObj = vf.definition[lastTag];
        }
        return tagObj;
    }
    showTagAttributes(apexTag) {
        let completions = new Array();
        if (apexTag) {
            for (var key in apexTag.attribs) {
                if (apexTag.attribs.hasOwnProperty(key)) {
                    var attr = apexTag.attribs[key];
                    let completion = new vscode.CompletionItem(`${key}: ${attr.type}`, vscode.CompletionItemKind.Field);
                    completion.insertText = `${key}="${attr.type}"`;
                    completions.push(completion);
                }
            }
        }
        return completions;
    }
    showApexTags(document, position) {
        let completions = new Array();
        for (var key in vf.definition) {
            if (vf.definition.hasOwnProperty(key)) {
                var element = vf.definition[key];
                let completion = new vscode.CompletionItem(key, vscode.CompletionItemKind.Keyword);
                let preCharacter = document.getText(new vscode.Range(position.translate(0, -1), position));
                if (preCharacter != '<') {
                    completion.insertText = `<${key}`;
                }
                if (element.documentation) {
                    completion.documentation = element.documentation;
                }
                completions.push(completion);
            }
        }
        return completions;
    }
}
exports.VfCompletionItemProvider = VfCompletionItemProvider;
//# sourceMappingURL=vfCompletionProvider.js.map