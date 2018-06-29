"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var parseText_1 = require("./parseText");
/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
function parseFile(path) {
    try {
        var text = fs_1.readFileSync(path, 'utf-8');
        return parseText_1.parseText(text);
    }
    catch (e) {
        throw new Error(path + ': ' + e.message + '\n');
    }
}
exports.parseFile = parseFile;
