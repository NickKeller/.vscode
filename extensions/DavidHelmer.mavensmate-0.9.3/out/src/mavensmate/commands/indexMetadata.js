"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientCommand_1 = require("./clientCommand");
module.exports = class IndexMetadata extends clientCommand_1.ClientCommand {
    static create() {
        return new IndexMetadata();
    }
    constructor() {
        super('Index Metadata', 'index-metadata');
    }
};
//# sourceMappingURL=indexMetadata.js.map