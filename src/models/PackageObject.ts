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
export class PackageObject {
  [key: string]: any;
  constructor(
    public dependencies: IDependencies = {},
    public devDependencies: IDependencies = {},
  ) { }
}
