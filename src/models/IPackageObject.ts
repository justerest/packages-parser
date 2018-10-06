import { IDependencies } from './IDependencies';

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
export interface IPackageObject {
  dependencies?: IDependencies;
  devDependencies?: IDependencies;
}
