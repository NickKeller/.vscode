"use strict";
const vscode_1 = require('vscode');
const apex_parser_ts_1 = require('apex-parser-ts');
const os_1 = require('os');
class DocumentCommentCommand {
    constructor(textEditor, commentGenerator) {
        this.textEditor = textEditor;
        this.commentGenerator = commentGenerator;
    }
    generateDocComment() {
        let line = this.textEditor.selection.start.line + 1;
        let fileName;
        let symbolExtractor = new apex_parser_ts_1.ExtractSymbols();
        let readSymbols = symbolExtractor.findSymbolsFromString(this.textEditor.document.getText());
        //get closest symbol
        let BreakException = {};
        try {
            readSymbols.symbolTable.symbols.forEach(sym => {
                if (sym.source.start.line <= line && sym.source.stop.line >= line) {
                    let comment;
                    if (sym.symbolType == 'method') {
                        comment = this.commentGenerator.generateMethodDoc(sym);
                    }
                    else if (sym.symbolType == 'constructor') {
                        comment = this.commentGenerator.generateConstructorDoc(sym);
                    }
                    else if (sym.symbolType == 'field') {
                        comment = this.commentGenerator.generatePropertyComment(sym);
                    }
                    else if (sym.symbolType == 'class' && sym.source.start.line == line) {
                        comment = this.commentGenerator.generatePropertyComment(sym);
                    }
                    if (comment) {
                        this.writeComment(comment, sym.source.start.line - 2);
                        throw BreakException;
                    }
                }
            });
        }
        catch (e) {
            if (e !== BreakException)
                throw e;
        }
    }
    writeComment(body, insertLine) {
        let insertColumn = this.textEditor.document.lineAt(insertLine).range.end.character;
        let padLength = this.textEditor.document.lineAt(insertLine + 1).firstNonWhitespaceCharacterIndex;
        let pad = this.generateWhitespace(padLength);
        if (body.length > 0) {
            let comment = `${os_1.EOL}${pad}${body.shift()}${os_1.EOL}`;
            for (let i = 0; i < body.length; i++) {
                if (i == body.length - 1) {
                    comment += ` ${pad}${body[i]}`;
                }
                else {
                    comment += ` ${pad}${body[i]}${os_1.EOL}`;
                }
            }
            this.textEditor.edit((edit) => {
                edit.insert(new vscode_1.Position(insertLine, insertColumn), comment);
            });
        }
    }
    generateWhitespace(length) {
        let s = '';
        for (let i = 0; i < length; i++) {
            s += ' ';
        }
        return s;
    }
}
exports.DocumentCommentCommand = DocumentCommentCommand;
//# sourceMappingURL=docCommentCommand.js.map