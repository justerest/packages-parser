import chalk from 'chalk';

/**
 * Colored `console.warn`
 * @private
 */
export function warn(...messages: string[]) {
  messages.push('\n');
  console.warn(chalk.yellow(...messages));
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
