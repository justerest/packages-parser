#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var fs_1 = require("fs");
var node_fetch_1 = require("node-fetch");
var utils_1 = require("./utils");
// tslint:disable-next-line
var commandLineArgs = require('command-line-args');
/**
 * Global options
 */
var options = commandLineArgs([
    { name: 'src', multiple: true, defaultOption: true, defaultValue: [] },
    { name: 'outFile', alias: 'o', type: String, defaultValue: './package.json' },
    { name: 'filter', alias: 'f', type: String, defaultValue: 'none' },
    { name: 'latest', alias: 'l', type: Boolean },
    { name: 'save', alias: 's', type: Boolean },
    { name: 'rewrite', alias: 'r', type: Boolean },
    { name: 'saveOrder', type: Boolean },
]);
var isOutFileExist = fs_1.existsSync(options.outFile);
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var paths, allDependencies, result, allDependenciesCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = options.src.filter(utils_1.unique());
                    if (isOutFileExist && !options.rewrite)
                        paths.push(options.outFile);
                    return [4 /*yield*/, Promise.all(paths.map(parsePackageJson))];
                case 1:
                    allDependencies = _a.sent();
                    result = applyOptions(mergeDependencies.apply(void 0, allDependencies));
                    fs_1.writeFileSync(options.outFile, toPackageJson(result));
                    allDependenciesCount = allDependencies.reduce(function (size, deps) { return utils_1.sizeOf(deps) + size; }, 0);
                    console.log(chalk_1.default.greenBright("Parsed: " + allDependenciesCount + ";\n" +
                        ("Unique: " + utils_1.sizeOf(result) + ";")));
                    return [2 /*return*/];
            }
        });
    });
})();
/**
 * Parses dependencies from file or GitHub project
 * @param path path to file | link to GitHub project
 */
function parsePackageJson(path) {
    return __awaiter(this, void 0, void 0, function () {
        var text, _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    if (!path.match(/^http/i)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchPackageJson(path)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, utils_1.readFileAsync(path)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    text = _a;
                    return [2 /*return*/, parseDependencies(text)];
                case 5:
                    e_1 = _b.sent();
                    console.warn(chalk_1.default.yellow(path + ': ' + e_1.message + '\n'));
                    return [2 /*return*/, {}];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Gets package.json from GitHub project
 */
function fetchPackageJson(path) {
    return __awaiter(this, void 0, void 0, function () {
        var link, response, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, node_fetch_1.default(link)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.text()];
                case 3:
                    e_2 = _a.sent();
                    throw new Error('Error in request. ' + e_2.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Parses `dependencies` and `devDependencies` fields from JSON
 */
function parseDependencies(text) {
    try {
        var _a = JSON.parse(text), dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        if (dependencies || devDependencies) {
            return mergeDependencies(formateDependencies(dependencies || {}, true), formateDependencies(devDependencies || {}));
        }
        else
            throw new Error('Dependencies fields not found.');
    }
    catch (e) {
        throw new Error('Error in package.json format. ' + e.message);
    }
}
function formateDependencies(dependencies, isProd) {
    if (isProd === void 0) { isProd = false; }
    return Object.keys(dependencies)
        .reduce(function (result, key) {
        result[key] = {
            version: dependencies[key],
            isProd: isProd,
        };
        return result;
    }, {});
}
function mergeDependencies() {
    var depsArr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        depsArr[_i] = arguments[_i];
    }
    var result = new Proxy({}, {
        set: function (obj, prop, value) {
            var currentVersion = obj[prop] ? obj[prop].version : '0.0.0';
            var lastVersion = [currentVersion, value.version].sort().reverse()[0];
            obj[prop] = {
                version: lastVersion,
                isProd: obj[prop] && obj[prop].isProd || value.isProd,
            };
            return true;
        },
    });
    depsArr.forEach(function (deps) { return Object.assign(result, deps); });
    return result;
}
/**
 * Converts dependencies object to formated package.json
 */
function toPackageJson(dependencies) {
    var result = getOutFile();
    Object.assign(result, splitDependencies(dependencies));
    return JSON.stringify(result, null, 2);
}
function getOutFile(pkgJson) {
    if (pkgJson === void 0) { pkgJson = { name: 'parsed-packages' }; }
    if (isOutFileExist) {
        try {
            Object.assign(pkgJson, JSON.parse(fs_1.readFileSync(options.outFile, 'utf-8')));
        }
        catch (e) {
            console.warn(chalk_1.default.yellow(options.outFile + ': Bad output file. ' + e.message + '\n'));
            if (!options.rewrite) {
                throw new Error(chalk_1.default.bgRed('Use --rewrite (-r) option to override bad output file'));
            }
        }
    }
    return pkgJson;
}
function splitDependencies(dependencies) {
    return Object.keys(dependencies)
        .reduce(function (result, key) {
        var _a = dependencies[key], version = _a.version, isProd = _a.isProd;
        var type = isProd ? 'dependencies' : 'devDependencies';
        result[type][key] = version;
        return result;
    }, { dependencies: {}, devDependencies: {} });
}
function applyOptions(dependencies) {
    var keys = Object.keys(dependencies);
    if (!options.saveOrder)
        keys.sort();
    return keys.reduce(function (result, key) {
        var dependency = dependencies[key];
        var isFilterPassed = (options.filter !== 'dev' && dependency.isProd ||
            options.filter !== 'prod' && !dependency.isProd);
        if (isFilterPassed) {
            result[key] = Object.assign({}, dependency);
            if (options.latest)
                result[key].version = 'latest';
            if (options.save)
                result[key].isProd = true;
        }
        return result;
    }, {});
}
