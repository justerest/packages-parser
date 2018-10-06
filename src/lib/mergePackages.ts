import { IDependencies } from '../models/IDependencies';
import { IPackageObject } from '../models/IPackageObject';
import { DependencyType, ITransformedDependency } from '../models/ITransformedDependencies';
import { getLatestVersion } from './getLatestVersion';

const state: Map<string, ITransformedDependency> = new Map();

/**
 * Merges packages dependencies
 */
export function mergePackages(packages: IPackageObject[]): Required<IPackageObject> {
  state.clear();

  packages.forEach(({ dependencies, devDependencies }) => {
    saveDependencies(DependencyType.PROD, dependencies);
    saveDependencies(DependencyType.DEV, devDependencies);
  });

  return [...state.entries()].reduce((result, [packageName, dependency]) => {
    const dependencyType = dependency.type === DependencyType.PROD ? 'dependencies' : 'devDependencies';
    result[dependencyType][packageName] = dependency.version;
    return result;
  }, { dependencies: {}, devDependencies: {} });
}

function saveDependencies(type: DependencyType, dependencies: IDependencies = {}) {
  Object.keys(dependencies).forEach((packageName) => {
    const defaultValue = { version: '', type: DependencyType.DEV };
    const currentDependency: ITransformedDependency = state.has(packageName)
      ? state.get(packageName)
      : defaultValue;

    state.set(packageName, {
      version: getLatestVersion(currentDependency.version, dependencies[packageName]),
      type: getMaxDependencyType(currentDependency.type, type),
    });
  });
}

function getMaxDependencyType(...types: DependencyType[]): DependencyType {
  return types.sort().pop();
}
