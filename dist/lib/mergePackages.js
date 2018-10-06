"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var getLatestVersion_1 = require("./getLatestVersion");
var state = new Map();
/**
 * Merges packages dependencies
 */
function mergePackages(packages) {
    state.clear();
    packages.forEach(function (_a) {
        var dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        saveDependencies(1 /* PROD */, dependencies);
        saveDependencies(0 /* DEV */, devDependencies);
    });
    return __spread(state.entries()).reduce(function (result, _a) {
        var _b = __read(_a, 2), packageName = _b[0], dependency = _b[1];
        var dependencyType = dependency.type === 1 /* PROD */ ? 'dependencies' : 'devDependencies';
        result[dependencyType][packageName] = dependency.version;
        return result;
    }, { dependencies: {}, devDependencies: {} });
}
exports.mergePackages = mergePackages;
function saveDependencies(type, dependencies) {
    if (dependencies === void 0) { dependencies = {}; }
    Object.keys(dependencies).forEach(function (packageName) {
        var defaultValue = { version: '', type: 0 /* DEV */ };
        var currentDependency = state.has(packageName)
            ? state.get(packageName)
            : defaultValue;
        state.set(packageName, {
            version: getLatestVersion_1.getLatestVersion(currentDependency.version, dependencies[packageName]),
            type: getMaxDependencyType(currentDependency.type, type),
        });
    });
}
function getMaxDependencyType() {
    var types = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        types[_i] = arguments[_i];
    }
    return types.sort().pop();
}
