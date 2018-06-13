#!/usr/bin/env node
import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mergeDependencies, parsePackageJson, splitDependencies } from './api';
import { IDependencies, IOptions, IPackageJson } from './models';
import { sizeOf, unique } from './utils';

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

packagesParser(options.src.filter(unique()));

export * from './api';
export async function packagesParser(paths: string[] = [], params?: IOptions) {
  Object.assign(options, params);
  if (existsSync(options.outFile) && !options.rewrite) paths.push(options.outFile);

  const allDependencies = await Promise.all(paths.map(parsePackageJson));
  const result = applyOptions(mergeDependencies(...allDependencies));

  writeFileSync(options.outFile, toPackageJson(result));

  const allDependenciesCount = allDependencies.reduce((size, deps) => sizeOf(deps) + size, 0);
  console.log(chalk.greenBright(
    `Parsed: ${allDependenciesCount};\n` +
    `Unique: ${sizeOf(result)};`,
  ));
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
  if (existsSync(options.outFile)) {
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
