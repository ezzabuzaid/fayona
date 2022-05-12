"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.tscExecutor = exports.normalizeOptions = void 0;
var check_dependencies_1 = require("@nrwl/js/src/utils/check-dependencies");
var copy_assets_handler_1 = require("@nrwl/js/src/utils/copy-assets-handler");
var tslib_dependency_1 = require("@nrwl/js/src/utils/tslib-dependency");
var compile_typescript_files_1 = require("@nrwl/js/src/utils/typescript/compile-typescript-files");
var update_package_json_1 = require("@nrwl/js/src/utils/update-package-json");
var watch_for_single_file_changes_1 = require("@nrwl/js/src/utils/watch-for-single-file-changes");
var assets_1 = require("@nrwl/workspace/src/utilities/assets");
var path_1 = require("path");
function normalizeOptions(options, contextRoot, sourceRoot, projectRoot) {
    var outputPath = (0, path_1.join)(contextRoot, options.outputPath);
    if (options.watch == null) {
        options.watch = false;
    }
    var files = (0, assets_1.assetGlobsToFiles)(options.assets, contextRoot, outputPath);
    return __assign(__assign({}, options), { root: contextRoot, sourceRoot: sourceRoot, projectRoot: projectRoot, files: files, outputPath: outputPath, tsConfig: (0, path_1.join)(contextRoot, options.tsConfig), mainOutputPath: (0, path_1.resolve)(outputPath, options.main.replace("".concat(projectRoot, "/"), '').replace('.ts', '.js')) });
}
exports.normalizeOptions = normalizeOptions;
function tscExecutor(_options, context) {
    return __asyncGenerator(this, arguments, function tscExecutor_1() {
        var _a, sourceRoot, root, options, _b, projectRoot, tmpTsConfig, target, dependencies, assetHandler, disposeWatchAssetChanges_1, disposePackageJsonChanged_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = context.workspace.projects[context.projectName], sourceRoot = _a.sourceRoot, root = _a.root;
                    options = normalizeOptions(_options, context.root, sourceRoot, root);
                    _b = (0, check_dependencies_1.checkDependencies)(context, _options.tsConfig), projectRoot = _b.projectRoot, tmpTsConfig = _b.tmpTsConfig, target = _b.target, dependencies = _b.dependencies;
                    if (tmpTsConfig) {
                        options.tsConfig = tmpTsConfig;
                    }
                    (0, tslib_dependency_1.addTslibDependencyIfNeeded)(options, context, dependencies);
                    assetHandler = new copy_assets_handler_1.CopyAssetsHandler({
                        projectDir: projectRoot,
                        rootDir: context.root,
                        outputDir: _options.outputPath,
                        assets: _options.assets
                    });
                    if (!options.watch) return [3 /*break*/, 3];
                    return [4 /*yield*/, __await(assetHandler.watchAndProcessOnAssetChange())];
                case 1:
                    disposeWatchAssetChanges_1 = _c.sent();
                    return [4 /*yield*/, __await((0, watch_for_single_file_changes_1.watchForSingleFileChanges)((0, path_1.join)(context.root, projectRoot), 'package.json', function () { return (0, update_package_json_1.updatePackageJson)(options, context, target, dependencies); }))];
                case 2:
                    disposePackageJsonChanged_1 = _c.sent();
                    process.on('exit', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, disposeWatchAssetChanges_1()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, disposePackageJsonChanged_1()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    process.on('SIGTERM', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, disposeWatchAssetChanges_1()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, disposePackageJsonChanged_1()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _c.label = 3;
                case 3: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues((0, compile_typescript_files_1.compileTypeScriptFiles)(options, context, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, assetHandler.processAllAssetsOnce()];
                                case 1:
                                    _a.sent();
                                    (0, update_package_json_1.updatePackageJson)(options, context, target, dependencies);
                                    return [2 /*return*/];
                            }
                        });
                    }); }))))];
                case 4: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 5: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 6: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.tscExecutor = tscExecutor;
exports["default"] = tscExecutor;
