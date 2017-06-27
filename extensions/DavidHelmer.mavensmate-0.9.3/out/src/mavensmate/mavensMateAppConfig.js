"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const operatingSystem = require("../../src/workspace/operatingSystem");
const jsonFile = require("../../src/workspace/jsonFile");
function getConfig() {
    let configFileDirectory = getUserHomeDirectory();
    let configFileName = '.mavensmate-config.json';
    let appConfigFilePath = path.join(configFileDirectory, configFileName);
    return jsonFile.open(appConfigFilePath);
}
exports.getConfig = getConfig;
function getUserHomeDirectory() {
    if (operatingSystem.isWindows()) {
        return process.env.USERPROFILE;
    }
    else if (operatingSystem.isMac() || operatingSystem.isLinux()) {
        return process.env.HOME;
    }
    else {
        throw new operatingSystem.UnexpectedPlatformError('Was not windows, mac, or linux');
    }
}
//# sourceMappingURL=mavensMateAppConfig.js.map