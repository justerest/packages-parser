"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @example
 * ```javascript
 * const packages = {
 *   dependencies: {
 *     axios: '^1.0.0',
 *   },
 *   devDependencies: {
 *     express: '^1.0.0',
 *   },
 * };
 * ```
 */
var PackageObject = /** @class */ (function () {
    function PackageObject(dependencies, devDependencies) {
        if (dependencies === void 0) { dependencies = {}; }
        if (devDependencies === void 0) { devDependencies = {}; }
        this.dependencies = dependencies;
        this.devDependencies = devDependencies;
    }
    return PackageObject;
}());
exports.PackageObject = PackageObject;
