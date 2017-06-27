"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewLightningEvent extends clientCommand_1.ClientCommand {
    static create() {
        return new NewLightningEvent();
    }
    constructor() {
        super('New Lightning Event', 'new-lightning-event');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=newLightningEvent.js.map