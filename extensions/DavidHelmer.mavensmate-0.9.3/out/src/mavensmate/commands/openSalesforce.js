"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class EditProject extends clientCommand_1.ClientCommand {
    static create() {
        return new EditProject();
    }
    constructor() {
        super('Open Salesforce', 'open-sfdc');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=openSalesforce.js.map