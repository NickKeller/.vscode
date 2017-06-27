/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode = require("vscode");
var path = require("path");
var nls = require("vscode-nls");
var localize = nls.loadMessageBundle(__filename);
var previewStrings = {
    cspAlertMessageText: localize(0, null),
    cspAlertMessageTitle: localize(1, null),
    cspAlertMessageLabel: localize(2, null)
};
function isMarkdownFile(document) {
    return document.languageId === 'markdown'
        && document.uri.scheme !== 'markdown'; // prevent processing of own documents
}
exports.isMarkdownFile = isMarkdownFile;
function getMarkdownUri(uri) {
    return uri.with({ scheme: 'markdown', path: uri.path + '.rendered', query: uri.toString() });
}
exports.getMarkdownUri = getMarkdownUri;
var MDDocumentContentProvider = (function () {
    function MDDocumentContentProvider(engine, context, cspArbiter) {
        this.engine = engine;
        this.context = context;
        this.cspArbiter = cspArbiter;
        this._onDidChange = new vscode.EventEmitter();
        this._waiting = false;
        this.extraStyles = [];
        this.extraScripts = [];
    }
    MDDocumentContentProvider.prototype.addScript = function (resource) {
        this.extraScripts.push(resource);
    };
    MDDocumentContentProvider.prototype.addStyle = function (resource) {
        this.extraStyles.push(resource);
    };
    MDDocumentContentProvider.prototype.getMediaPath = function (mediaFile) {
        return vscode.Uri.file(this.context.asAbsolutePath(path.join('media', mediaFile))).toString();
    };
    MDDocumentContentProvider.prototype.isAbsolute = function (p) {
        return path.normalize(p + '/') === path.normalize(path.resolve(p) + '/');
    };
    MDDocumentContentProvider.prototype.fixHref = function (resource, href) {
        if (!href) {
            return href;
        }
        // Use href if it is already an URL
        if (vscode.Uri.parse(href).scheme) {
            return href;
        }
        // Use href as file URI if it is absolute
        if (this.isAbsolute(href)) {
            return vscode.Uri.file(href).toString();
        }
        // use a workspace relative path if there is a workspace
        var rootPath = vscode.workspace.rootPath;
        if (rootPath) {
            return vscode.Uri.file(path.join(rootPath, href)).toString();
        }
        // otherwise look relative to the markdown file
        return vscode.Uri.file(path.join(path.dirname(resource.fsPath), href)).toString();
    };
    MDDocumentContentProvider.prototype.computeCustomStyleSheetIncludes = function (uri) {
        var _this = this;
        var styles = vscode.workspace.getConfiguration('markdown')['styles'];
        if (styles && Array.isArray(styles) && styles.length > 0) {
            return styles.map(function (style) {
                return "<link rel=\"stylesheet\" href=\"" + _this.fixHref(uri, style) + "\" type=\"text/css\" media=\"screen\">";
            }).join('\n');
        }
        return '';
    };
    MDDocumentContentProvider.prototype.getSettingsOverrideStyles = function (nonce) {
        var previewSettings = vscode.workspace.getConfiguration('markdown')['preview'];
        if (!previewSettings) {
            return '';
        }
        var fontFamily = previewSettings.fontFamily, fontSize = previewSettings.fontSize, lineHeight = previewSettings.lineHeight;
        return "<style nonce=\"" + nonce + "\">\n\t\t\tbody {\n\t\t\t\t" + (fontFamily ? "font-family: " + fontFamily + ";" : '') + "\n\t\t\t\t" + (+fontSize > 0 ? "font-size: " + fontSize + "px;" : '') + "\n\t\t\t\t" + (+lineHeight > 0 ? "line-height: " + lineHeight + ";" : '') + "\n\t\t\t}\n\t\t</style>";
    };
    MDDocumentContentProvider.prototype.getStyles = function (uri, nonce) {
        var baseStyles = [
            this.getMediaPath('markdown.css'),
            this.getMediaPath('tomorrow.css')
        ].concat(this.extraStyles.map(function (resource) { return resource.toString(); }));
        return baseStyles.map(function (href) { return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + href + "\">"; }).join('\n') + "\n\t\t\t" + this.getSettingsOverrideStyles(nonce) + "\n\t\t\t" + this.computeCustomStyleSheetIncludes(uri);
    };
    MDDocumentContentProvider.prototype.getScripts = function (nonce) {
        var scripts = [this.getMediaPath('main.js')].concat(this.extraScripts.map(function (resource) { return resource.toString(); }));
        return scripts
            .map(function (source) { return "<script src=\"" + source + "\" nonce=\"" + nonce + "\"></script>"; })
            .join('\n');
    };
    MDDocumentContentProvider.prototype.provideTextDocumentContent = function (uri) {
        var _this = this;
        var sourceUri = vscode.Uri.parse(uri.query);
        return vscode.workspace.openTextDocument(sourceUri).then(function (document) {
            var scrollBeyondLastLine = vscode.workspace.getConfiguration('editor')['scrollBeyondLastLine'];
            var wordWrap = vscode.workspace.getConfiguration('editor')['wordWrap'];
            var markdownConfig = vscode.workspace.getConfiguration('markdown');
            var previewFrontMatter = markdownConfig.get('previewFrontMatter', 'hide');
            var initialLine = 0;
            var editor = vscode.window.activeTextEditor;
            if (editor && editor.document.uri.fsPath === sourceUri.fsPath) {
                initialLine = editor.selection.active.line;
            }
            var initialData = {
                previewUri: encodeURIComponent(uri.toString(true)),
                source: encodeURIComponent(sourceUri.toString(true)),
                line: initialLine,
                scrollPreviewWithEditorSelection: !!markdownConfig.get('preview.scrollPreviewWithEditorSelection', true),
                scrollEditorWithPreview: !!markdownConfig.get('preview.scrollEditorWithPreview', true),
                doubleClickToSwitchToEditor: !!markdownConfig.get('preview.doubleClickToSwitchToEditor', true),
            };
            // Content Security Policy
            var nonce = new Date().getTime() + '' + new Date().getMilliseconds();
            var csp = "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; img-src 'self' http: https: data:; media-src 'self' http: https: data:; child-src 'none'; script-src 'nonce-" + nonce + "'; style-src 'self' 'unsafe-inline' http: https: data:; font-src 'self' http: https: data:;\">";
            if (_this.cspArbiter.isEnhancedSecurityDisableForWorkspace()) {
                csp = '';
            }
            var body = _this.engine.render(sourceUri, previewFrontMatter === 'hide', document.getText());
            return "<!DOCTYPE html>\n\t\t\t\t<html>\n\t\t\t\t<head>\n\t\t\t\t\t<meta http-equiv=\"Content-type\" content=\"text/html;charset=UTF-8\">\n\t\t\t\t\t" + csp + "\n\t\t\t\t\t<meta id=\"vscode-markdown-preview-data\" data-settings=\"" + JSON.stringify(initialData).replace(/"/g, '&quot;') + "\" data-strings=\"" + JSON.stringify(previewStrings).replace(/"/g, '&quot;') + "\">\n\t\t\t\t\t<script src=\"" + _this.getMediaPath('csp.js') + "\" nonce=\"" + nonce + "\"></script>\n\t\t\t\t\t" + _this.getStyles(uri, nonce) + "\n\t\t\t\t\t<base href=\"" + document.uri.toString(true) + "\">\n\t\t\t\t</head>\n\t\t\t\t<body class=\"" + (scrollBeyondLastLine ? 'scrollBeyondLastLine' : '') + " " + (wordWrap ? 'wordWrap' : '') + " " + (!!markdownConfig.get('preview.markEditorSelection') ? 'showEditorSelection' : '') + "\">\n\t\t\t\t\t" + body + "\n\t\t\t\t\t<div class=\"code-line\" data-line=\"" + document.lineCount + "\"></div>\n\t\t\t\t\t" + _this.getScripts(nonce) + "\n\t\t\t\t</body>\n\t\t\t\t</html>";
        });
    };
    Object.defineProperty(MDDocumentContentProvider.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    MDDocumentContentProvider.prototype.update = function (uri) {
        var _this = this;
        if (!this._waiting) {
            this._waiting = true;
            setTimeout(function () {
                _this._waiting = false;
                _this._onDidChange.fire(uri);
            }, 300);
        }
    };
    return MDDocumentContentProvider;
}());
exports.MDDocumentContentProvider = MDDocumentContentProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/markdown/out/previewContentProvider.js.map
