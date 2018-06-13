import chalk from 'chalk';
import { existsSync, mkdirSync, readFile, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';

const DIST_PATH = join(__dirname, 'dist');
const RESULT_PATH = join(DIST_PATH, 'package.json');

interface IDependencies {
  [name: string]: string;
}

interface IPackageJson {
  [key: string]: any;
  dependencies?: IDependencies;
  devDependencies?: IDependencies;
}

(async function main() {
  const args = process.argv.slice(2).filter(unique());

  const currentDeps: IDependencies = await parsePackageJson(RESULT_PATH);
  const parsedDeps: IDependencies[] = await Promise.all(args.map(parsePackageJson));
  const list: IDependencies = mergeDeps(currentDeps, ...parsedDeps);

  const parsedDepsSize = parsedDeps.reduce((size, deps) => sizeOf(deps) + size, 0);

  if (!existsSync(DIST_PATH)) mkdirSync(DIST_PATH);
  writeFileSync(RESULT_PATH, toPackageJson(list));

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
 * Filters unique values
 * @example
 * array.filter(unique());
 */
function unique() {
  const incluededValues = new Set();

  return (el: any) => {
    if (incluededValues.has(el)) return false;
    else {
      incluededValues.add(el);
      return true;
    }
  };
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
      list[key] = dependencies[key];
      return list;
    }, {} as IDependencies);

  const result = {
    name: 'parsed-dependencies',
    dependencies: sortedDeps,
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Gets size of object
 * @private
 */
function sizeOf(obj: {}) {
  return Object.keys(obj).length;
}

/**
 * @private
 */
async function readFileAsync(path: string) {
  return new Promise<string>((resolve, reject) => {
    readFile(path, (e, data) => {
      if (e) {
        reject(new Error('Error in file reading. ' + e.message));
      }
      else resolve(data.toString('utf-8'));
    });
  });
}
