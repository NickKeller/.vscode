'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const axios_1 = require("axios");
const urlJoin = require("url-join");
const Promise = require("bluebird");
const projectSettings_1 = require("./projectSettings");
const mavensMateStatus_1 = require("../vscode/mavensMateStatus");
class MavensMateClient {
    constructor() {
        this.baseURL = vscode.workspace.getConfiguration().get('mavensMateDesktop.baseURL');
        this.mavensMateStatus = mavensMateStatus_1.MavensMateStatus.getInstance();
        let projectSettings = projectSettings_1.ProjectSettings.getProjectSettings();
        if (projectSettings) {
            this.projectId = projectSettings.id;
        }
    }
    static getInstance() {
        if (MavensMateClient._instance == null) {
            MavensMateClient._instance = new MavensMateClient();
        }
        return MavensMateClient._instance;
    }
    isAppAvailable() {
        let isAvailableURL = urlJoin(this.baseURL, '/app/home/index');
        let getOptions = {
            url: isAvailableURL
        };
        return axios_1.default(isAvailableURL).then(() => {
            this.mavensMateStatus.showAppIsAvailable();
        }, () => {
            this.mavensMateStatus.showAppIsUnavailable();
        });
    }
    sendCommand(command) {
        let postOptions = this.getPostOptionsForCommand(command, this.baseURL);
        let promiseCommandSend = Promise.resolve(axios_1.default(postOptions));
        this.mavensMateStatus.showAppIsThinking();
        return promiseCommandSend.bind(this).then(this.handleResponse);
    }
    getPostOptionsForCommand(command, baseURL) {
        let asyncParam = (command.async ? 1 : 0);
        let commandParmeters = 'command=' + command.id + '&async=' + asyncParam;
        if (this.hasProjectId()) {
            commandParmeters += '&pid=' + this.projectId;
        }
        let commandURL = urlJoin(baseURL, '/execute?' + commandParmeters);
        let commandHeaders = {
            'Content-Type': 'application/json',
            'MavensMate-Editor-Agent': 'vscode'
        };
        let postOptions = {
            method: 'POST',
            url: commandURL,
            headers: commandHeaders,
            data: command.body
        };
        return postOptions;
    }
    handleResponse(commandResponse) {
        if (commandResponse.data && commandResponse.data.status && commandResponse.data.status == 'pending') {
            this.mavensMateStatus.showAppIsThinking();
            return Promise.delay(500, commandResponse)
                .bind(this)
                .then(this.poll)
                .then(this.handleResponse);
        }
        else {
            return commandResponse.data;
        }
    }
    poll(commandResponse) {
        let statusURL = urlJoin(this.baseURL, '/execute/' + commandResponse.data.id);
        let statusHeaders = {
            'MavensMate-Editor-Agent': 'vscode'
        };
        let getOptions = {
            url: statusURL,
            headers: statusHeaders
        };
        return axios_1.default(getOptions);
    }
    hasProjectId() {
        return this.projectId && this.projectId != '';
    }
    dispose() {
    }
}
MavensMateClient._instance = null;
exports.MavensMateClient = MavensMateClient;
//# sourceMappingURL=mavensMateClient.js.map