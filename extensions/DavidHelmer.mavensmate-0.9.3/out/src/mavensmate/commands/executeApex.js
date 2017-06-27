"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class ExecuteApex extends clientCommand_1.ClientCommand {
    static create() {
        return new ExecuteApex();
    }
    constructor() {
        super('Execute Apex', 'execute-apex');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=executeApex.js.map