"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageObject_1 = require("../models/PackageObject");
/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
function parseText(text) {
    try {
        var _a = JSON.parse(text), dependencies = _a.dependencies, devDependencies = _a.devDependencies;
        if (!dependencies && !devDependencies) {
            throw new Error('Dependencies fields not found.');
        }
        return new PackageObject_1.PackageObject(dependencies, devDependencies);
    }
    catch (e) {
        throw new Error('Error in package.json format. ' + e.message);
    }
}
exports.parseText = parseText;
