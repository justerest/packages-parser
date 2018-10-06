"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
function parseText(text) {
    try {
        var _a = JSON.parse(text), _b = _a.dependencies, dependencies = _b === void 0 ? {} : _b, _c = _a.devDependencies, devDependencies = _c === void 0 ? {} : _c;
        return { dependencies: dependencies, devDependencies: devDependencies };
    }
    catch (e) {
        e.message = 'Error in package.json format. ' + e.message;
        throw e;
    }
}
exports.parseText = parseText;
