'use strict';
const vscode = require('vscode');
const apexToolingService_1 = require('./lib/apexToolingService');
const apexCompletionProvider_1 = require('./lib/apexCompletionProvider');
const vfCompletionProvider_1 = require('./lib/vfCompletionProvider');
const apexDefinitionProvider_1 = require('./lib/apexDefinitionProvider');
const apexDocumentSymbolProvider_1 = require('./lib/apexDocumentSymbolProvider');
const docCommentCommand_1 = require('./lib/docCommentCommand');
const apexDocGenerator_1 = require('./lib/apexDocGenerator');
const syntaxCheck_1 = require('./lib/syntaxCheck');
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel('Apex Autocomplete +');
    let toolingService = new apexToolingService_1.ApexToolingService(context, outputChannel);
    toolingService.startService();
    //setup commands
    context.subscriptions.push(vscode.commands.registerCommand('apex-autocomplete.showOutput', () => {
        outputChannel.show();
    }));
    vscode.languages.registerCompletionItemProvider('apex', new apexCompletionProvider_1.ApexCompletionItemProvider(toolingService), '.', '@');
    vscode.languages.registerCompletionItemProvider('visualforce', new vfCompletionProvider_1.VfCompletionItemProvider(), '<');
    vscode.languages.registerDefinitionProvider('apex', new apexDefinitionProvider_1.ApexDefinitionProvider(toolingService));
    vscode.languages.registerDocumentSymbolProvider('apex', new apexDocumentSymbolProvider_1.ApexDocumentSymbolProvider());
    let config = vscode.workspace.getConfiguration('apexAutoComplete');
    //Setup Check Syntax
    if (config.get('checkSyntax')) {
        const collection = vscode.languages.createDiagnosticCollection('apex-syntax');
        let delay = config.get('checkSyntaxDelay');
        let syntax = new syntaxCheck_1.ApexSyntax(toolingService, collection, delay);
        //register onchange
        vscode.workspace.onDidChangeTextDocument((changeEvent) => {
            if (changeEvent.document.languageId == 'apex') {
                syntax.checkSyntax(changeEvent.document, collection);
                return undefined;
            }
        });
        //cleanup on close
        vscode.workspace.onDidCloseTextDocument((textDocument) => {
            collection.delete(textDocument.uri);
        });
    }
    //setup doc generator
    let docGen;
    switch (config.get('docGenerationFormat')) {
        case 'javadoc':
            docGen = new apexDocGenerator_1.JavaDocGenerator();
            break;
        default:
            docGen = new apexDocGenerator_1.ApexDocGenerator();
            break;
    }
    if (docGen) {
        context.subscriptions.push(vscode.commands.registerTextEditorCommand('salesforce-language-support.generateComment', (textEditor, edit, args) => {
            let docGenerator = new docCommentCommand_1.DocumentCommentCommand(textEditor, docGen);
            return docGenerator.generateDocComment();
        }));
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map