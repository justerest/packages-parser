import chalk from 'chalk';
import fetch from 'node-fetch';
import { IDependencies, INameVersion, IPackageJson } from './models';
import { readFileAsync } from './utils';

/**
 * Parses dependencies from file or GitHub project
 * @param path path to file | link to GitHub project
 */
export async function parsePackageJson(path: string) {
  try {
    const jsonText = path.match(/^http/i)
      ? await parseGitHubProject(path)
      : await readFileAsync(path);

    return parseDependencies(jsonText);
  }
  catch (e) {
    console.warn(chalk.yellow(path + ': ' + e.message + '\n'));
    return {};
  }
}

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseDependencies(text: string) {
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

export function formateDependencies(dependencies: INameVersion, isProd = false) {
  return Object.keys(dependencies)
    .reduce((result, key) => {
      result[key] = {
        version: dependencies[key],
        isProd,
      };

      return result;
    }, {} as IDependencies);
}

export function mergeDependencies(...depsArr: IDependencies[]) {
  const result = new Proxy({} as IDependencies, {
    set(obj, prop: string, value: IDependencies[string]) {
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
export async function parseGitHubProject(path: string) {
  const link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
  try {
    const response = await fetch(link);
    return response.text();
  }
  catch (e) {
    throw new Error('Error in request. ' + e.message);
  }
}

export function splitDependencies(dependencies: IDependencies) {
  return Object.keys(dependencies)
    .reduce((result, key) => {
      const { version, isProd } = dependencies[key];
      const type = isProd ? 'dependencies' : 'devDependencies';

      result[type][key] = version;

      return result;
    }, { dependencies: {}, devDependencies: {} } as { dependencies: INameVersion, devDependencies: INameVersion });
}
