"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class FlushSoql extends clientCommand_1.ClientCommand {
    static create() {
        return new FlushSoql();
    }
    constructor() {
        super('Flush SOQL', 'flush-soql');
        this.async = true;
        this.body.args.ui = false;
    }
    execute(selectedResource) {
        return super.execute();
    }
};
//# sourceMappingURL=flushSoql.js.map