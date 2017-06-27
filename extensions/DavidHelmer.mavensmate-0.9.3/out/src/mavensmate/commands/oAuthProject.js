"use strict";
const clientCommand_1 = require("./clientCommand");
class OAuthProjectCommand extends clientCommand_1.ClientCommand {
    static create() {
        return new OAuthProjectCommand();
    }
    constructor() {
        super('oAuth Project', 'oauth-project');
        this.async = false;
        this.body.args.ui = true;
    }
}
module.exports = OAuthProjectCommand;
//# sourceMappingURL=oAuthProject.js.map