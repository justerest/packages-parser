import { PackageObject } from '../models/PackageObject';

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string): PackageObject {
  try {
    const { dependencies, devDependencies }: Partial<PackageObject> = JSON.parse(text);
    if (!dependencies && !devDependencies) {
      throw new Error('Dependencies fields not found.');
    }
    return new PackageObject(dependencies, devDependencies);
  }
  catch (e) {
    e.message = 'Error in package.json format. ' + e.message;
    throw e;
  }
}
