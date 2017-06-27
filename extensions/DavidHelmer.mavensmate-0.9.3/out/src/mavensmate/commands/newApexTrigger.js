"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewApexTrigger extends clientCommand_1.ClientCommand {
    static create() {
        return new NewApexTrigger();
    }
    constructor() {
        super('New Apex Trigger', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexTrigger';
    }
};
//# sourceMappingURL=newApexTrigger.js.map