"use strict";
const pathsCommand_1 = require("./pathsCommand");
const Promise = require("bluebird");
let languagesToRun = new Set(['apex']);
class RunApexScript extends pathsCommand_1.PathsCommand {
    static create(label) {
        if (!label) {
            label = 'Run Apex Script';
        }
        return new RunApexScript(label);
    }
    constructor(label) {
        super(label, 'run-apex-script');
    }
    confirmPath() {
        if (this.filePath.includes('apex-scripts')) {
            return super.confirmPath();
        }
        else {
            return Promise.reject(`Run Apex Script is only for running local Apex scripts.`);
        }
    }
    onSuccess(response) {
        return super.onSuccess(response)
            .then((response) => {
            for (let scriptName in response.result) {
                let scriptResult = response.result[scriptName];
                if (scriptResult.success == true && scriptResult.compiled == true) {
                    let message = 'Sucessfully Ran Apex Script: ' + scriptName;
                    this.mavensMateChannel.appendLine(message);
                }
                else if (!scriptResult.success || scriptResult.success == false) {
                    this.handleFailedRun(scriptResult);
                }
            }
        });
    }
    handleFailedRun(scriptResult) {
        let compileProblem = scriptResult.compileProblem;
        if (compileProblem && compileProblem != null) {
            let lineNumber = scriptResult.line;
            let column = scriptResult.column;
            let message = `[Line: ${lineNumber}, Column: ${column}] ${compileProblem}`;
            this.mavensMateChannel.appendLine(message);
        }
        let exceptionMessage = scriptResult.exceptionMessage;
        if (exceptionMessage && exceptionMessage != null) {
            this.mavensMateChannel.appendLine(exceptionMessage);
        }
        let exceptionStackTrace = scriptResult.exceptionStackTrace;
        if (exceptionStackTrace && exceptionStackTrace != null) {
            this.mavensMateChannel.appendLine(exceptionStackTrace);
        }
    }
}
module.exports = RunApexScript;
//# sourceMappingURL=runApexScript.js.map