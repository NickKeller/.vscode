"use strict";
const clientCommand_1 = require("./clientCommand");
class OpenSettings extends clientCommand_1.ClientCommand {
    static create() {
        return new OpenSettings();
    }
    constructor() {
        super('Open Settings', 'open-settings');
        this.async = false;
        this.body.args.ui = true;
        this.allowWithoutProject = true;
    }
}
module.exports = OpenSettings;
//# sourceMappingURL=openSettings.js.map