#!/usr/bin/env node
import chalk from 'chalk';
import commandLineArgs = require('command-line-args');
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mergePackages, parseFile, parseProject } from '.';
import { IOptions } from './models/IOptions';
import { PackageObject } from './models/PackageObject';
import { sizeOf } from './utils/sizeOf';
import { unique } from './utils/unique';
import { warn } from './utils/warn';

const options = commandLineArgs([
  { name: 'paths', multiple: true, defaultOption: true, defaultValue: [] },
  { name: 'outFile', alias: 'o', type: String, defaultValue: './package.json' },
  { name: 'rewrite', alias: 'r', type: Boolean },
  { name: 'filter', alias: 'f', type: String, defaultValue: 'none' },
  { name: 'latest', alias: 'l', type: Boolean },
  { name: 'save', alias: 's', type: Boolean },
  { name: 'saveOrder', type: Boolean },
]) as IOptions;

(async function main() {
  const packageJson = new PackageObject();
  packageJson.name = 'parsed-packages';

  if (existsSync(options.outFile)) {
    try {
      Object.assign(packageJson, JSON.parse(readFileSync(options.outFile, 'utf-8')));
      if (!options.rewrite) options.paths.push(options.outFile);
    }
    catch (e) {
      warn(options.outFile + ': Bad output file. ' + e.message + '\n');
      if (!options.rewrite) {
        throw new Error(chalk.bgRed('Use --rewrite (-r) option to override bad output file'));
      }
    }
  }

  const packages = await Promise.all(
    options.paths.filter(unique()).map(async (path) => {
      try {
        return path.match(/^http/i)
          ? await parseProject(path)
          : parseFile(path);
      }
      catch (e) {
        warn(e.message);
        return {};
      }
    }),
  );

  Object.assign(packageJson, mergePackages(packages, options));

  writeFileSync(options.outFile, JSON.stringify(packageJson, null, 2));
  console.log(chalk.greenBright(
    `dependencies: ${sizeOf(packageJson.dependencies)};\n` +
    `devDependencies: ${sizeOf(packageJson.devDependencies)};`,
  ));
})();
