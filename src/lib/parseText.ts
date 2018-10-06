import { IPackageObject } from '../models/IPackageObject';

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string): IPackageObject {
  try {
    const { dependencies = {}, devDependencies = {} } = JSON.parse(text);
    return { dependencies, devDependencies };
  }
  catch (e) {
    e.message = 'Error in package.json format. ' + e.message;
    throw e;
  }
}
