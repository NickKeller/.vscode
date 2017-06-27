"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class StartLogging extends clientCommand_1.ClientCommand {
    static create() {
        return new StartLogging();
    }
    constructor() {
        super('Start Logging', 'start-logging');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=startLogging.js.map