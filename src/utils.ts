import chalk from 'chalk';

export function warn(message: string) {
  console.warn(chalk.yellow(message + '\n'));
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
