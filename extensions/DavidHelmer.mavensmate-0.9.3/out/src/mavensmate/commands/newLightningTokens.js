"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewLightningTokens extends clientCommand_1.ClientCommand {
    static create() {
        return new NewLightningTokens();
    }
    constructor() {
        super('New Lightning Tokens', 'new-lightning-tokens');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=newLightningTokens.js.map