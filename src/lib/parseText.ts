import { PackageObject } from '../models/PackageObject';

/**
 * Parses `dependencies` and `devDependencies` fields from JSON text
 */
export function parseText(text: string): PackageObject {
  try {
    const { dependencies, devDependencies }: Partial<PackageObject> = JSON.parse(text);
    if (dependencies || devDependencies) {
      return new PackageObject(dependencies, devDependencies);
    }
    else
      throw new Error('Dependencies fields not found.');
  }
  catch (e) {
    throw new Error('Error in package.json format. ' + e.message);
  }
}
