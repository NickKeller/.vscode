"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewLightningApp extends clientCommand_1.ClientCommand {
    static create() {
        return new NewLightningApp();
    }
    constructor() {
        super('New Lightning App', 'new-lightning-app');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=newLightningApp.js.map