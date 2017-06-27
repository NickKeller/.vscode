'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const mavensMateConfiguration_1 = require("./mavensMateConfiguration");
const Promise = require("bluebird");
class MavensMateChannel {
    constructor() {
        if (MavensMateChannel._instance) {
            throw new Error("Error: Instantiation failed. Singleton module! Use .getInstance() instead of new.");
        }
        MavensMateChannel._instance = this;
        this.channel = vscode_1.window.createOutputChannel('MavensMate');
        this.waitingOnCount = 0;
        this.waitingDelay = mavensMateConfiguration_1.getConfiguration('mavensMate.hideOutputDelay');
        this.isShowing = false;
        this.isWaiting = false;
    }
    static getInstance() {
        if (MavensMateChannel._instance == null) {
            MavensMateChannel._instance = new MavensMateChannel();
        }
        return MavensMateChannel._instance;
    }
    appendStatus(message) {
        return this.appendLine(message, 'STATUS');
    }
    appendError(message) {
        return this.appendLine(message, 'ERROR');
    }
    appendLine(message, level) {
        return Promise.resolve().then(() => {
            let tabs = (level && level.length > 5 ? 1 : 2);
            let formattedMessage = `${'\t'.repeat(tabs)}${message}`;
            if (level) {
                formattedMessage = `[${level}]${formattedMessage}`;
            }
            else {
                formattedMessage = '\t\t' + formattedMessage;
            }
            this.channel.appendLine(formattedMessage);
            this.show();
            if (this.waitingOnCount == 0 && this.isWaiting == false) {
                this.isWaiting = true;
                Promise.delay(this.waitingDelay).then(() => {
                    if (this.waitingOnCount == 0) {
                        if (level == 'STATUS' && mavensMateConfiguration_1.getConfiguration('mavensMate.hideOutputOnSuccess')) {
                            this.hide();
                        }
                        this.isWaiting = false;
                    }
                });
            }
            return null;
        });
    }
    show() {
        this.channel.show();
        this.isShowing = true;
    }
    hide() {
        this.channel.hide();
        this.isShowing = false;
    }
    toggle() {
        if (this.isShowing) {
            this.hide();
            return Promise.resolve();
        }
        else {
            this.waitingOnCount++;
            this.show();
            return Promise.delay(this.waitingDelay).then(() => {
                this.waitingOnCount--;
            });
        }
    }
    dispose() {
        this.channel.dispose();
    }
}
MavensMateChannel._instance = null;
exports.MavensMateChannel = MavensMateChannel;
//# sourceMappingURL=mavensMateChannel.js.map