"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLatestVersion() {
    var versions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        versions[_i] = arguments[_i];
    }
    var latestVersion = versions
        .map(function (version) {
        if (!version.match(/\./))
            return version;
        // insert `0` into start of versions (2.10.0 -> 02.10.00)
        var firstSymbol = version.slice(0, 1);
        return firstSymbol + version.slice(1)
            .split('.')
            .map(function (subV) { return subV.length < 2 ? '0' + subV : subV; })
            .join('.');
    })
        .sort()
        .map(function (version) {
        if (!version.match(/\./))
            return version;
        // (02.10.00 -> 2.10.0)
        var firstSymbol = version.slice(0, 1);
        return firstSymbol + version.slice(1)
            .split('.')
            .map(function (subV) { return subV.match(/^0/) ? subV.slice(1) : subV; })
            .join('.');
    })
        .pop();
    return latestVersion || 'latest';
}
exports.getLatestVersion = getLatestVersion;
