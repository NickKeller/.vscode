"use strict";
var vscode_1 = require("vscode");
(function (FlashState) {
    FlashState[FlashState["On"] = 1] = "On";
    FlashState[FlashState["Off"] = 2] = "Off";
})(exports.FlashState || (exports.FlashState = {}));
var FlashState = exports.FlashState;
var cache = getDefaultCache();
function getDefaultCache() {
    return {
        format: (_a = {},
            _a[FlashState.On] = null,
            _a[FlashState.Off] = null,
            _a
        ),
        configuration: {}
    };
    var _a;
}
function preCache() {
    if (!cache.format[FlashState.On]) {
        getFormat(FlashState.On);
    }
    if (!cache.format[FlashState.Off] && shouldFlashTimeSeparators()) {
        getFormat(FlashState.Off);
    }
}
exports.preCache = preCache;
function clearCache() {
    cache = getDefaultCache();
}
exports.clearCache = clearCache;
function getConfiguration(property) {
    if (!cache.configuration.hasOwnProperty(property)) {
        cache.configuration[property] = vscode_1.workspace.getConfiguration("dateTime")[property];
    }
    return cache.configuration[property];
}
function shouldShowOnStartup() {
    return getConfiguration("showOnStartup");
}
exports.shouldShowOnStartup = shouldShowOnStartup;
function getCustomFormat(flashState) {
    var format = getConfiguration("customFormat");
    if (!format) {
        return null;
    }
    if (flashState === FlashState.On) {
        return format;
    }
    else {
        var reSeparator = getFormatTimeSeparatorRegExp();
        return format.replace(reSeparator, "$1" + getTimeSeparatorOff());
    }
}
exports.getCustomFormat = getCustomFormat;
var timeCharacters = "HhmSs";
function getFormatTimeSeparatorRegExp() {
    var separator = escapeRegExp(getTimeSeparator());
    return new RegExp("([" + timeCharacters + "]+[^" + timeCharacters + separator + "]*)" + separator, "g");
}
function shouldShowHours() {
    return getConfiguration("showHours");
}
exports.shouldShowHours = shouldShowHours;
function shouldShowMinutes() {
    return getConfiguration("showMinutes");
}
exports.shouldShowMinutes = shouldShowMinutes;
function shouldShowSeconds() {
    var customFormat = getCustomFormat(FlashState.On);
    if (customFormat && customFormat.indexOf("s") > -1) {
        return true;
    }
    return getConfiguration("showSeconds");
}
exports.shouldShowSeconds = shouldShowSeconds;
function shouldShowFractionalSeconds() {
    return getFormat(FlashState.On).indexOf('S') > -1;
}
exports.shouldShowFractionalSeconds = shouldShowFractionalSeconds;
function getFractionalPrecision() {
    var precision = getConfiguration("fractionalPrecision");
    if (typeof precision !== "number") {
        var format = getFormat(FlashState.On);
        precision = Math.pow(10, (format.match(/S/g) || []).length);
    }
    if (precision < 1) {
        precision = 1;
    }
    else if (precision > 100) {
        precision = 100;
    }
    return precision;
}
exports.getFractionalPrecision = getFractionalPrecision;
function shouldShowDayOfWeek() {
    return getConfiguration("showDayOfWeek");
}
exports.shouldShowDayOfWeek = shouldShowDayOfWeek;
function shouldShowDayOfMonth() {
    return getConfiguration("showDayOfMonth");
}
exports.shouldShowDayOfMonth = shouldShowDayOfMonth;
function shouldShowMonth() {
    return getConfiguration("showMonth");
}
exports.shouldShowMonth = shouldShowMonth;
function shouldUse24HourClock() {
    return getConfiguration("use24HourClock");
}
exports.shouldUse24HourClock = shouldUse24HourClock;
function shouldShowAMPM() {
    return getConfiguration("showAMPM");
}
exports.shouldShowAMPM = shouldShowAMPM;
function shouldPadHours() {
    return getConfiguration("padHours");
}
exports.shouldPadHours = shouldPadHours;
function shouldPadMinutes() {
    return getConfiguration("padMinutes");
}
exports.shouldPadMinutes = shouldPadMinutes;
function shouldPadSeconds() {
    return getConfiguration("padSeconds");
}
exports.shouldPadSeconds = shouldPadSeconds;
function shouldPadDays() {
    return getConfiguration("padDays");
}
exports.shouldPadDays = shouldPadDays;
function getTimeSeparator() {
    return getConfiguration("timeSeparator");
}
exports.getTimeSeparator = getTimeSeparator;
function getTimeSeparatorOff() {
    return getConfiguration("timeSeparatorOff");
}
exports.getTimeSeparatorOff = getTimeSeparatorOff;
function shouldFlashTimeSeparators() {
    return getConfiguration("flashTimeSeparators");
}
exports.shouldFlashTimeSeparators = shouldFlashTimeSeparators;
function getFormat(flashState) {
    if (!cache.format[flashState]) {
        cache.format[flashState] = getCustomFormat(flashState) || composeFormat(flashState);
    }
    return cache.format[flashState];
}
exports.getFormat = getFormat;
function hasFormat() {
    return getFormat(FlashState.On).length > 0;
}
exports.hasFormat = hasFormat;
function composeFormat(flashState) {
    var separator = flashState === FlashState.On
        ? getTimeSeparator()
        : getTimeSeparatorOff();
    var format = "";
    if (shouldShowHours()) {
        if (shouldUse24HourClock()) {
            format += shouldPadHours() ? "HH" : "H";
        }
        else {
            format += shouldPadHours() ? "hh" : "h";
        }
    }
    if (shouldShowMinutes()) {
        format +=
            (shouldShowHours() ? separator : "") +
                (shouldPadMinutes() ? "mm" : "m");
    }
    if (shouldShowSeconds()) {
        format +=
            (shouldShowHours() || shouldShowMinutes() ? separator : "") +
                (shouldPadSeconds() ? "ss" : "s");
    }
    if (shouldShowAMPM()) {
        format += " A";
    }
    if (shouldShowMonth()) {
        format = "MMM " + format;
    }
    if (shouldShowDayOfMonth()) {
        format = (shouldPadDays() ? "DD" : "D") + " " + format;
    }
    if (shouldShowDayOfWeek()) {
        format = "ddd " + format;
    }
    return format;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//# sourceMappingURL=configuration.js.map