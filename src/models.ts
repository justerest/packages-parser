import { CommandLineOptions } from 'command-line-args';

export interface IOptions extends CommandLineOptions {
  src: string[];
  outFile: string;
  filter?: 'prod' | 'dev';
  latest?: boolean;
  save?: boolean;
  rewrite?: boolean;
  saveOrder?: boolean;
}

/**
 * @example
 * ```javascript
 * const dependencies = {
 *   axios: '^1.0.0',
 * };
 * ```
 */
export interface IDependencies {
  [name: string]: string;
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
export interface ITransformedDependencies {
  [name: string]: {
    version: string;
    isProd: boolean;
  };
}

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
