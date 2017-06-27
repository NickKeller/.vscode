"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class StopLogging extends clientCommand_1.ClientCommand {
    static create() {
        return new StopLogging();
    }
    constructor() {
        super('Stop Logging', 'stop-logging');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=stopLogging.js.map