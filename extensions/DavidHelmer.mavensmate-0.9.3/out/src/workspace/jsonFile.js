"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
function open(filePath) {
    try {
        let fileBody = fs.readFileSync(filePath);
        return JSON.parse(fileBody);
    }
    catch (openException) {
        console.warn('Failed to open ' + filePath);
        return null;
    }
}
exports.open = open;
//# sourceMappingURL=jsonFile.js.map