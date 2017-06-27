'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class MavensMateStatus {
    constructor() {
        this.thinkingMax = 5;
        this.appStatus = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 2);
        this.appStatus.command = 'mavensmate.toggleOutput';
        this.appStatus.text = "MavensMate";
        this.appStatus.show();
        this.thinkingIndex = 0;
    }
    static getInstance() {
        if (MavensMateStatus._instance == null) {
            MavensMateStatus._instance = MavensMateStatus.create();
        }
        return MavensMateStatus._instance;
    }
    static create() {
        return new MavensMateStatus();
    }
    showAppIsThinking() {
        let thinkingLeftSpace = '$(dash)'.repeat(this.thinkingIndex);
        let thinkingRightSpace = '$(dash)'.repeat(this.thinkingMax - this.thinkingIndex);
        this.appStatus.text = `MavensMate [${thinkingLeftSpace}$(chevron-right)${thinkingRightSpace}]`;
        this.thinkingIndex++;
        if (this.thinkingIndex > this.thinkingMax) {
            this.thinkingIndex = 0;
        }
    }
    showAppIsAvailable() {
        this.appStatus.text = "MavensMate $(check)";
    }
    showAppIsUnavailable() {
        this.appStatus.text = "MavensMate $(alert)";
    }
    dispose() {
        this.appStatus.dispose();
    }
}
MavensMateStatus._instance = null;
exports.MavensMateStatus = MavensMateStatus;
//# sourceMappingURL=mavensMateStatus.js.map