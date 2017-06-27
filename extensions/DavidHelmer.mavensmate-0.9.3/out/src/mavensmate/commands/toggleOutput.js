"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("./baseCommand");
module.exports = class ToggleOutput extends baseCommand_1.BaseCommand {
    static create() {
        return new ToggleOutput();
    }
    constructor() {
        super('Toggle Output');
        this.allowWithoutProject = true;
    }
    execute() {
        return this.mavensMateChannel.toggle();
    }
};
//# sourceMappingURL=toggleOutput.js.map