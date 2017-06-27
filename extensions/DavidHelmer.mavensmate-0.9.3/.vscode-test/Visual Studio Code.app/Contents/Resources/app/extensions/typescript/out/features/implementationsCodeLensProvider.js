/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
const vscode_1 = require("vscode");
const PConst = require("../protocol.const");
const baseCodeLensProvider_1 = require("./baseCodeLensProvider");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
class TypeScriptImplementationsCodeLensProvider extends baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider {
    constructor(client) {
        super(client, 'implementationsCodeLens.enabled');
    }
    provideCodeLenses(document, token) {
        if (!this.client.apiVersion.has220Features()) {
            return Promise.resolve([]);
        }
        return super.provideCodeLenses(document, token);
    }
    resolveCodeLens(inputCodeLens, token) {
        const codeLens = inputCodeLens;
        const args = {
            file: codeLens.file,
            line: codeLens.range.start.line + 1,
            offset: codeLens.range.start.character + 1
        };
        return this.client.execute('implementation', args, token).then(response => {
            if (!response || !response.body) {
                throw codeLens;
            }
            const locations = response.body
                .map(reference => new vscode_1.Location(this.client.asUrl(reference.file), new vscode_1.Range(reference.start.line - 1, reference.start.offset - 1, reference.end.line - 1, reference.end.offset - 1)))
                .filter(location => !(location.uri.fsPath === codeLens.document.fsPath &&
                location.range.start.line === codeLens.range.start.line));
            codeLens.command = {
                title: locations.length === 1
                    ? localize(0, null)
                    : localize(1, null, locations.length),
                command: 'editor.action.showReferences',
                arguments: [codeLens.document, codeLens.range.start, locations]
            };
            return codeLens;
        }).catch(() => {
            codeLens.command = {
                title: localize(2, null),
                command: ''
            };
            return codeLens;
        });
    }
    extractSymbol(document, item, _parent) {
        switch (item.kind) {
            case PConst.Kind.interface:
                return super.getSymbolRange(document, item);
            case PConst.Kind.class:
            case PConst.Kind.memberFunction:
            case PConst.Kind.memberVariable:
            case PConst.Kind.memberGetAccessor:
            case PConst.Kind.memberSetAccessor:
                if (item.kindModifiers.match(/\babstract\b/g)) {
                    return super.getSymbolRange(document, item);
                }
                break;
        }
        return null;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeScriptImplementationsCodeLensProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/typescript/out/features/implementationsCodeLensProvider.js.map
