#!/usr/bin/env node
import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { IDependencies, INameVersion, IOptions, IPackageJson } from './models';
import { readFileAsync, sizeOf, unique } from './utils';

// tslint:disable-next-line
const commandLineArgs: typeof import('command-line-args') = require('command-line-args');

/**
 * Global options
 */
const options = commandLineArgs([
  { name: 'src', multiple: true, defaultOption: true, defaultValue: [] },
  { name: 'outFile', alias: 'o', type: String, defaultValue: './package.json' },
  { name: 'filter', alias: 'f', type: String, defaultValue: 'none' },
  { name: 'latest', alias: 'l', type: Boolean },
  { name: 'save', alias: 's', type: Boolean },
  { name: 'rewrite', alias: 'r', type: Boolean },
  { name: 'saveOrder', type: Boolean },
]) as IOptions;

const isOutFileExist = existsSync(options.outFile);

(async function main() {
  const paths = options.src.filter(unique());
  if (isOutFileExist && !options.rewrite) paths.push(options.outFile);

  const allDependencies = await Promise.all(paths.map(parsePackageJson));
  const result = applyOptions(mergeDependencies(...allDependencies));

  writeFileSync(options.outFile, toPackageJson(result));

  const allDependenciesCount = allDependencies.reduce((size, deps) => sizeOf(deps) + size, 0);
  console.log(chalk.greenBright(
    `Parsed: ${allDependenciesCount};\n` +
    `Unique: ${sizeOf(result)};`,
  ));
})();

/**
 * Parses dependencies from file or GitHub project
 * @param path path to file | link to GitHub project
 */
async function parsePackageJson(path: string) {
  try {
    const text = path.match(/^http/i)
      ? await fetchPackageJson(path)
      : await readFileAsync(path);

    return parseDependencies(text);
  }
  catch (e) {
    console.warn(chalk.yellow(path + ': ' + e.message + '\n'));
    return {};
  }
}

/**
 * Gets package.json from GitHub project
 */
async function fetchPackageJson(path: string) {
  const link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
  try {
    const response = await fetch(link);
    return response.text();
  }
  catch (e) {
    throw new Error('Error in request. ' + e.message);
  }
}

/**
 * Parses `dependencies` and `devDependencies` fields from JSON
 */
function parseDependencies(text: string) {
  try {
    const { dependencies, devDependencies }: IPackageJson = JSON.parse(text);
    if (dependencies || devDependencies) {
      return mergeDependencies(
        formateDependencies(dependencies || {}, true),
        formateDependencies(devDependencies || {}),
      );
    }
    else throw new Error('Dependencies fields not found.');
  }
  catch (e) {
    throw new Error('Error in package.json format. ' + e.message);
  }
}

function formateDependencies(dependencies: INameVersion, isProd = false) {
  return Object.keys(dependencies)
    .reduce((result, key) => {
      result[key] = {
        version: dependencies[key],
        isProd,
      };

      return result;
    }, {} as IDependencies);
}

function mergeDependencies(...depsArr: IDependencies[]) {
  const result = new Proxy({} as IDependencies, {
    set(obj, prop: string, value: IDependencies[string]) {
      const currentVersion = obj[prop] ? obj[prop].version : '0.0.0';
      const lastVersion = [currentVersion, value.version].sort().reverse()[0];
      obj[prop] = {
        version: lastVersion,
        isProd: obj[prop] && obj[prop].isProd || value.isProd,
      };
      return true;
    },
  });

  depsArr.forEach((deps) => Object.assign(result, deps));

  return result;
}

/**
 * Converts dependencies object to formated package.json
 */
function toPackageJson(dependencies: IDependencies) {
  const result = getOutFile();
  Object.assign(result, splitDependencies(dependencies));
  return JSON.stringify(result, null, 2);
}

function getOutFile(pkgJson: IPackageJson = { name: 'parsed-packages' }) {
  if (isOutFileExist) {
    try {
      Object.assign(pkgJson, JSON.parse(readFileSync(options.outFile, 'utf-8')));
    }
    catch (e) {
      console.warn(chalk.yellow(options.outFile + ': Bad output file. ' + e.message + '\n'));
      if (!options.rewrite) {
        throw new Error(chalk.bgRed('Use --rewrite (-r) option to override bad output file'));
      }
    }
  }

  return pkgJson;
}

function splitDependencies(dependencies: IDependencies) {
  return Object.keys(dependencies)
    .reduce((result, key) => {
      const { version, isProd } = dependencies[key];
      const type = isProd ? 'dependencies' : 'devDependencies';

      result[type][key] = version;

      return result;
    }, { dependencies: {}, devDependencies: {} } as { dependencies: INameVersion, devDependencies: INameVersion });
}

function applyOptions(dependencies: IDependencies) {
  const keys = Object.keys(dependencies);

  if (!options.saveOrder) keys.sort();

  return keys.reduce((result, key) => {
    const dependency = dependencies[key];

    const isFilterPassed = (
      options.filter !== 'dev' && dependency.isProd ||
      options.filter !== 'prod' && !dependency.isProd
    );

    if (isFilterPassed) {
      result[key] = Object.assign({}, dependency);
      if (options.latest) result[key].version = 'latest';
      if (options.save) result[key].isProd = true;
    }

    return result;
  }, {} as IDependencies);
}
