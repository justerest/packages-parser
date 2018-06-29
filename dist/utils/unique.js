"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
