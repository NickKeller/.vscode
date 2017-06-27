'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
function isWindows() {
    return os.platform().startsWith('win');
}
exports.isWindows = isWindows;
function isLinux() {
    return os.platform().startsWith('linux');
}
exports.isLinux = isLinux;
function isMac() {
    return os.platform().startsWith('darwin');
}
exports.isMac = isMac;
class UnexpectedPlatformError extends Error {
    constructor(message) {
        message = 'Unexpected Platform, current platform(' + os.platform() + '):' + message;
        super(message);
    }
}
exports.UnexpectedPlatformError = UnexpectedPlatformError;
//# sourceMappingURL=operatingSystem.js.map