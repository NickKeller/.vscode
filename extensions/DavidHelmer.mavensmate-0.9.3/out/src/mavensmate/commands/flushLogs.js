"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class FlushLogs extends clientCommand_1.ClientCommand {
    static create() {
        return new FlushLogs();
    }
    constructor() {
        super('Flush Logs', 'flush-logs');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=flushLogs.js.map