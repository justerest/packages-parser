/**
 * @example
 * ```javascript
 * const dependencies = {
 *   axios: {
 *     version: '^1.0.0',
 *     isProd: true,
 *   },
 * };
 * ```
 */
export interface ITransformedDependencies {
  [name: string]: {
    version: string;
    isProd: boolean;
  };
}
