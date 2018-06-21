import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import { IDependencies, IOptions, IPackageObject, ITransformedDependencies } from './models';

/**
 * Merges packages dependencies
 * @param options.filter Returns only `prod` or `dev` dependencies
 * @param options.latest Replace versions with `"latest"`
 * @param options.save Save all dependencies as `prod`
 * @param options.saveOrder Doesn't sort dependencies
 */
export function mergePackages(
  packages: Array<Partial<IPackageObject>>,
  options: Partial<IOptions> = {},
) {
  const state: ITransformedDependencies = {};

  const saveDependencies = (
    dependencies: IDependencies = {},
    type: IOptions['filter'] = 'prod',
  ) => {
    Object.keys(dependencies).forEach((packageName) => {
      const savedDependency = state[packageName] || {};

      const savedVersion = savedDependency.version || '0.0.0';
      const version = dependencies[packageName];
      const [latestVersion] = [savedVersion, version].sort().reverse();

      state[packageName] = {
        version: latestVersion,
        isProd: savedDependency.isProd || type !== 'dev',
      };
    });
  };

  packages.forEach(({ dependencies, devDependencies }) => {
    saveDependencies(dependencies, 'prod');
    saveDependencies(devDependencies, 'dev');
  });

  const packagesNames = Object.keys(state);
  if (!options.saveOrder) packagesNames.sort();

  const sortedState = packagesNames.reduce((container, packageName) => {
    const dependency = Object.assign({}, state[packageName]);

    const isFilterPassed = (
      options.filter !== 'dev' && dependency.isProd ||
      options.filter !== 'prod' && !dependency.isProd
    );

    if (isFilterPassed) {
      if (options.latest) dependency.version = 'latest';
      if (options.save) dependency.isProd = true;
      container[packageName] = dependency;
    }

    return container;
  }, {} as ITransformedDependencies);

  return Object.keys(sortedState).reduce((result, key) => {
    const { version, isProd } = sortedState[key];
    const type = isProd ? 'dependencies' : 'devDependencies';

    result[type][key] = version;

    return result;
  }, { dependencies: {}, devDependencies: {} } as IPackageObject);
}

/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
export function parseFile(path: string): IPackageObject {
  try {
    const text = readFileSync(path, 'utf-8');
    return parseText(text);
  }
  catch (e) {
    throw new Error(path + ': ' + e.message + '\n');
  }
}

/**
 * Parses `dependencies` and `devDependencies` fields from package.json of GitHub project.
 */
export async function parseProject(path: string): Promise<IPackageObject> {
  const link = path.replace('github', 'raw.githubusercontent')
    .replace(/\/*$/, '')
    .concat('/master/package.json');
  try {
    const response = await fetch(link);
    const text = await response.text();
    return parseText(text);
  }
  catch (e) {
    throw new Error(path + ': ' + e.message + '\n');
  }
}

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string): IPackageObject {
  try {
    const { dependencies, devDependencies }: Partial<IPackageObject> = JSON.parse(text);
    if (dependencies || devDependencies) {
      return {
        dependencies: dependencies || {},
        devDependencies: devDependencies || {},
      };
    }
    else throw new Error('Dependencies fields not found.');
  }
  catch (e) {
    throw new Error('Error in package.json format. ' + e.message);
  }
}
