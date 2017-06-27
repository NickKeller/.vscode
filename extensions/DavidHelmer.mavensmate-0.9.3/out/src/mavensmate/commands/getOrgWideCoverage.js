"use strict";
const clientCommand_1 = require("./clientCommand");
const mavensMateCodeCoverage_1 = require("../../vscode/mavensMateCodeCoverage");
const vscode = require("vscode");
class GetOrgWideCoverage extends clientCommand_1.ClientCommand {
    static create() {
        return new GetOrgWideCoverage();
    }
    constructor() {
        super('Get Org Wide Apex Code Coverage', 'get-coverage');
        this.mavensMateCodeCoverage = mavensMateCodeCoverage_1.MavensMateCodeCoverage.getInstance();
        this.body.global = true;
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => this.handleCoverageResponse(response));
    }
    handleCoverageResponse(response) {
        if (response.result && typeof response.result == 'number') {
            let orgWideCoverage = `Org Wide Test Coverage: ${response.result}%`;
            vscode.window.showInformationMessage(orgWideCoverage);
        }
        else {
            let message = `No Apex Code Coverage Available Org Wide`;
            this.mavensMateChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
        }
    }
}
module.exports = GetOrgWideCoverage;
//# sourceMappingURL=getOrgWideCoverage.js.map