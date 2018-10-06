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
Object.defineProperty(exports, "__esModule", { value: true });
var VERSION_FORMAT = /^(\~|\^)?\d*\.\d*\.\d*$/;
/**
 * Returns latest version from all
 *
 * @example
 * getLatestVersion('^2.0.0', '^1.0.0') // '^2.0.0'
 * getLatestVersion('^2.0.0', '~1.0.0') // '~1.0.0'
 * getLatestVersion('latest', '^2.0.0') // 'latest'
 * getLatestVersion('latest', '~1.0.0') // '~1.0.0'
 * getLatestVersion('latest', 'next') // 'next'
 * getLatestVersion() // 'latest'
 */
function getLatestVersion() {
    var versions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        versions[_i] = arguments[_i];
    }
    var _a = __read(versions.filter(Boolean)
        .map(convertVersions(padZeroes))
        .sort()
        .map(convertVersions(trimZeroes)), 1), latestVersion = _a[0];
    return latestVersion || 'latest';
}
exports.getLatestVersion = getLatestVersion;
function convertVersions(converter) {
    return function (version) {
        if (isStandardVersion(version)) {
            return version.match(/^(\~|\^)/)
                ? version.slice(0, 1) + converter(version.slice(1))
                : converter(version);
        }
        return version;
    };
}
/**
 * Inserts `0` into start of versions
 *
 * @example
 * padZeroes('2.10.0') // 002.010.000
 */
function padZeroes(version) {
    return version.split('.')
        .map(function (subV) { return subV.padStart(3, '0'); })
        .join('.');
}
/**
 * Removes `0` from start of versions
 *
 * @example
 * trimZeroes('002.010.000') // 2.10.0
 */
function trimZeroes(version) {
    return version.split('.')
        .map(function (subV) { return subV.replace(/^0*/, '') || '0'; })
        .join('.');
}
function isStandardVersion(version) {
    return Boolean(version.match(VERSION_FORMAT));
}
