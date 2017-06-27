"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("./baseCommand");
const Promise = require("bluebird");
const mavensMateStatus_1 = require("../../vscode/mavensMateStatus");
const mavensMateClient_1 = require("../mavensMateClient");
class SalesforceTest {
}
exports.SalesforceTest = SalesforceTest;
class ClientCommand extends baseCommand_1.BaseCommand {
    constructor(label, id) {
        super(label);
        this.id = id;
        this.body = {
            args: {}
        };
        this.mavensMateStatus = mavensMateStatus_1.MavensMateStatus.getInstance();
        this.mavensMateClient = mavensMateClient_1.MavensMateClient.getInstance();
    }
    execute() {
        return this.onStart()
            .bind(this)
            .then(this.sendCommand)
            .then(this.onSuccess, this.onFailure);
    }
    onStart() {
        this.mavensMateChannel.waitingOnCount++;
        return Promise.resolve().then(() => {
            let statusText = `${this.label}: Starting`;
            return this.mavensMateChannel.appendStatus(statusText);
        });
    }
    sendCommand() {
        if (this.async === undefined) {
            this.async = true;
        }
        if (this.body.args.ui === undefined) {
            this.body.args.ui = false;
        }
        return this.mavensMateClient.sendCommand(this);
    }
    onSuccess(response) {
        this.mavensMateChannel.waitingOnCount--;
        if (this.mavensMateChannel.waitingOnCount === 0) {
            this.mavensMateStatus.showAppIsAvailable();
        }
        return this.mavensMateChannel.appendStatus(`${this.label}: Finished`);
    }
    onFailure(response) {
        this.mavensMateChannel.waitingOnCount--;
        if (response.error) {
            let error = response.error;
            this.mavensMateChannel.appendError(`${this.label}: ${error}\n${response.stack}`);
        }
        else {
            this.mavensMateChannel.appendError(`${this.label}: Failed\n${response}`);
        }
        this.mavensMateStatus.showAppIsUnavailable();
        console.error(`MavensMate Client Error Response:\n ${response}`);
        return Promise.reject(response);
    }
}
exports.ClientCommand = ClientCommand;
//# sourceMappingURL=clientCommand.js.map