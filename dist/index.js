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
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var node_fetch_1 = require("node-fetch");
/**
 * Merges packages dependencies
 * @param options.filter Returns only `prod` or `dev` dependencies (false)
 * @param options.latest Replace versions with `"latest"` (false)
 * @param options.save Save all dependencies as `prod` (false)
 * @param options.saveOrder Doesn't sort dependencies (false)
 */
function mergePackages(packages, options) {
    if (options === void 0) { options = {}; }
    var state = {};
    var saveDependencies = function (dependencies, type) {
        if (dependencies === void 0) { dependencies = {}; }
        if (type === void 0) { type = 'prod'; }
        Object.keys(dependencies).forEach(function (packageName) {
            var savedDependency = state[packageName] || {};
            var savedVersion = savedDependency.version || '0.0.0';
            var version = dependencies[packageName];
            var latestVersion = [savedVersion, version].sort().reverse()[0];
            state[packageName] = {
                version: latestVersion,
                isProd: savedDependency.isProd || type !== 'dev',
            };
        });
    };
    packages.forEach(function (_a) {
        var dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        saveDependencies(dependencies, 'prod');
        saveDependencies(devDependencies, 'dev');
    });
    var packagesNames = Object.keys(state);
    if (!options.saveOrder)
        packagesNames.sort();
    var sortedState = packagesNames.reduce(function (container, packageName) {
        var dependency = Object.assign({}, state[packageName]);
        var isFilterPassed = (options.filter !== 'dev' && dependency.isProd ||
            options.filter !== 'prod' && !dependency.isProd);
        if (isFilterPassed) {
            if (options.latest)
                dependency.version = 'latest';
            if (options.save)
                dependency.isProd = true;
            container[packageName] = dependency;
        }
        return container;
    }, {});
    return Object.keys(sortedState).reduce(function (result, key) {
        var _a = sortedState[key], version = _a.version, isProd = _a.isProd;
        var type = isProd ? 'dependencies' : 'devDependencies';
        result[type][key] = version;
        return result;
    }, { dependencies: {}, devDependencies: {} });
}
exports.mergePackages = mergePackages;
/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
function parseFile(path) {
    try {
        var text = fs_1.readFileSync(path, 'utf-8');
        return parseText(text);
    }
    catch (e) {
        throw new Error(path + ': ' + e.message + '\n');
    }
}
exports.parseFile = parseFile;
/**
 * Parses `dependencies` and `devDependencies` fields from package.json of GitHub project.
 */
function parseProject(path) {
    return __awaiter(this, void 0, void 0, function () {
        var link, response, text, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
                    return [4 /*yield*/, node_fetch_1.default(link)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    return [2 /*return*/, parseText(text)];
                case 3:
                    e_1 = _a.sent();
                    throw new Error(path + ': ' + e_1.message + '\n');
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.parseProject = parseProject;
/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
function parseText(text) {
    try {
        var _a = JSON.parse(text), dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        if (dependencies || devDependencies) {
            return {
                dependencies: dependencies || {},
                devDependencies: devDependencies || {},
            };
        }
        else
            throw new Error('Dependencies fields not found.');
    }
    catch (e) {
        throw new Error('Error in package.json format. ' + e.message);
    }
}
exports.parseText = parseText;
