# packages-parser
Parses project dependencies and merges it to single package.json

## Install
```bash
npm i -g packages-parser
```
or use `npx`
```bash
npx packages-parser
```

## Usage
```bash
packages-parser <...paths to package.json or links of GitHub project> [options]
```
or use `npx`
```bash
npx packages-parser <...paths to package.json or links of GitHub project> [options]
```

## Options
Options are not required

| Option    | Alias | Type        | Default            | Description                               |
| --------- | ----- | ----------- | ------------------ | ----------------------------------------- |
| outFile   | `-o`  | `string`    | `"./package.json"` | Path to outFile  __(cli only)__           |
| rewrite   | `-r`  | `boolean`   | `false`            | Does rewrites outFile __(cli only)__      |
| filter    | `-f`  | `prod, dev` | `false`            | Returns only `prod` or `dev` dependencies |
| latest    | `-l`  | `boolean`   | `false`            | Replaces versions with `"latest"`         |
| save      | `-s`  | `boolean`   | `false`            | Saves all dependencies as `dependencies`  |
| saveOrder |       | `boolean`   | `false`            | Doesn't sort dependencies                 |

## API
```ts
/**
 * Merges packages dependencies
 * @param {{ dependencies?: any, devDependencies?: any }[]} packages
 * @param options.filter Returns only `prod` or `dev` dependencies
 * @param options.latest Replace versions with `"latest"`
 * @param options.save Save all dependencies as `prod`
 * @param options.saveOrder Doesn't sort dependencies
 */
export function mergePackages(packages: Array<Partial<IPackageObject>>, options: Partial<IOptions> = {}) {
	// ...
}

/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
export function parseFile(path: string): IPackageObject {
	// ...
}

/**
 * Parses `dependencies` and `devDependencies` fields from package.json of GitHub project.
 */
export async function parseProject(path: string): Promise<IPackageObject> {
	// ...
}

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string): IPackageObject {
	// ...
}
```

## Interfaces
```ts
export interface IOptions extends CommandLineOptions {
  paths: string[];
  outFile: string;
  rewrite?: boolean;
  filter?: 'prod' | 'dev';
  latest?: boolean;
  save?: boolean;
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
export interface IPackageObject {
  [key: string]: any;
  dependencies: IDependencies;
  devDependencies: IDependencies;
}
```