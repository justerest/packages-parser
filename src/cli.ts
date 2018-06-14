#!/usr/bin/env node
import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { parseFile, parseLink, parseObjects } from './api';
import { IOptions, PackageObject } from './models';
import { sizeOf, unique, warn } from './utils';

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
  const packages = await Promise.all(
    options.src.filter(unique()).map(async (path) => {
      try {
        return path.match(/^http/i)
          ? await parseLink(path)
          : parseFile(path);
      }
      catch (e) {
        warn(e.message);
        return new PackageObject();
      }
    }),
  );

  const mergedPackages = parseObjects(packages, options);

  const defaultParams: Partial<PackageObject> = { name: 'parsed-packages' };
  if (existsSync(options.outFile)) {
    try {
      Object.assign(defaultParams, JSON.parse(readFileSync(options.outFile, 'utf-8')));
    }
    catch (e) {
      warn(options.outFile + ': Bad output file. ' + e.message + '\n');
      if (!options.rewrite) {
        throw new Error(chalk.bgRed('Use --rewrite (-r) option to override bad output file'));
      }
    }
  }

  const packageJson = JSON.stringify(Object.assign(defaultParams, mergedPackages), null, 2);

  writeFileSync(options.outFile, packageJson);
  console.log(chalk.greenBright(
    `dependencies: ${sizeOf(mergedPackages.dependencies)};\n` +
    `devDependencies: ${sizeOf(mergedPackages.devDependencies)};`,
  ));
})();
