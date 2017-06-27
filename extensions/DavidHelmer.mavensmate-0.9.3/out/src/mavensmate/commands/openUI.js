"use strict";
const clientCommand_1 = require("./clientCommand");
class OpenUI extends clientCommand_1.ClientCommand {
    static create() {
        return new OpenUI();
    }
    constructor() {
        super('Open UI', 'open-ui');
        this.async = false;
        this.body.args.ui = true;
        this.allowWithoutProject = true;
    }
    onSuccess(response) {
        return super.onSuccess(response);
    }
}
module.exports = OpenUI;
//# sourceMappingURL=openUI.js.map