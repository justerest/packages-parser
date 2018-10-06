import fetch from 'node-fetch';
import { IPackageObject } from '../models/IPackageObject';
import { parseText } from './parseText';

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
    e.message = path + ': ' + e.message + '\n';
    throw e;
  }
}
