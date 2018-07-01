"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VERSION_FORMAT = /^(\~|\^)?\d*\.\d*\.\d*$/;
function getLatestVersion() {
    var versions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        versions[_i] = arguments[_i];
    }
    var latestVersion = versions.filter(Boolean)
        .map(convertVersions(padZeroes))
        .sort()
        .map(convertVersions(trimZeroes))
        .pop();
    return latestVersion || 'latest';
}
exports.getLatestVersion = getLatestVersion;
function convertVersions(converter) {
    return function (version) {
        if (!isStandardVersion(version))
            return version;
        return version.match(/^(\~|\^)/)
            ? version.slice(0, 1) + converter(version.slice(1))
            : converter(version);
    };
}
/**
 * Inserts `0` into start of versions
 * @example
 * // 2.10.0 -> 002.010.000
 */
function padZeroes(version) {
    return version.split('.')
        .map(function (subV) { return subV.padStart(3, '0'); })
        .join('.');
}
/**
 * Removes `0` from start of versions
 * @example
 * // 002.010.000 -> 2.10.0
 */
function trimZeroes(version) {
    return version.split('.')
        .map(function (subV) { return subV.replace(/^0*/, '') || '0'; })
        .join('.');
}
function isStandardVersion(version) {
    return Boolean(version.match(VERSION_FORMAT));
}
