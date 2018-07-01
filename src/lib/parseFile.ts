import { readFileSync } from 'fs';
import { PackageObject } from '../models/PackageObject';
import { parseText } from './parseText';

/**
 * Parses `dependencies` and `devDependencies` fields from file
 */
export function parseFile(path: string): PackageObject {
  try {
    const text = readFileSync(path, 'utf-8');
    return parseText(text);
  }
  catch (e) {
    throw new Error(path + ': ' + e.message + '\n');
  }
}
