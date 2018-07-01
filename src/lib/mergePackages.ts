import { IDependencies } from '../models/IDependencies';
import { IOptions } from '../models/IOptions';
import { ITransformedDependencies } from '../models/ITransformedDependencies';
import { PackageObject } from '../models/PackageObject';
import { getLatestVersion } from './getLatestVersion';

let state: ITransformedDependencies;

/**
 * Merges packages dependencies
 * @param options.filter Returns only `prod` or `dev` dependencies
 * @param options.latest Replace versions with `"latest"`
 * @param options.save Save all dependencies as `prod`
 * @param options.saveOrder Doesn't change dependencies order
 */
export function mergePackages(
  packages: Array<Partial<PackageObject>>,
  options: Partial<IOptions> = {},
): PackageObject {
  state = {};

  packages.forEach(({ dependencies, devDependencies }) => {
    saveDependencies(dependencies, 'prod');
    saveDependencies(devDependencies, 'dev');
  });

  applyOptions(options);

  return Object.keys(state).reduce((result, key) => {
    const { version, isProd } = state[key];
    const type = isProd ? 'dependencies' : 'devDependencies';
    result[type][key] = version;
    return result;
  }, new PackageObject());
}

function saveDependencies(
  dependencies: IDependencies = {},
  type: IOptions['filter'] = 'prod',
) {
  Object.keys(dependencies).forEach((packageName) => {
    const savedDependency = state[packageName] || { version: '', isProd: false };
    state[packageName] = {
      version: getLatestVersion(savedDependency.version, dependencies[packageName]),
      isProd: savedDependency.isProd || type !== 'dev',
    };
  });
}

function applyOptions(options: Partial<IOptions>) {
  const packagesNames = Object.keys(state);
  if (!options.saveOrder) packagesNames.sort();

  state = packagesNames.reduce((container, packageName) => {
    const dependency = Object.assign({}, state[packageName]);
    const isFilterPassed = ((
      options.filter !== 'dev' && dependency.isProd ||
      options.filter !== 'prod' && !dependency.isProd
    ));

    if (isFilterPassed) {
      if (options.latest) dependency.version = 'latest';
      if (options.save) dependency.isProd = true;
      container[packageName] = dependency;
    }

    return container;
  }, {} as ITransformedDependencies);
}
