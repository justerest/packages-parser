#!/usr/bin/env node
import chalk from 'chalk';
import commandLineArgs = require('command-line-args');
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mergePackages, parseFile, parseProject } from '.';
import { IOptions } from './models/IOptions';
import { IPackageObject } from './models/IPackageObject';
import { sizeOf } from './utils/sizeOf';
import { warn } from './utils/warn';

const options = commandLineArgs([
  { name: 'paths', multiple: true, defaultOption: true, defaultValue: [] },
  { name: 'out', alias: 'o', type: String, defaultValue: './package.json' },
]) as IOptions;

(async function main() {
  const packageJson: IPackageObject = {};

  if (existsSync(options.out)) {
    try {
      Object.assign(packageJson, JSON.parse(readFileSync(options.out, 'utf-8')));
    }
    catch (e) {
      warn(options.out + ': Bad output file. ' + e.message + '\n');
    }
  }

  const packages = await Promise.all(
    options.paths.map(async (path) => {
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

  Object.assign(packageJson, mergePackages(packages));

  writeFileSync(options.out, JSON.stringify(packageJson, null, 2));
  console.log(chalk.greenBright(
    `dependencies: ${sizeOf(packageJson.dependencies)};\n` +
    `devDependencies: ${sizeOf(packageJson.devDependencies)};`,
  ));
})();
