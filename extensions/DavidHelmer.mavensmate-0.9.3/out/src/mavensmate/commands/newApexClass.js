"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewApexClass extends clientCommand_1.ClientCommand {
    static create() {
        return new NewApexClass();
    }
    constructor() {
        super('New Apex Class', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexClass';
    }
};
//# sourceMappingURL=newApexClass.js.map