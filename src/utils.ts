import { readFile } from 'fs';

/**
 * @private
 */
export async function readFileAsync(path: string) {
  return new Promise<string>((resolve, reject) => {
    readFile(path, (e, data) => {
      if (e) {
        reject(new Error('Error in file reading. ' + e.message));
      }
      else resolve(data.toString('utf-8'));
    });
  });
}

/**
 * Filters unique values
 * @example
 * array.filter(unique());
 */
export function unique() {
  const incluededValues = new Set();

  return (el: any) => {
    if (incluededValues.has(el)) return false;
    else {
      incluededValues.add(el);
      return true;
    }
  };
}

/**
 * Gets size of object
 * @private
 */
export function sizeOf(obj: {}) {
  return Object.keys(obj).length;
}
