import { readFileSync } from 'fs';
import { IPackageObject } from '../models/IPackageObject';
import { parseText } from './parseText';

/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
export function parseFile(path: string): IPackageObject {
  try {
    const text = readFileSync(path, 'utf-8');
    return parseText(text);
  }
  catch (e) {
    e.message = path + ': ' + e.message + '\n';
    throw e;
  }
}
