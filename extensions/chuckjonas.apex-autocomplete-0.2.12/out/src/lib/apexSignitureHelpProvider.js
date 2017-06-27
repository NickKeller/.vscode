"use strict";
const vscode_1 = require('vscode');
class ApexSignatureHelpProvider {
    constructor(apexCompletionItemProvider, apexDefinitionProvider) {
        this.apexDefinitionProvider = apexDefinitionProvider;
        this.apexCompletionItemProvider = apexCompletionItemProvider;
    }
    provideSignatureHelp(document, position, token) {
        return new Promise((res) => {
            let line = document.lineAt(position.line);
            let sigToCurser = line.text.substring(0, position.character);
            if (this.getFirstOpenAndClosed(sigToCurser) == sigToCurser.indexOf('(')) {
                return res(null);
            }
            let lastOpenNotClosed = this.getLastOpenNotClosed(sigToCurser);
            let sigPosition = new vscode_1.Position(line.lineNumber, lastOpenNotClosed);
            this.apexDefinitionProvider.provideDefinition(document, sigPosition, token).then((results) => {
                let help = new vscode_1.SignatureHelp();
                help.signatures = [];
                results.forEach(def => {
                    if (def.identity.indexOf('(') == -1) {
                        return;
                    }
                    let sigInfo = new vscode_1.SignatureInformation(def.identity.replace('( ', '('));
                    let params = sigInfo.label.substr(sigInfo.label.indexOf('(')).replace(')', '').trim().split(',').map((value) => {
                        return new vscode_1.ParameterInformation(value);
                    });
                    sigInfo.parameters = params;
                    help.signatures.push(sigInfo);
                });
                if (help.signatures.length == 0) {
                    return res(null);
                }
                let paramCount = this.parseParamCount(sigToCurser.substr(lastOpenNotClosed + 1));
                help.activeSignature = 0;
                help.activeParameter = paramCount - 1;
                res(help);
            });
        });
    }
    getLastOpenNotClosed(str) {
        let arr = [];
        for (var i = 0, l = str.length; i < l; i++) {
            var c = str.charAt(i);
            if (c == '(') {
                arr.push(i);
            }
            if (c == ')') {
                arr.pop();
            }
        }
        return arr[arr.length - 1];
    }
    getFirstOpenAndClosed(str) {
        let opened = [];
        let closed = [];
        var level = 0;
        for (var i = 0, l = str.length; i < l; i++) {
            var c = str.charAt(i);
            if (c == '(') {
                opened.push(i);
            }
            if (c == ')') {
                closed.push(i);
            }
        }
        if (opened.length >= closed.length) {
            return opened[opened.length - closed.length];
        }
        return null;
    }
    parseParamCount(str) {
        var ary = str.split(',');
        var tokenLevel = 0;
        var count = 0;
        var level = 0;
        for (var i = 0, l = ary.length; i < l; i++) {
            var token = ary[i];
            // if token has '(', add level
            if (token.indexOf('(') >= 0) {
                // add token count when tokenLevel equals level
                if (tokenLevel === level)
                    count++;
                tokenLevel++;
            }
            // get nth level tokens
            if (tokenLevel === level)
                count++;
            // calc ')' length in token, then decrease level by that
            var endBracketMatch = token.match(/\)/g);
            if (endBracketMatch) {
                tokenLevel -= endBracketMatch.length;
            }
        }
        return count;
    }
}
exports.ApexSignatureHelpProvider = ApexSignatureHelpProvider;
//# sourceMappingURL=apexSignitureHelpProvider.js.map