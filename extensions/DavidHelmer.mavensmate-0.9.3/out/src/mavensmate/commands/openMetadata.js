"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathsCommand_1 = require("./pathsCommand");
let languagesToCompileOnSave = new Set(['apex', 'visualforce', 'xml', 'javascript']);
module.exports = class OpenMetadata extends pathsCommand_1.PathsCommand {
    static create() {
        return new OpenMetadata();
    }
    constructor() {
        super('Open Metadata', 'open-metadata');
        this.async = false;
        this.body.callThrough = true;
        this.body.args.ui = false;
    }
};
//# sourceMappingURL=openMetadata.js.map