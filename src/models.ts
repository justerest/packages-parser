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
export class DependenciesContainer {
  [name: string]: {
    version: string;
    isProd: boolean;
  };
  constructor({ dependencies, devDependencies }: Partial<IPackageObject> = {}) {
    if (dependencies) {
      Object.keys(dependencies).forEach((key) => {
        this[key] = {
          version: dependencies[key],
          isProd: true,
        };
      });
    }
    if (devDependencies) {
      Object.keys(devDependencies).forEach((key) => {
        this[key] = {
          version: devDependencies[key],
          isProd: false,
        };
      });
    }
  }
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
export interface IPackageObject {
  [key: string]: any;
  dependencies: IDependencies;
  devDependencies: IDependencies;
}
