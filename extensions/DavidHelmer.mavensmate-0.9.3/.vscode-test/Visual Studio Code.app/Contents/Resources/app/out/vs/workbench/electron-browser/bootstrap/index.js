/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";function onError(e,r){r&&remote.getCurrentWebContents().openDevTools(),console.error("[uncaught exception]: "+e),e.stack&&console.error(e.stack)}function assign(e,r){return Object.keys(r).reduce(function(e,n){return e[n]=r[n],e},e)}function parseURLQueryArgs(){return(window.location.search||"").split(/[?&]/).filter(function(e){return!!e}).map(function(e){return e.split("=")}).filter(function(e){return 2===e.length}).reduce(function(e,r){return e[r[0]]=decodeURIComponent(r[1]),e},{})}function createScript(e,r){const n=document.createElement("script");n.src=e,n.addEventListener("load",r);const t=document.getElementsByTagName("head")[0];t.insertBefore(n,t.lastChild)}function uriFromPath(e){var r=path.resolve(e).replace(/\\/g,"/");return r.length>0&&"/"!==r.charAt(0)&&(r="/"+r),encodeURI("file://"+r)}function registerListeners(e){var r;if(e){const n=function(e){return[e.ctrlKey?"ctrl-":"",e.metaKey?"meta-":"",e.altKey?"alt-":"",e.shiftKey?"shift-":"",e.keyCode].join("")},t="darwin"===process.platform?"meta-alt-73":"ctrl-shift-73",o="darwin"===process.platform?"meta-82":"ctrl-82";r=function(e){const r=n(e);r===t?remote.getCurrentWebContents().toggleDevTools():r===o&&remote.getCurrentWindow().reload()},window.addEventListener("keydown",r)}return process.on("uncaughtException",function(r){onError(r,e)}),function(){r&&(window.removeEventListener("keydown",r),r=void 0)}}function main(){const e=require("electron").webFrame,r=parseURLQueryArgs(),n=JSON.parse(r.config||"{}")||{};assign(process.env,n.userEnv);var t={availableLanguages:{}};const o=process.env.VSCODE_NLS_CONFIG;if(o){process.env.VSCODE_NLS_CONFIG=o;try{t=JSON.parse(o)}catch(e){}}var s=t.availableLanguages["*"]||"en";"zh-tw"===s?s="zh-Hant":"zh-cn"===s&&(s="zh-Hans"),window.document.documentElement.setAttribute("lang",s);const i=(process.env.VSCODE_DEV||!!n.extensionDevelopmentPath)&&!n.extensionTestsPath,a=registerListeners(i),c=n.zoomLevel;e.setZoomLevelLimits(1,1),"number"==typeof c&&0!==c&&e.setZoomLevel(c);const l=uriFromPath(n.appRoot)+"/out";createScript(l+"/vs/loader.js",function(){define("fs",["original-fs"],function(e){return e}),window.MonacoEnvironment={};const e=window.MonacoEnvironment.nodeCachedDataErrors=[];require.config({baseUrl:l,"vs/nls":t,recordStats:!!n.performance,nodeCachedDataDir:n.nodeCachedDataDir,onNodeCachedDataError:function(r){e.push(r)},nodeModules:["electron","original-fs","agent-base","anymatch","applicationinsights","arr-diff","arr-flatten","array-unique","arrify","async-each","balanced-match","binary-extensions","brace-expansion","braces","buffer-shims","chokidar","concat-map","core-util-is","debug","emmet","expand-brackets","expand-range","extend","extglob","extract-opts","fast-plist","fd-slicer","filename-regex","fill-range","for-in","for-own","fsevents","gc-signals","getmac","glob-base","glob-parent","graceful-fs","http-proxy-agent","https-proxy-agent","iconv-lite","inherits","is-binary-path","is-buffer","is-dotfile","is-equal-shallow","is-extendable","is-extglob","is-glob","is-number","is-posix-bracket","is-primitive","isarray","isobject","jschardet","kind-of","micromatch","minimatch","minimist","ms","nan","native-keymap","normalize-path","object.omit","oniguruma","parse-glob","path-is-absolute","pend","preserve","process-nextick-args","node-pty","randomatic","readable-stream","readdirp","regex-cache","repeat-element","repeat-string","semver","set-immediate-shim","string_decoder","typechecker","util-deprecate","v8-profiler","vscode-debugprotocol","vscode-ripgrep","vscode-textmate","windows-foreground-love","windows-mutex","winreg","xterm","yauzl","vsda","assert","buffer","child_process","console","constants","crypto","cluster","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","process","punycode","querystring","readline","repl","stream","string_decoder","sys","timers","tls","tty","url","util","v8","vm","zlib"]}),t.pseudo&&require(["vs/nls"],function(e){e.setPseudoTranslation(t.pseudo)});const r=window.MonacoEnvironment.timers={isInitialStartup:!!n.isInitialStartup,hasAccessibilitySupport:!!n.accessibilitySupport,start:n.perfStartTime,appReady:n.perfAppReady,windowLoad:n.perfWindowLoadTime,beforeLoadWorkbenchMain:Date.now()};require(["vs/workbench/electron-browser/workbench.main","vs/nls!vs/workbench/electron-browser/workbench.main","vs/css!vs/workbench/electron-browser/workbench.main"],function(){r.afterLoadWorkbenchMain=Date.now(),process.lazyEnv.then(function(){require("vs/workbench/electron-browser/main").startup(n).done(function(){a()},function(e){onError(e,i)})})})})}if(window.location.search.indexOf("prof-startup")>=0){var profiler=require("v8-profiler");profiler.startProfiling("renderer",!0)}const path=require("path"),electron=require("electron"),remote=electron.remote,ipc=electron.ipcRenderer;process.lazyEnv=new Promise(function(e){ipc.once("vscode:acceptShellEnv",function(r,n){assign(process.env,n),e(process.env)}),ipc.send("vscode:fetchShellEnv",remote.getCurrentWindow().id)}),main();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6eaebe3b9c70406d67c97779468c324a7a95db0e/core/vs/workbench/electron-browser/bootstrap/index.js.map
