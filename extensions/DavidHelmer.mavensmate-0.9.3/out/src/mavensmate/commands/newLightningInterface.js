"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewLightningInterface extends clientCommand_1.ClientCommand {
    static create() {
        return new NewLightningInterface();
    }
    constructor() {
        super('New Lightning Interface', 'new-lightning-interface');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=newLightningInterface.js.map