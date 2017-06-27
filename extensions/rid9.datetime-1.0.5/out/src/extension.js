/// <reference path="../typings/vscode-typings.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
"use strict";
var moment = require("moment");
var vscode_1 = require("vscode");
var configuration = require("./configuration");
var configuration_1 = require("./configuration");
var schedule_1 = require("./schedule");
var statusBarItem;
var isRunning = false;
var isStatusBarVisible = false;
function scheduleUpdates() {
    schedule_1.startSchedule(updateDateTime);
}
function showDateTime() {
    if (isRunning) {
        return;
    }
    isRunning = true;
    updateDateTime();
    scheduleUpdates();
}
function removeDateTime() {
    schedule_1.stopSchedule();
    removeStatusBarItem();
    isRunning = false;
}
function getDateTimeText(flashState) {
    return moment().format(configuration.getFormat(flashState));
}
var currentFlashState;
function updateDateTime() {
    if (configuration.hasFormat()) {
        var flashState = void 0;
        if (configuration.shouldFlashTimeSeparators()) {
            flashState = currentFlashState = currentFlashState === configuration_1.FlashState.On
                ? configuration_1.FlashState.Off
                : configuration_1.FlashState.On;
        }
        else {
            flashState = configuration_1.FlashState.On;
        }
        var shouldShow = false;
        if (!isStatusBarVisible) {
            createStatusBarItem();
            shouldShow = true;
        }
        statusBarItem.text = getDateTimeText(flashState);
        if (shouldShow) {
            statusBarItem.show();
        }
    }
    else {
        if (isStatusBarVisible) {
            removeStatusBarItem();
        }
    }
}
function createStatusBarItem() {
    statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
    isStatusBarVisible = true;
}
function removeStatusBarItem() {
    if (statusBarItem) {
        statusBarItem.hide();
        statusBarItem.dispose();
        statusBarItem = null;
    }
    isStatusBarVisible = false;
}
function activate(context) {
    var showDateTimeCommand = vscode_1.commands.registerCommand("dateTime.show", showDateTime);
    var hideDateTimeCommand = vscode_1.commands.registerCommand("dateTime.hide", removeDateTime);
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(showDateTimeCommand);
    context.subscriptions.push(hideDateTimeCommand);
    configuration.preCache();
    if (configuration.shouldShowOnStartup()) {
        vscode_1.commands.executeCommand("dateTime.show");
    }
}
exports.activate = activate;
function deactivate() {
    removeDateTime();
}
exports.deactivate = deactivate;
vscode_1.workspace.onDidChangeConfiguration(function () {
    if (isRunning) {
        configuration.clearCache();
        updateDateTime();
        configuration.preCache();
        schedule_1.stopSchedule();
        scheduleUpdates();
    }
});
//# sourceMappingURL=extension.js.map