"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompileFile = require("./compileFile");
module.exports = class ForceCompileFile extends CompileFile {
    static create() {
        return new ForceCompileFile();
    }
    constructor() {
        super('Force Compile File');
        this.body.force = true;
    }
};
//# sourceMappingURL=forceCompileFile.js.map