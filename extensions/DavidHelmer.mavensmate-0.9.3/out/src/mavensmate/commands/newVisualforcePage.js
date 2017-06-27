"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewVisualforcePage extends clientCommand_1.ClientCommand {
    static create() {
        return new NewVisualforcePage();
    }
    constructor() {
        super('New Visualforce Page', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexPage';
    }
};
//# sourceMappingURL=newVisualforcePage.js.map