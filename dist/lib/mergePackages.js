"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageObject_1 = require("../models/PackageObject");
var getLatestVersion_1 = require("../utils/getLatestVersion");
var state;
/**
 * Merges packages dependencies
 * @param options.filter Returns only `prod` or `dev` dependencies
 * @param options.latest Replace versions with `"latest"`
 * @param options.save Save all dependencies as `prod`
 * @param options.saveOrder Doesn't change dependencies order
 */
function mergePackages(packages, options) {
    if (options === void 0) { options = {}; }
    state = {};
    packages.forEach(function (_a) {
        var dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        saveDependencies(dependencies, 'prod');
        saveDependencies(devDependencies, 'dev');
    });
    applyOptions(options);
    return Object.keys(state).reduce(function (result, key) {
        var _a = state[key], version = _a.version, isProd = _a.isProd;
        var type = isProd ? 'dependencies' : 'devDependencies';
        result[type][key] = version;
        return result;
    }, new PackageObject_1.PackageObject());
}
exports.mergePackages = mergePackages;
function applyOptions(options) {
    var packagesNames = Object.keys(state);
    if (!options.saveOrder)
        packagesNames.sort();
    state = packagesNames.reduce(function (container, packageName) {
        var dependency = Object.assign({}, state[packageName]);
        var isFilterPassed = ((options.filter !== 'dev' && dependency.isProd ||
            options.filter !== 'prod' && !dependency.isProd));
        if (isFilterPassed) {
            if (options.latest)
                dependency.version = 'latest';
            if (options.save)
                dependency.isProd = true;
            container[packageName] = dependency;
        }
        return container;
    }, {});
}
function saveDependencies(dependencies, type) {
    if (dependencies === void 0) { dependencies = {}; }
    if (type === void 0) { type = 'prod'; }
    Object.keys(dependencies).forEach(function (packageName) {
        var savedDependency = state[packageName] || {};
        var savedVersion = savedDependency.version || '^0.0.0';
        var version = dependencies[packageName];
        state[packageName] = {
            version: getLatestVersion_1.getLatestVersion(savedVersion, version),
            isProd: savedDependency.isProd || type !== 'dev',
        };
    });
}
