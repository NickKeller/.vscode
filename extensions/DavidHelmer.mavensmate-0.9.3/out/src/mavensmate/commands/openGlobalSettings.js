"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class OpenGlobalSettings extends clientCommand_1.ClientCommand {
    static create() {
        return new OpenGlobalSettings();
    }
    constructor() {
        super('Open Settings', 'open-settings');
        this.async = false;
        this.body.args.ui = true;
        this.allowWithoutProject = true;
    }
};
//# sourceMappingURL=openGlobalSettings.js.map