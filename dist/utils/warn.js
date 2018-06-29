"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
/**
 * Colored `console.warn`
 * @private
 */
function warn() {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    messages.push('\n');
    console.warn(chalk_1.default.yellow.apply(chalk_1.default, messages));
}
exports.warn = warn;
