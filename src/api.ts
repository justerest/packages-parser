import chalk from 'chalk';
import { existsSync } from 'fs';
import fetch from 'node-fetch';
import { DependenciesContainer, IDependencies, IOptions, IPackageObject } from './models';
import { readFileAsync } from './utils';

export async function packagesParser(paths: string[] = [], options: Partial<IOptions> = {}) {
  if (options.outFile && existsSync(options.outFile) && !options.rewrite) {
    paths.push(options.outFile);
  }
  const texts = await Promise.all(paths.map(parsePath));
  return parseStrings(texts, options);
}

export function parseStrings(texts: string[] = [], options: Partial<IOptions> = {}) {
  const packages = texts.map(parseText);
  return parseObjects(packages, options);
}

export function parseObjects(packages: Array<Partial<IPackageObject>> = [], options: Partial<IOptions> = {}) {
  const allDependencies = packages.map(({ dependencies, devDependencies }) => {
    return mergeDependencies(
      new DependenciesContainer({ dependencies }),
      new DependenciesContainer({ devDependencies }),
    );
  });
  const mergedDependencies = mergeDependencies(...allDependencies);
  const filteredDependencies = applyOptions(mergedDependencies, options);
  return splitDependencies(filteredDependencies);
}

function applyOptions(dependencies: DependenciesContainer, options: Partial<IOptions>) {
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
  }, new DependenciesContainer());
}

/**
 * Parses dependencies from file or GitHub project
 * @param path path to file | link to GitHub project
 */
export function parsePath(path: string) {
  try {
    return path.match(/^http/i)
      ? parseGitHubProject(path)
      : readFileAsync(path);
  }
  catch (e) {
    console.warn(chalk.yellow(path + ': ' + e.message + '\n'));
    return '';
  }
}

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string) {
  try {
    const { dependencies, devDependencies }: Partial<IPackageObject> = JSON.parse(text);
    if (dependencies || devDependencies) {
      return {
        dependencies: dependencies || {},
        devDependencies: devDependencies || {},
      } as IPackageObject;
    }
    else throw new Error('Dependencies fields not found.');
  }
  catch (e) {
    throw new Error('Error in package.json format. ' + e.message);
  }
}

function mergeDependencies(...depsArr: DependenciesContainer[]) {
  const result = new Proxy(new DependenciesContainer(), {
    set(obj, prop: string, value: DependenciesContainer[string]) {
      const currentVersion = obj[prop] ? obj[prop].version : '0.0.0';
      const [lastVersion] = [currentVersion, value.version].sort().reverse();

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
 * Gets package.json from GitHub project
 */
async function parseGitHubProject(path: string) {
  const link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
  try {
    const response = await fetch(link);
    return response.text();
  }
  catch (e) {
    throw new Error('Error in request. ' + e.message);
  }
}

function splitDependencies(dependencies: DependenciesContainer) {
  return Object.keys(dependencies)
    .reduce((result, key) => {
      const { version, isProd } = dependencies[key];
      const type = isProd ? 'dependencies' : 'devDependencies';

      result[type][key] = version;

      return result;
    }, { dependencies: {}, devDependencies: {} } as IPackageObject);
}
