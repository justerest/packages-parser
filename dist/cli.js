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
var chalk_1 = require("chalk");
var commandLineArgs = require("command-line-args");
var fs_1 = require("fs");
var _1 = require(".");
var sizeOf_1 = require("./utils/sizeOf");
var warn_1 = require("./utils/warn");
var options = commandLineArgs([
    { name: 'paths', multiple: true, defaultOption: true, defaultValue: [] },
    { name: 'out', alias: 'o', type: String, defaultValue: './package.json' },
]);
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var packageJson, packages;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageJson = {};
                    if (fs_1.existsSync(options.out)) {
                        try {
                            Object.assign(packageJson, JSON.parse(fs_1.readFileSync(options.out, 'utf-8')));
                        }
                        catch (e) {
                            warn_1.warn(options.out + ': Bad output file. ' + e.message + '\n');
                        }
                    }
                    return [4 /*yield*/, Promise.all(options.paths.map(function (path) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, e_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 4, , 5]);
                                        if (!path.match(/^http/i)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, _1.parseProject(path)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = _1.parseFile(path);
                                        _b.label = 3;
                                    case 3: return [2 /*return*/, _a];
                                    case 4:
                                        e_1 = _b.sent();
                                        warn_1.warn(e_1.message);
                                        return [2 /*return*/, {}];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    packages = _a.sent();
                    Object.assign(packageJson, _1.mergePackages(packages));
                    fs_1.writeFileSync(options.out, JSON.stringify(packageJson, null, 2));
                    console.log(chalk_1.default.greenBright("dependencies: " + sizeOf_1.sizeOf(packageJson.dependencies) + ";\n" +
                        ("devDependencies: " + sizeOf_1.sizeOf(packageJson.devDependencies) + ";")));
                    return [2 /*return*/];
            }
        });
    });
})();
