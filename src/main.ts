#!/usr/bin/env node
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';
import { IDependencies, IOptions, IPackageJson } from './models';
import { readFileAsync, sizeOf, unique } from './utils';

// tslint:disable-next-line
const commandLineArgs: typeof import('command-line-args') = require('command-line-args');

/**
 * Global options
 */
const options = commandLineArgs([
  { name: 'src', multiple: true, defaultOption: true, defaultValue: [] },
  { name: 'outFile', alias: 'o', type: String, defaultValue: join(__dirname, '../build/package.json') },
  { name: 'last', alias: 'l', type: Boolean },
]) as IOptions;

(async function main() {
  const args = options.src.filter(unique());

  const currentDeps: IDependencies = await parsePackageJson(options.outFile);
  const parsedDeps: IDependencies[] = await Promise.all(args.map(parsePackageJson));
  const list: IDependencies = mergeDeps(currentDeps, ...parsedDeps);

  const parsedDepsSize = parsedDeps.reduce((size, deps) => sizeOf(deps) + size, 0);

  writeFileSync(options.outFile, toPackageJson(list));

  console.log(chalk.greenBright(
    `Parsed: ${parsedDepsSize};\n` +
    `New: ${sizeOf(list) - sizeOf(currentDeps)};\n` +
    `Total: ${sizeOf(list)};`,
  ));
})();

function mergeDeps(...depsArr: IDependencies[]) {
  const result: IDependencies = new Proxy({} as IDependencies, {
    set(obj, prop: string, value: string) {
      const currentVersion = obj[prop] || '0.0.0';
      const lastVersion = [currentVersion, value].sort().reverse()[0];
      obj[prop] = lastVersion;
      return true;
    },
  });

  depsArr.forEach((deps) => Object.assign(result, deps));

  return result;
}

/**
 * Parses dependencies from file or GitHub project
 * @param path path to file | link to GitHub project
 */
async function parsePackageJson(path: string) {
  try {
    const text = path.match(/^http/i)
      ? await fetchPackageJson(path)
      : await readFileAsync(path);

    return parseText(text);
  }
  catch (e) {
    console.warn(chalk.yellow((path + ': ' + e.message + '\n')));
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
function parseText(text: string) {
  try {
    const { dependencies, devDependencies }: IPackageJson = JSON.parse(text);
    if (dependencies || devDependencies) {
      return mergeDeps(dependencies || {}, devDependencies || {});
    }
    else throw new Error('Dependencies fields not found.');
  }
  catch (e) {
    throw new Error('Error in package.json format. ' + e.message);
  }
}

/**
 * Converts dependencies object to formated package.json
 */
function toPackageJson(dependencies: IDependencies) {
  const sortedDeps = Object.keys(dependencies)
    .sort()
    .reduce((list, key) => {
      list[key] = options.last ? 'latest' : dependencies[key];
      return list;
    }, {} as IDependencies);

  const result = {
    name: 'parsed-dependencies',
    dependencies: sortedDeps,
  };

  return JSON.stringify(result, null, 2);
}
