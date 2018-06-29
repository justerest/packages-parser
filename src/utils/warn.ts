import chalk from 'chalk';

/**
 * Colored `console.warn`
 * @private
 */
export function warn(...messages: string[]) {
  messages.push('\n');
  console.warn(chalk.yellow(...messages));
}
