"use strict";
var configuration = require("./configuration");
var seconds = 1000;
var minutes = 60 * seconds;
var firstUpdateTimeout;
var updateInterval;
function startSchedule(callback) {
    if (configuration.shouldShowFractionalSeconds()) {
        scheduleMillisecondUpdates(callback);
    }
    else if (configuration.shouldShowSeconds() || configuration.shouldFlashTimeSeparators()) {
        scheduleSecondUpdates(callback);
    }
    else {
        scheduleMinuteUpdates(callback);
    }
}
exports.startSchedule = startSchedule;
function stopSchedule() {
    if (firstUpdateTimeout) {
        clearTimeout(firstUpdateTimeout);
        firstUpdateTimeout = null;
    }
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}
exports.stopSchedule = stopSchedule;
function scheduleMillisecondUpdates(callback) {
    updateInterval = setInterval(callback, (1 / configuration.getFractionalPrecision()) * seconds);
}
function scheduleSecondUpdates(callback) {
    updateInterval = setInterval(callback, 1 * seconds);
}
function scheduleMinuteUpdates(callback) {
    firstUpdateTimeout = setTimeout(function () {
        callback();
        updateInterval = setInterval(callback, (1 * minutes));
        firstUpdateTimeout = null;
    }, (1 * minutes) - (new Date().getSeconds() * seconds));
}
//# sourceMappingURL=schedule.js.map