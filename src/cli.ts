#!/usr/bin/env node
import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { packagesParser } from './api';
import { IOptions } from './models';
import { sizeOf, unique } from './utils';

// tslint:disable-next-line
const commandLineArgs: typeof import('command-line-args') = require('command-line-args');

/**
 * Global options
 */
const options = commandLineArgs([
  { name: 'src', multiple: true, defaultOption: true, defaultValue: [] },
  { name: 'outFile', alias: 'o', type: String, defaultValue: './package.json' },
  { name: 'filter', alias: 'f', type: String, defaultValue: 'none' },
  { name: 'latest', alias: 'l', type: Boolean },
  { name: 'save', alias: 's', type: Boolean },
  { name: 'rewrite', alias: 'r', type: Boolean },
  { name: 'saveOrder', type: Boolean },
]) as IOptions;

(async function main() {
  const packages = await packagesParser(options.src.filter(unique()), options);

  const defaultParams = { name: 'parsed-packages' };
  if (existsSync(options.outFile)) {
    try {
      Object.assign(defaultParams, JSON.parse(readFileSync(options.outFile, 'utf-8')));
    }
    catch (e) {
      console.warn(chalk.yellow(options.outFile + ': Bad output file. ' + e.message + '\n'));
      if (!options.rewrite) {
        throw new Error(chalk.bgRed('Use --rewrite (-r) option to override bad output file'));
      }
    }
  }

  const packageJson = JSON.stringify(Object.assign(defaultParams, packages), null, 2);
  writeFileSync(options.outFile, packageJson);
  console.log(chalk.greenBright(
    `dependencies: ${sizeOf(packages.dependencies)};\n` +
    `devDependencies: ${sizeOf(packages.devDependencies)};`,
  ));
})();
