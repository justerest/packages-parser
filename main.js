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
var path_1 = require("path");
var DIST_PATH = './dist';
var RESULT_PATH = path_1.join(DIST_PATH, 'package.json');
var LATEST_VERSION = 'latest';
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, currentDeps, parsedDeps, list, parsedDepsSize;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2).filter(getUnique());
                    return [4 /*yield*/, parsePkgJson(RESULT_PATH)];
                case 1:
                    currentDeps = _a.sent();
                    return [4 /*yield*/, Promise.all(args.map(parsePkgJson))];
                case 2:
                    parsedDeps = _a.sent();
                    list = mergeDeps.apply(void 0, [currentDeps].concat(parsedDeps));
                    parsedDepsSize = parsedDeps
                        .reduce(function (size, deps) { return getSize(deps) + size; }, 0);
                    if (!fs_1.existsSync(DIST_PATH))
                        fs_1.mkdirSync(DIST_PATH);
                    fs_1.writeFileSync(RESULT_PATH, toPkgJson(list));
                    console.log(chalk_1.default.greenBright("Parsed: " + parsedDepsSize + ";\n" +
                        ("New: " + (getSize(list) - getSize(currentDeps)) + ";\n") +
                        ("Total: " + getSize(list) + ";")));
                    return [2 /*return*/];
            }
        });
    });
})();
function mergeDeps(currentDeps) {
    var parsedDeps = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        parsedDeps[_i - 1] = arguments[_i];
    }
    var result = new Proxy(Object.assign({}, currentDeps), {
        set: function (obj, prop, value) {
            var currentVersion = obj[prop] || '0.0.0';
            var lastVersion = [currentVersion, value].sort().reverse()[0];
            obj[prop] = lastVersion;
            return true;
        },
    });
    parsedDeps.forEach(function (deps) { return Object.assign(result, deps); });
    return result;
}
function getUnique() {
    var incluededValues = new Set();
    return function (el) {
        if (incluededValues.has(el))
            return false;
        else {
            incluededValues.add(el);
            return true;
        }
    };
}
function parsePkgJson(path) {
    return __awaiter(this, void 0, void 0, function () {
        var text, _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    if (!path.match(/^http/i)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchPkgJson(path)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, readFileAsync(path)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    text = _a;
                    return [2 /*return*/, parseDeps(text)];
                case 5:
                    e_1 = _b.sent();
                    console.warn(chalk_1.default.yellow((path + ': ' + e_1.message + '\n')));
                    return [2 /*return*/, {}];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/** Get package.json from GitHub project */
function fetchPkgJson(path) {
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
function readFileAsync(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.readFile(path, function (e, data) {
                        if (e) {
                            reject(new Error('Error in file reading. ' + e.message));
                        }
                        else
                            resolve(data.toString('utf-8'));
                    });
                })];
        });
    });
}
function parseDeps(text) {
    try {
        var _a = JSON.parse(text), dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        if (dependencies || devDependencies) {
            return Object.assign({}, dependencies, devDependencies);
        }
        else
            throw new Error('Dependencies fields not found.');
    }
    catch (e) {
        throw new Error('Error in package.json format. ' + e.message);
    }
}
function getSize(obj) {
    return Object.keys(obj).length;
}
function toPkgJson(dependencies) {
    var sortedDeps = Object.keys(dependencies)
        .sort()
        .reduce(function (res, key) {
        res[key] = dependencies[key];
        return res;
    }, {});
    var result = {
        name: 'parsed-dependencies',
        dependencies: sortedDeps,
    };
    return JSON.stringify(result, null, 2);
}
