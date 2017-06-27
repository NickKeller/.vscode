/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode = require("vscode");
var path = require("path");
var vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
var markdownEngine_1 = require("./markdownEngine");
var documentLinkProvider_1 = require("./documentLinkProvider");
var documentSymbolProvider_1 = require("./documentSymbolProvider");
var previewContentProvider_1 = require("./previewContentProvider");
var tableOfContentsProvider_1 = require("./tableOfContentsProvider");
var nls = require("vscode-nls");
var localize = nls.loadMessageBundle(__filename);
var PreviewSecuritySelection;
(function (PreviewSecuritySelection) {
    PreviewSecuritySelection[PreviewSecuritySelection["None"] = 0] = "None";
    PreviewSecuritySelection[PreviewSecuritySelection["DisableEnhancedSecurityForWorkspace"] = 1] = "DisableEnhancedSecurityForWorkspace";
    PreviewSecuritySelection[PreviewSecuritySelection["EnableEnhancedSecurityForWorkspace"] = 2] = "EnableEnhancedSecurityForWorkspace";
})(PreviewSecuritySelection || (PreviewSecuritySelection = {}));
var ExtensionContentSecurityPolicyArbiter = (function () {
    function ExtensionContentSecurityPolicyArbiter(globalState) {
        this.globalState = globalState;
        this.key = 'trusted_preview_workspace:';
    }
    ExtensionContentSecurityPolicyArbiter.prototype.isEnhancedSecurityDisableForWorkspace = function () {
        return this.globalState.get(this.key + vscode.workspace.rootPath, false);
    };
    ExtensionContentSecurityPolicyArbiter.prototype.addTrustedWorkspace = function (rootPath) {
        return this.globalState.update(this.key + rootPath, true);
    };
    ExtensionContentSecurityPolicyArbiter.prototype.removeTrustedWorkspace = function (rootPath) {
        return this.globalState.update(this.key + rootPath, false);
    };
    return ExtensionContentSecurityPolicyArbiter;
}());
var resolveExtensionResources = function (extension, stylePath) {
    var resource = vscode.Uri.parse(stylePath);
    if (resource.scheme) {
        return resource;
    }
    return vscode.Uri.file(path.join(extension.extensionPath, stylePath));
};
var telemetryReporter;
function activate(context) {
    var packageInfo = getPackageInfo();
    telemetryReporter = packageInfo && new vscode_extension_telemetry_1.default(packageInfo.name, packageInfo.version, packageInfo.aiKey);
    if (telemetryReporter) {
        context.subscriptions.push(telemetryReporter);
    }
    var cspArbiter = new ExtensionContentSecurityPolicyArbiter(context.globalState);
    var engine = new markdownEngine_1.MarkdownEngine();
    var contentProvider = new previewContentProvider_1.MDDocumentContentProvider(engine, context, cspArbiter);
    var contentProviderRegistration = vscode.workspace.registerTextDocumentContentProvider('markdown', contentProvider);
    if (vscode.workspace.getConfiguration('markdown').get('enableExperimentalExtensionApi', false)) {
        var _loop_1 = function (extension) {
            var contributes = extension.packageJSON && extension.packageJSON.contributes;
            if (!contributes) {
                return "continue";
            }
            var styles = contributes['markdown.preview'] && contributes['markdown.preview'].styles;
            if (styles) {
                if (!Array.isArray(styles)) {
                    styles = [styles];
                }
                for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                    var style = styles_1[_i];
                    try {
                        contentProvider.addStyle(resolveExtensionResources(extension, style));
                    }
                    catch (e) {
                    }
                }
            }
            var scripts = contributes['markdown.preview'] && contributes['markdown.preview'].scripts;
            if (scripts) {
                if (!Array.isArray(scripts)) {
                    scripts = [scripts];
                }
                for (var _a = 0, scripts_1 = scripts; _a < scripts_1.length; _a++) {
                    var script = scripts_1[_a];
                    try {
                        contentProvider.addScript(resolveExtensionResources(extension, script));
                    }
                    catch (e) {
                    }
                }
            }
            if (contributes['markdownit.plugins']) {
                extension.activate().then(function () {
                    if (extension.exports && extension.exports.extendMarkdownIt) {
                        engine.addPlugin(function (md) { return extension.exports.extendMarkdownIt(md); });
                    }
                });
            }
        };
        for (var _i = 0, _a = vscode.extensions.all; _i < _a.length; _i++) {
            var extension = _a[_i];
            _loop_1(extension);
        }
    }
    var symbolsProvider = new documentSymbolProvider_1.default(engine);
    var symbolsProviderRegistration = vscode.languages.registerDocumentSymbolProvider({ language: 'markdown' }, symbolsProvider);
    context.subscriptions.push(contentProviderRegistration, symbolsProviderRegistration);
    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('markdown', new documentLinkProvider_1.default()));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showPreview', showPreview));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showPreviewToSide', function (uri) { return showPreview(uri, true); }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showSource', showSource));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.revealLine', function (uri, line) {
        var sourceUri = vscode.Uri.parse(decodeURIComponent(uri));
        vscode.window.visibleTextEditors
            .filter(function (editor) { return previewContentProvider_1.isMarkdownFile(editor.document) && editor.document.uri.fsPath === sourceUri.fsPath; })
            .forEach(function (editor) {
            var sourceLine = Math.floor(line);
            var text = editor.document.getText(new vscode.Range(sourceLine, 0, sourceLine + 1, 0));
            var fraction = line - Math.floor(line);
            var start = Math.floor(fraction * text.length);
            editor.revealRange(new vscode.Range(sourceLine, start, sourceLine + 1, 0), vscode.TextEditorRevealType.AtTop);
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.didClick', function (uri, line) {
        var sourceUri = vscode.Uri.parse(decodeURIComponent(uri));
        return vscode.workspace.openTextDocument(sourceUri)
            .then(function (document) { return vscode.window.showTextDocument(document); })
            .then(function (editor) { return vscode.commands.executeCommand('revealLine', { lineNumber: Math.floor(line), at: 'center' }).then(function () { return editor; }); })
            .then(function (editor) {
            if (editor) {
                editor.selection = new vscode.Selection(new vscode.Position(Math.floor(line), 0), new vscode.Position(Math.floor(line), 0));
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.openDocumentLink', function (args) {
        var tryRevealLine = function (editor) {
            if (editor && args.fragment) {
                var toc = new tableOfContentsProvider_1.TableOfContentsProvider(engine, editor.document);
                var line = toc.lookup(args.fragment);
                if (!isNaN(line)) {
                    return editor.revealRange(new vscode.Range(line, 0, line, 0), vscode.TextEditorRevealType.AtTop);
                }
            }
        };
        if (vscode.window.activeTextEditor && previewContentProvider_1.isMarkdownFile(vscode.window.activeTextEditor.document) && vscode.window.activeTextEditor.document.uri.fsPath === args.path) {
            return tryRevealLine(vscode.window.activeTextEditor);
        }
        else {
            var resource_1 = vscode.Uri.file(args.path);
            vscode.workspace.openTextDocument(resource_1)
                .then(vscode.window.showTextDocument)
                .then(tryRevealLine, function (_) { return vscode.commands.executeCommand('vscode.open', resource_1); });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showPreviewSecuritySelector', function (resource) {
        var workspacePath = vscode.workspace.rootPath || resource;
        if (!workspacePath) {
            return;
        }
        var sourceUri = null;
        if (resource) {
            sourceUri = vscode.Uri.parse(decodeURIComponent(resource));
        }
        if (!sourceUri && vscode.window.activeTextEditor) {
            var activeDocument = vscode.window.activeTextEditor.document;
            if (activeDocument.uri.scheme === 'markdown') {
                sourceUri = activeDocument.uri;
            }
            else {
                sourceUri = previewContentProvider_1.getMarkdownUri(activeDocument.uri);
            }
        }
        vscode.window.showQuickPick([
            {
                id: PreviewSecuritySelection.EnableEnhancedSecurityForWorkspace,
                label: localize(0, null),
                description: '',
                detail: cspArbiter.isEnhancedSecurityDisableForWorkspace()
                    ? ''
                    : localize(1, null)
            }, {
                id: PreviewSecuritySelection.DisableEnhancedSecurityForWorkspace,
                label: localize(2, null),
                description: '',
                detail: cspArbiter.isEnhancedSecurityDisableForWorkspace()
                    ? localize(3, null)
                    : ''
            },
        ], {
            placeHolder: localize(4, null),
        }).then(function (selection) {
            if (!workspacePath) {
                return false;
            }
            switch (selection && selection.id) {
                case PreviewSecuritySelection.DisableEnhancedSecurityForWorkspace:
                    return cspArbiter.addTrustedWorkspace(workspacePath).then(function () { return true; });
                case PreviewSecuritySelection.EnableEnhancedSecurityForWorkspace:
                    return cspArbiter.removeTrustedWorkspace(workspacePath).then(function () { return true; });
            }
            return false;
        }).then(function (shouldUpdate) {
            if (shouldUpdate && sourceUri) {
                contentProvider.update(sourceUri);
            }
        });
    }));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(function (document) {
        if (previewContentProvider_1.isMarkdownFile(document)) {
            var uri = previewContentProvider_1.getMarkdownUri(document.uri);
            contentProvider.update(uri);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(function (event) {
        if (previewContentProvider_1.isMarkdownFile(event.document)) {
            var uri = previewContentProvider_1.getMarkdownUri(event.document.uri);
            contentProvider.update(uri);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(function () {
        vscode.workspace.textDocuments.forEach(function (document) {
            if (document.uri.scheme === 'markdown') {
                // update all generated md documents
                contentProvider.update(document.uri);
            }
        });
    }));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(function (event) {
        if (previewContentProvider_1.isMarkdownFile(event.textEditor.document)) {
            vscode.commands.executeCommand('_workbench.htmlPreview.postMessage', previewContentProvider_1.getMarkdownUri(event.textEditor.document.uri), {
                line: event.selections[0].active.line
            });
        }
    }));
}
exports.activate = activate;
function showPreview(uri, sideBySide) {
    if (sideBySide === void 0) { sideBySide = false; }
    var resource = uri;
    if (!(resource instanceof vscode.Uri)) {
        if (vscode.window.activeTextEditor) {
            // we are relaxed and don't check for markdown files
            resource = vscode.window.activeTextEditor.document.uri;
        }
    }
    if (!(resource instanceof vscode.Uri)) {
        if (!vscode.window.activeTextEditor) {
            // this is most likely toggling the preview
            return vscode.commands.executeCommand('markdown.showSource');
        }
        // nothing found that could be shown or toggled
        return;
    }
    var thenable = vscode.commands.executeCommand('vscode.previewHtml', previewContentProvider_1.getMarkdownUri(resource), getViewColumn(sideBySide), "Preview '" + path.basename(resource.fsPath) + "'");
    if (telemetryReporter) {
        telemetryReporter.sendTelemetryEvent('openPreview', {
            where: sideBySide ? 'sideBySide' : 'inPlace',
            how: (uri instanceof vscode.Uri) ? 'action' : 'pallete'
        });
    }
    return thenable;
}
function getViewColumn(sideBySide) {
    var active = vscode.window.activeTextEditor;
    if (!active) {
        return vscode.ViewColumn.One;
    }
    if (!sideBySide) {
        return active.viewColumn;
    }
    switch (active.viewColumn) {
        case vscode.ViewColumn.One:
            return vscode.ViewColumn.Two;
        case vscode.ViewColumn.Two:
            return vscode.ViewColumn.Three;
    }
    return active.viewColumn;
}
function showSource(mdUri) {
    if (!mdUri) {
        return vscode.commands.executeCommand('workbench.action.navigateBack');
    }
    var docUri = vscode.Uri.parse(mdUri.query);
    for (var _i = 0, _a = vscode.window.visibleTextEditors; _i < _a.length; _i++) {
        var editor = _a[_i];
        if (editor.document.uri.toString() === docUri.toString()) {
            return vscode.window.showTextDocument(editor.document, editor.viewColumn);
        }
    }
    return vscode.workspace.openTextDocument(docUri)
        .then(vscode.window.showTextDocument);
}
function getPackageInfo() {
    var extention = vscode.extensions.getExtension('Microsoft.vscode-markdown');
    if (extention && extention.packageJSON) {
        return {
            name: extention.packageJSON.name,
            version: extention.packageJSON.version,
            aiKey: extention.packageJSON.aiKey
        };
    }
    return null;
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/markdown/out/extension.js.map
