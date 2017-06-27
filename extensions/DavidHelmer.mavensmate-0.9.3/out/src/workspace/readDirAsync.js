"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const bbPromise = require("bluebird");
function readdir(filePath) {
    return new bbPromise((resolve, reject) => {
        fs.readdir(filePath, (err, files) => {
            if (err) {
                console.error("Error reading directory " + filePath);
                reject();
            }
            return resolve(files);
        });
    });
}
exports.readdir = readdir;
//# sourceMappingURL=readDirAsync.js.map