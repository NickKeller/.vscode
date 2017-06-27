/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const vscode = require("vscode");
function activate(_context) {
    let workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) {
        return;
    }
    let gulpfile = path.join(workspaceRoot, 'gulpfile.js');
    let gulpPromise = undefined;
    let fileWatcher = vscode.workspace.createFileSystemWatcher(gulpfile);
    fileWatcher.onDidChange(() => gulpPromise = undefined);
    fileWatcher.onDidCreate(() => gulpPromise = undefined);
    fileWatcher.onDidDelete(() => gulpPromise = undefined);
    vscode.workspace.registerTaskProvider({
        provideTasks: () => {
            if (!gulpPromise) {
                gulpPromise = getGulpTasks();
            }
            return gulpPromise;
        }
    });
}
exports.activate = activate;
function getGulpTasks() {
    return new Promise((resolve, _reject) => {
        let workspaceRoot = vscode.workspace.rootPath;
        let emptyTaskSet = { tasks: [] };
        if (!workspaceRoot) {
            return resolve(emptyTaskSet);
        }
        let gulpfile = path.join(workspaceRoot, 'gulpfile.js');
        fs.exists(gulpfile, (value) => {
            if (!value) {
                resolve(emptyTaskSet);
                return;
            }
            let commandLine;
            let platform = process.platform;
            if (platform === 'win32' && fs.existsSync(path.join(workspaceRoot, 'node_modules', '.bin', 'gulp.cmd'))) {
                commandLine = `${path.join('.', 'node_modules', '.bin', 'gulp.cmd')} --tasks-simple --no-color`;
            }
            else if ((platform === 'linux' || platform === 'darwin') && fs.existsSync(path.join(workspaceRoot, 'node_modules', '.bin', 'gulp.cmd'))) {
                commandLine = `${path.join('.', 'node_modules', '.bin', 'gulp')} --tasks-simple --no-color`;
            }
            else {
                commandLine = 'gulp --tasks-simple --no-color';
            }
            cp.exec(commandLine, { cwd: workspaceRoot }, (error, stdout, stderr) => {
                let channel = vscode.window.createOutputChannel('tasks');
                if (stderr) {
                    channel.appendLine(stderr);
                }
                if (error) {
                    channel.appendLine(`Auto detecting gulp failed with error: ${error ? error.toString() : 'unknown'}`);
                    resolve(emptyTaskSet);
                    return;
                }
                let result = { tasks: [], buildTasks: [], testTasks: [] };
                if (stdout) {
                    let buildTask = { id: undefined, rank: 0 };
                    let testTask = { id: undefined, rank: 0 };
                    let lines = stdout.split(/\r{0,1}\n/);
                    for (let line of lines) {
                        if (line.length === 0) {
                            continue;
                        }
                        let task = new vscode.ShellTask(`gulp ${line}`, `gulp ${line}`);
                        result.tasks.push(task);
                        let lowerCaseLine = line.toLowerCase();
                        if (lowerCaseLine === 'build') {
                            buildTask = { id: line, rank: 2 };
                        }
                        else if (lowerCaseLine.indexOf('build') !== -1 && buildTask.rank < 1) {
                            buildTask = { id: line, rank: 1 };
                        }
                        else if (lowerCaseLine === 'test') {
                            testTask = { id: line, rank: 2 };
                        }
                        else if (lowerCaseLine.indexOf('test') !== -1 && testTask.rank < 1) {
                            testTask = { id: line, rank: 1 };
                        }
                    }
                    if (buildTask.id) {
                        result.buildTasks.push(buildTask.id);
                    }
                    if (testTask.id) {
                        result.testTasks.push(testTask.id);
                    }
                }
                resolve(result);
            });
        });
    });
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/gulp/out/main.js.map
