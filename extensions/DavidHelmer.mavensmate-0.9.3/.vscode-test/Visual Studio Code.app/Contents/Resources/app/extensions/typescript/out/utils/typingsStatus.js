/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <reference path="../../../../src/vs/vscode.proposed.d.ts" />
'use strict';
const vscode = require("vscode");
const vscode_nls_1 = require("vscode-nls");
const localize = vscode_nls_1.loadMessageBundle(__filename);
const typingsInstallTimeout = 30 * 1000;
class TypingsStatus extends vscode.Disposable {
    constructor(client) {
        super(() => this.dispose());
        this._acquiringTypings = Object.create({});
        this._subscriptions = [];
        this._client = client;
        this._subscriptions.push(this._client.onDidBeginInstallTypings(event => this.onBeginInstallTypings(event.eventId)));
        this._subscriptions.push(this._client.onDidEndInstallTypings(event => this.onEndInstallTypings(event.eventId)));
    }
    dispose() {
        this._subscriptions.forEach(x => x.dispose());
        for (const eventId of Object.keys(this._acquiringTypings)) {
            clearTimeout(this._acquiringTypings[eventId]);
        }
    }
    get isAcquiringTypings() {
        return Object.keys(this._acquiringTypings).length > 0;
    }
    onBeginInstallTypings(eventId) {
        if (this._acquiringTypings[eventId]) {
            return;
        }
        this._acquiringTypings[eventId] = setTimeout(() => {
            this.onEndInstallTypings(eventId);
        }, typingsInstallTimeout);
    }
    onEndInstallTypings(eventId) {
        const timer = this._acquiringTypings[eventId];
        if (timer) {
            clearTimeout(timer);
        }
        delete this._acquiringTypings[eventId];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypingsStatus;
class AtaProgressReporter {
    constructor(client) {
        this._promises = new Map();
        this._disposable = vscode.Disposable.from(client.onDidBeginInstallTypings(e => this._onBegin(e.eventId)), client.onDidEndInstallTypings(e => this._onEndOrTimeout(e.eventId)));
    }
    dispose() {
        this._disposable.dispose();
        this._promises.forEach(value => value());
    }
    _onBegin(eventId) {
        const handle = setTimeout(() => this._onEndOrTimeout(eventId), typingsInstallTimeout);
        const promise = new Promise(resolve => {
            this._promises.set(eventId, () => {
                clearTimeout(handle);
                resolve();
            });
        });
        vscode.window.withWindowProgress(localize(0, null), () => promise);
    }
    _onEndOrTimeout(eventId) {
        const resolve = this._promises.get(eventId);
        if (resolve) {
            this._promises.delete(eventId);
            resolve();
        }
    }
}
exports.AtaProgressReporter = AtaProgressReporter;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/extensions/typescript/out/utils/typingsStatus.js.map
