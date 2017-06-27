"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathsCommand_1 = require("./pathsCommand");
const mavensMateCodeCoverage_1 = require("../../vscode/mavensMateCodeCoverage");
const vscode = require("vscode");
const path = require("path");
const Promise = require("bluebird");
module.exports = class GetCoverage extends pathsCommand_1.PathsCommand {
    static create() {
        return new GetCoverage();
    }
    constructor() {
        super('Get Apex Code Coverage', 'get-coverage');
        this.mavensMateCodeCoverage = mavensMateCodeCoverage_1.MavensMateCodeCoverage.getInstance();
    }
    confirmPath() {
        if (this.filePath.indexOf('apex-scripts') === -1) {
            return super.confirmPath();
        }
        else {
            return Promise.reject(`Local Apex Scripts aren't covered by tests`);
        }
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => this.handleCoverageResponse(response));
    }
    handleCoverageResponse(response) {
        if (response.result && response.result != []) {
            for (let pathEnd in response.result) {
                let workspaceRoot = vscode.workspace.rootPath;
                let filePath = path.join(workspaceRoot, 'src', 'classes', pathEnd);
                let coverageResult = response.result[pathEnd];
                let uncoveredLines = coverageResult.uncoveredLines;
                this.mavensMateCodeCoverage.report(filePath, coverageResult.percentCovered, uncoveredLines);
            }
        }
        else {
            let message = `No Apex Code Coverage Available: ${this.baseName} (${this.filePath})`;
            this.mavensMateChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
        }
    }
};
//# sourceMappingURL=getCoverage.js.map