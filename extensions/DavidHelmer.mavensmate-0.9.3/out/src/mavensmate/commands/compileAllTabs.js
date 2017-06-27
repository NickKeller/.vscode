"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const clientCommand_1 = require("./clientCommand");
const compileResponseHandler_1 = require("../handlers/compileResponseHandler");
const vscode = require("vscode");
let languagesToCompileOnSave = new Set(['apex', 'visualforce', 'xml', 'javascript']);
class CompileAllTabs extends clientCommand_1.ClientCommand {
    static create() {
        return new CompileAllTabs();
    }
    constructor() {
        super('Compile All Tabs', 'compile-metadata');
        this.async = true;
        this.body.args.ui = false;
    }
    execute(selectedResource) {
        return this.getOpenEditors().then((editors) => {
            let filesToSave = [];
            for (let i = 0; i < editors.length; i++) {
                let editor = editors[i];
                if (this.validPath(editor)) {
                    filesToSave.push(editor.document.fileName);
                }
            }
            this.body.paths = filesToSave;
            return super.execute();
        });
    }
    onStart() {
        return super.onStart()
            .then(() => {
            for (let i = 0; i < this.body.paths.length; i++) {
                this.mavensMateChannel.appendLine(this.body.paths[i]);
            }
        });
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => compileResponseHandler_1.handleCompileResponse(response));
    }
    // Hack to get all open tabs.  Taken from:
    //  https://github.com/eamodio/vscode-restore-editors/blob/master/src/documentManager.ts#L43
    getOpenEditors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const active = vscode.window.activeTextEditor;
                const editorTracker = new ActiveEditorTracker();
                let editor = active;
                const openEditors = [];
                do {
                    openEditors.push(editor);
                    vscode.commands.executeCommand('workbench.action.nextEditor');
                    editor = yield editorTracker.wait();
                    console.log(editor);
                } while (active.document.fileName != editor.document.fileName);
                editorTracker.dispose();
                return openEditors;
            }
            catch (ex) {
            }
        });
    }
    validPath(editor) {
        if (!languagesToCompileOnSave.has(editor.document.languageId)) {
            return false;
        }
        else if (editor.document.fileName.includes('apex-scripts')) {
            return false;
        }
        else if (editor.document.fileName.includes('resource-bundles')) {
            return false;
        }
        else {
            return true;
        }
    }
}
class ActiveEditorTracker extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this._disposable = vscode.window.onDidChangeActiveTextEditor(e => this._resolver(e));
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    wait() {
        return new Promise((resolve, reject) => this._resolver = resolve);
    }
}
module.exports = CompileAllTabs;
//# sourceMappingURL=compileAllTabs.js.map