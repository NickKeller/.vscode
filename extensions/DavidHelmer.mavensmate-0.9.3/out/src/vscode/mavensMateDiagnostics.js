"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class MavensMateDiagnostics {
    constructor() {
        this.diagnostics = vscode.languages.createDiagnosticCollection('mavensmate');
    }
    static getInstance() {
        if (MavensMateDiagnostics._instance == null) {
            MavensMateDiagnostics._instance = new MavensMateDiagnostics();
        }
        return MavensMateDiagnostics._instance;
    }
}
MavensMateDiagnostics._instance = null;
exports.MavensMateDiagnostics = MavensMateDiagnostics;
//# sourceMappingURL=mavensMateDiagnostics.js.map