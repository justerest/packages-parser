import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import { IDependencies, IOptions, ITransformedDependencies, PackageObject } from './models';

export class DependenciesService {

  private state: ITransformedDependencies = {};

  public merge(...packages: Array<Partial<PackageObject>>) {
    packages.forEach(({ dependencies, devDependencies }) => {
      this.add(dependencies, 'prod');
      this.add(devDependencies, 'dev');
    });

    return this;
  }

  public extract(options: Partial<IOptions> = {}) {
    const optionalDependencies = this.getOptionalDependencies(options);
    return Object.keys(optionalDependencies)
      .reduce((result, key) => {
        const { version, isProd } = optionalDependencies[key];
        result[isProd ? 'dependencies' : 'devDependencies'][key] = version;
        return result;
      }, new PackageObject());
  }

  private add(dependencies: IDependencies = {}, type: IOptions['filter'] = 'prod') {
    Object.keys(dependencies).forEach((packageName) => {
      const version = dependencies[packageName];
      const currentVersion = this.state[packageName] ? this.state[packageName].version : '0.0.0';
      const [latestVersion] = [currentVersion, version].sort().reverse();

      this.state[packageName] = {
        version: latestVersion,
        isProd: this.state[packageName] && this.state[packageName].isProd || type !== 'dev',
      };
    });
  }

  private getOptionalDependencies(options: Partial<IOptions>) {
    const packageNames = Object.keys(this.state);
    if (!options.saveOrder) packageNames.sort();

    return packageNames.reduce((result, key) => {
      const dependency = this.state[key];

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
    }, {} as ITransformedDependencies);
  }

}

export function parseFile(path: string, options: Partial<IOptions> = {}) {
  try {
    const text = readFileSync(path, 'utf-8');
    return parseText(text);
  }
  catch (e) {
    throw new Error(path + ': ' + e.message + '\n');
  }
}

export async function parseLink(path: string, options: Partial<IOptions> = {}) {
  try {
    const text = await parseGitHubProject(path);
    return parseText(text);
  }
  catch (e) {
    throw new Error(path + ': ' + e.message + '\n');
  }
}

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string) {
  try {
    const { dependencies, devDependencies }: Partial<PackageObject> = JSON.parse(text);
    if (dependencies || devDependencies) {
      return new PackageObject(dependencies, devDependencies);
    }
    else throw new Error('Dependencies fields not found.');
  }
  catch (e) {
    throw new Error('Error in package.json format. ' + e.message);
  }
}

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

export function parseObjects(packages: Array<Partial<PackageObject>>, options: Partial<IOptions> = {}) {
  return new DependenciesService()
    .merge(...packages)
    .extract(options);
}
