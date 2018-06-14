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
var fs_1 = require("fs");
var node_fetch_1 = require("node-fetch");
var models_1 = require("./models");
var DependenciesService = /** @class */ (function () {
    function DependenciesService() {
        this.state = {};
    }
    DependenciesService.prototype.merge = function () {
        var _this = this;
        var packages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            packages[_i] = arguments[_i];
        }
        packages.forEach(function (_a) {
            var dependencies = _a.dependencies, devDependencies = _a.devDependencies;
            _this.add(dependencies, 'prod');
            _this.add(devDependencies, 'dev');
        });
        return this;
    };
    DependenciesService.prototype.extract = function (options) {
        if (options === void 0) { options = {}; }
        var optionalDependencies = this.getOptionalDependencies(options);
        return Object.keys(optionalDependencies)
            .reduce(function (result, key) {
            var _a = optionalDependencies[key], version = _a.version, isProd = _a.isProd;
            result[isProd ? 'dependencies' : 'devDependencies'][key] = version;
            return result;
        }, new models_1.PackageObject());
    };
    DependenciesService.prototype.add = function (dependencies, type) {
        var _this = this;
        if (dependencies === void 0) { dependencies = {}; }
        if (type === void 0) { type = 'prod'; }
        Object.keys(dependencies).forEach(function (packageName) {
            var version = dependencies[packageName];
            var currentVersion = _this.state[packageName] ? _this.state[packageName].version : '0.0.0';
            var latestVersion = [currentVersion, version].sort().reverse()[0];
            _this.state[packageName] = {
                version: latestVersion,
                isProd: _this.state[packageName] && _this.state[packageName].isProd || type !== 'dev',
            };
        });
    };
    DependenciesService.prototype.getOptionalDependencies = function (options) {
        var _this = this;
        var packageNames = Object.keys(this.state);
        if (!options.saveOrder)
            packageNames.sort();
        return packageNames.reduce(function (result, key) {
            var dependency = _this.state[key];
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
    };
    return DependenciesService;
}());
exports.DependenciesService = DependenciesService;
function parseFile(path, options) {
    if (options === void 0) { options = {}; }
    try {
        var text = fs_1.readFileSync(path, 'utf-8');
        return parseText(text);
    }
    catch (e) {
        throw new Error(path + ': ' + e.message + '\n');
    }
}
exports.parseFile = parseFile;
function parseLink(path, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var text, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, parseGitHubProject(path)];
                case 1:
                    text = _a.sent();
                    return [2 /*return*/, parseText(text)];
                case 2:
                    e_1 = _a.sent();
                    throw new Error(path + ': ' + e_1.message + '\n');
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.parseLink = parseLink;
/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
function parseText(text) {
    try {
        var _a = JSON.parse(text), dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        if (dependencies || devDependencies) {
            return new models_1.PackageObject(dependencies, devDependencies);
        }
        else
            throw new Error('Dependencies fields not found.');
    }
    catch (e) {
        throw new Error('Error in package.json format. ' + e.message);
    }
}
exports.parseText = parseText;
function parseGitHubProject(path) {
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
function parseObjects(packages, options) {
    var _a;
    if (options === void 0) { options = {}; }
    return (_a = new DependenciesService()).merge.apply(_a, packages).extract(options);
}
exports.parseObjects = parseObjects;
