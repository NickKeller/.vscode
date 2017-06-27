"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class Deploy extends clientCommand_1.ClientCommand {
    static create() {
        return new Deploy();
    }
    constructor() {
        super('Deploy', 'deploy');
        this.async = false;
        this.body.args.ui = true;
    }
};
//# sourceMappingURL=deploy.js.map