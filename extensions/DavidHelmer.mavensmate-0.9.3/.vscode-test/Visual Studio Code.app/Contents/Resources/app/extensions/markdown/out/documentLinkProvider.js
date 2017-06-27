/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode = require("vscode");
var path = require("path");
var MarkdownDocumentLinkProvider = (function () {
    function MarkdownDocumentLinkProvider() {
        this._linkPattern = /(\[[^\]]*\]\(\s*?)([^\s\)]+?)(\s+[^\)]+)?\)/g;
    }
    MarkdownDocumentLinkProvider.prototype.provideDocumentLinks = function (document, _token) {
        var results = [];
        var base = path.dirname(document.uri.fsPath);
        var text = document.getText();
        this._linkPattern.lastIndex = 0;
        var match;
        while ((match = this._linkPattern.exec(text))) {
            var pre = match[1];
            var link = match[2];
            var offset = (match.index || 0) + pre.length;
            var linkStart = document.positionAt(offset);
            var linkEnd = document.positionAt(offset + link.length);
            try {
                results.push(new vscode.DocumentLink(new vscode.Range(linkStart, linkEnd), this.normalizeLink(document, link, base)));
            }
            catch (e) {
            }
        }
        return results;
    };
    MarkdownDocumentLinkProvider.prototype.normalizeLink = function (document, link, base) {
        var uri = vscode.Uri.parse(link);
        if (uri.scheme) {
            return uri;
        }
        // assume it must be a file
        var resourcePath;
        if (!uri.path) {
            resourcePath = document.uri.path;
        }
        else if (uri.path[0] === '/') {
            resourcePath = path.join(vscode.workspace.rootPath || '', uri.path);
        }
        else {
            resourcePath = path.join(base, uri.path);
        }
        return vscode.Uri.parse("command:_markdown.openDocumentLink?" + encodeURIComponent(JSON.stringify({ fragment: uri.fragment, path: resourcePath })));
    };
    return MarkdownDocumentLinkProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarkdownDocumentLinkProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/markdown/out/documentLinkProvider.js.map
