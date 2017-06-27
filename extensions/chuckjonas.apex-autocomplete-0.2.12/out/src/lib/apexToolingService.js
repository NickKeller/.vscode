"use strict";
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const net = require('net');
const child_process = require('child_process');
const BIN = 'bin';
const JAR = 'tooling-force.jar';
class ApexToolingService {
    constructor(context, outputChannel) {
        this.outputChannel = outputChannel;
        this.jarPath = context.asAbsolutePath(path.join(BIN, JAR));
        this.tempFolder = context.asAbsolutePath(BIN);
        let config = vscode.workspace.getConfiguration('apexAutoComplete');
        this.port = config.get('port');
        this.userName = config.get('userName');
        this.password = config.get('password');
        this.instanceUrl = config.get('instanceUrl');
    }
    startService() {
        let cmd = `java -Dfile.encoding=UTF-8  -jar "${this.jarPath}" --action=serverStart --port=${this.port} --timeoutSec=1800`;
        this.outputChannel.appendLine(`Starting Language Server. CMD: ${cmd}`);
        let child = child_process.exec(cmd);
        child.stderr.on('data', (data) => {
            console.log('stderr: ' + data);
            this.outputChannel.appendLine('stderr: ' + data);
        });
        child.stdout.on('data', (data) => {
            console.log(data);
            this.outputChannel.appendLine(`${data}`);
        });
    }
    listCompletions(document, position) {
        let tmpFile = this.getTempPath('listCompletionsTmp.cls');
        let resultFile = this.getTempPath('listCompletionsResult.json');
        return new Promise(this.writecurrentFileContent(tmpFile, document)).then(() => {
            return this.sendCommand('listCompletions', resultFile, new Map([
                ['currentFilePath', document.fileName],
                ['currentFileContentPath', tmpFile],
                ['line', (position.line + 1).toString()],
                ['column', (position.character + 1).toString()]
            ]));
        });
    }
    findSymbol(document, position) {
        let tmpFile = this.getTempPath('findSymbolTmp.cls');
        let resultFile = this.getTempPath('findSymbolResult.json');
        return new Promise(this.writecurrentFileContent(tmpFile, document)).then(() => {
            return this.sendCommand('findSymbol', resultFile, new Map([
                ['currentFilePath', document.fileName],
                ['currentFileContentPath', tmpFile],
                ['line', (position.line + 1).toString()],
                ['column', (position.character + 1).toString()]
            ]));
        });
    }
    checkSyntax(document) {
        let tmpFile = this.getTempPath('checkSyntaxTmp.cls');
        let resultFile = this.getTempPath('checkSyntaxResult.json');
        return new Promise(this.writecurrentFileContent(tmpFile, document)).then(() => {
            return this.sendCommand('checkSyntax', resultFile, new Map([
                ['currentFilePath', document.fileName],
                ['currentFileContentPath', tmpFile]
            ]));
        });
    }
    //sends command to server and returns the resulting data
    sendCommand(action, responseFile, opts) {
        return new Promise((resolve, reject) => {
            let client = new net.Socket();
            //send command
            client.connect(this.port, '127.0.0.1', () => {
                let cmd = `--action=${action}  --projectPath='${vscode.workspace.rootPath}' --responseFilePath='${responseFile}' --pollWaitMillis=1000 --maxPollRequests=1000 `;
                if (opts.size > 0) {
                    for (var [key, value] of opts) {
                        cmd += `--${key}='${value}' `;
                    }
                }
                if (this.userName && this.password && this.instanceUrl) {
                    cmd += ` --sf.username='${this.userName}' --sf.password='${this.password}' --sf.serverurl='${this.instanceUrl}'`;
                }
                cmd += '\n';
                console.log(cmd);
                this.outputChannel.appendLine(`Sending CMD: ${cmd}`);
                client.write(cmd);
            });
            //log
            client.on('data', (data) => {
                let res = data.toString();
                console.log(res);
                this.outputChannel.appendLine(res);
            });
            //return on end of data
            client.on('end', function () {
                client.destroy();
                resolve();
            });
            client.on('error', (err) => {
                if (err.code == 'ECONNREFUSED') {
                    //if we get this error, try to kick off server again
                    this.outputChannel.appendLine(`Service not running! Restarting...`);
                    this.startService();
                }
                reject(err.message);
            });
        }).then(//read result file, return data
            () => {
            return new Promise((resolve, reject) => {
                fs.readFile(responseFile, 'utf8', (err, data) => {
                    if (err) {
                        this.outputChannel.appendLine(err.message);
                        reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }
    writecurrentFileContent(fileName, document) {
        return (resolve, reject) => {
            fs.writeFile(fileName, document.getText(), function (err) {
                if (err) {
                    this.outputChannel.appendLine(err.message);
                    reject(err);
                }
                else
                    resolve();
            });
        };
    }
    getTempPath(fileName) {
        return path.join(this.tempFolder, fileName);
    }
}
exports.ApexToolingService = ApexToolingService;
//# sourceMappingURL=apexToolingService.js.map