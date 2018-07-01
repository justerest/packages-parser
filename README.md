# packages-parser [![npm version](https://badge.fury.io/js/packages-parser.svg)](http://badge.fury.io/js/packages-parser)

Gets projects dependencies and merges they to single package.json file

## Install
```bash
npm i -g packages-parser
```
or use `npx`
```bash
npx packages-parser <...arguments>
```

## Usage
```bash
packages-parser [options] <...paths to package.json or links of GitHub project>
```
or use `npx`
```bash
npx packages-parser [options] <...paths to package.json or links of GitHub project>
```

## Options
Options are not required

| Option    | Alias | Type            | Default            | Description                               |
| --------- | ----- | --------------- | ------------------ | ----------------------------------------- |
| outFile   | -o    | `string`        | `'./package.json'` | Path to outFile  __(cli only)__           |
| rewrite   | -r    | `boolean`       | `false`            | Does rewrites outFile __(cli only)__      |
| filter    | -f    | `'prod', 'dev'` | `false`            | Returns only `prod` or `dev` dependencies |
| latest    | -l    | `boolean`       | `false`            | Replaces versions with `'latest'`         |
| save      | -s    | `boolean`       | `false`            | Saves all dependencies as `dependencies`  |
| saveOrder |       | `boolean`       | `false`            | Doesn't sort dependencies                 |

## API
```ts
interface IPackageObject {
  [key: string]: any;
  dependencies: IDependencies;
  devDependencies: IDependencies;
}

interface IDependencies {
  [name: string]: string;
}

/**
 * Returns latest version from all
 * @example
 * getLatestVersion('^2.0.0', '^1.0.0') // '^2.0.0'
 * getLatestVersion('^2.0.0', '~1.0.0') // '~1.0.0'
 * getLatestVersion('latest', '^2.0.0') // 'latest'
 * getLatestVersion('latest', '~1.0.0') // '~1.0.0'
 * getLatestVersion('latest', 'next') // 'next'
 * getLatestVersion() // 'latest'
 */
function getLatestVersion(...versions: string[]): string

/**
 * Merges packages dependencies
 * @param options.filter Returns only `prod` or `dev` dependencies
 * @param options.latest Replace versions with `"latest"`
 * @param options.save Save all dependencies as `prod`
 * @param options.saveOrder Doesn't sort dependencies
 */
function mergePackages(
  packages: Array<Partial<IPackageObject>>,
  options: Partial<IOptions> = {},
): IPackageObject

/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
function parseFile(path: string): IPackageObject

/**
 * Parses `dependencies` and `devDependencies` fields from package.json of GitHub project.
 */
function parseProject(path: string): Promise<IPackageObject>

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
function parseText(text: string): IPackageObject
```
