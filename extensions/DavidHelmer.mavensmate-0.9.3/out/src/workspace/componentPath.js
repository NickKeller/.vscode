"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let pathEndRegEx = /(unpackaged)?([^\\/]*[\\/]\w+[\.]\w+)/;
function getPathEnd(path) {
    let pathEnd = path;
    let matches = pathEndRegEx.exec(path);
    if (matches && matches.length > 0) {
        pathEnd = matches[matches.length - 1];
    }
    else {
        console.error(`MavensMate: Failed to get the pathEnd from: ${path}`);
    }
    return pathEnd;
}
exports.getPathEnd = getPathEnd;
//# sourceMappingURL=componentPath.js.map