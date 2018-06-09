import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';

const DEPS_REGEXP = /dependencies":{[a-z0-9:^.@\/\-,"]*}/gi;

(async function main() {
  const args = process.argv.slice(2);
  args.push('./dist/package.json');

  const allDeps: string[][] = await Promise.all(args.map(parsePkgJson));
  const list = getUnique(flatten(allDeps).map(updateVersions)).sort();

  writeFileSync('./dist/package.json', toPkgJsonFormat(list));
  console.log(chalk.greenBright(`Completed. Dependencies count: ${list.length}`));
})();

async function parsePkgJson(path: string) {
  try {
    const text = path.match(/^http/i)
      ? await getPkgJsonFromGithub(path)
      : readFileSync(path, 'utf-8');

    const dependencies = text
      .replace(/(\n|\s)/g, '')
      .match(DEPS_REGEXP);

    if (dependencies) {
      return dependencies
        .map((dirtyDepStr) => dirtyDepStr.slice(15, -1))
        .filter(Boolean)
        .join(',')
        .split(',');
    }
    else {
      warn(`Dependencies fields not found in ${path}`);
      return [];
    }
  }
  catch (e) {
    warn(`package.json not found in ${path}`);
    return [];
  }
}

function flatten<T>(doubleArr: T[][]) {
  return doubleArr.reduce((flatArr, arr) => flatArr.concat(arr), []);
}

function getPkgJsonFromGithub(path: string): Promise<string> {
  const link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
  return fetch(link).then((res) => res.text());
}

function getUnique(dependencies: string[]) {
  return Array.from(new Set(dependencies));
}

function updateVersions(dependency: string) {
  return dependency.replace(/:"([a-z0-9^.@\/\-,]*)"/g, ': "latest"');
}

function toPkgJsonFormat(dependencies: string[]) {
  return JSON.stringify(JSON.parse(`{"dependencies":{${dependencies}}}`), null, 2);
}

function warn(message: string) {
  console.warn(chalk.yellow(message));
}
