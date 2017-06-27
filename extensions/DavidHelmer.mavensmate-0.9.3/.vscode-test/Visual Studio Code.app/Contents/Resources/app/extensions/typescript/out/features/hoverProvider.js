/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
const vscode_1 = require("vscode");
class TypeScriptHoverProvider {
    constructor(client) {
        this.client = client;
    }
    provideHover(document, position, token) {
        const filepath = this.client.normalizePath(document.uri);
        if (!filepath) {
            return Promise.resolve(null);
        }
        const args = {
            file: filepath,
            line: position.line + 1,
            offset: position.character + 1
        };
        return this.client.execute('quickinfo', args, token).then((response) => {
            if (response && response.body) {
                const data = response.body;
                return new vscode_1.Hover([{ language: 'typescript', value: data.displayString }, data.documentation], new vscode_1.Range(data.start.line - 1, data.start.offset - 1, data.end.line - 1, data.end.offset - 1));
            }
            return undefined;
        }, (err) => {
            this.client.error(`'quickinfo' request failed with error.`, err);
            return null;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeScriptHoverProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/typescript/out/features/hoverProvider.js.map
