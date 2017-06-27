"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class NewVisualforceComponent extends clientCommand_1.ClientCommand {
    static create() {
        return new NewVisualforceComponent();
    }
    constructor() {
        super('New Visualforce Component', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexComponent';
    }
};
//# sourceMappingURL=newVisualforceComponent.js.map