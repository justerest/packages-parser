export const enum DependencyType {
  DEV,
  PROD,
}

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
export interface ITransformedDependency {
  version: string;
  type: DependencyType;
}
