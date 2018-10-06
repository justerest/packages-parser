# packages-parser [![npm version](https://badge.fury.io/js/packages-parser.svg)](http://badge.fury.io/js/packages-parser)

Gets projects dependencies and merges they to a single file

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
packages-parser -o parsed-packages.json <...paths to package.json or links of GitHub project>
```
or use `npx`
```bash
npx packages-parser -o parsed-packages.json <...paths to package.json or links of GitHub project>
```

## Options

| Option | Alias | Type     | Default            | Description     |
| ------ | ----- | -------- | ------------------ | --------------- |
| --out  | -o    | `string` | `'./package.json'` | Output filename |

## API
```ts
/**
 * Merges packages dependencies
 */
export function mergePackages(packages: IPackageObject[]): Required<IPackageObject> {

/**
 * Returns latest version
 * 
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

interface IPackageObject {
  dependencies?: IDependencies;
  devDependencies?: IDependencies;
}

interface IDependencies {
  [name: string]: string;
}
```
