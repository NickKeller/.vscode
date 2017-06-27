"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewLightningComponent extends clientCommand_1.ClientCommand {
    static create() {
        return new NewLightningComponent();
    }
    constructor() {
        super('New Lightning Component', 'new-lightning-component');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=newLightningComponent.js.map