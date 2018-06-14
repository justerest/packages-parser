"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
function warn(message) {
    console.warn(chalk_1.default.yellow(message + '\n'));
}
exports.warn = warn;
/**
 * Filters unique values
 * @example
 * array.filter(unique());
 */
function unique() {
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
exports.unique = unique;
/**
 * Gets size of object
 * @private
 */
function sizeOf(obj) {
    return Object.keys(obj).length;
}
exports.sizeOf = sizeOf;
