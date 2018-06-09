import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';

const DEPS_REGEXP = /dependencies":{[a-z0-9:^.@\/\-,"]*}/gi;

(async function main() {
  const args = process.argv.slice(2);

  const allDeps: string[][] = await Promise.all(args.map(parsePkgJson));
  const oldDeps = await parsePkgJson('./dist/package.json');
  allDeps.push(oldDeps);

  const list: string[] = getUnique(flatten(allDeps).map(updateVersion)).sort();

  writeFileSync('./dist/package.json', toPkgJson(list));
  console.log(chalk.greenBright(
    `Completed.\n\n` +
    `New: ${list.length - oldDeps.length};\n` +
    `Total: ${list.length};`,
  ));
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

function getUnique<T>(item: T[]) {
  return Array.from(new Set(item));
}

function getPkgJsonFromGithub(path: string): Promise<string> {
  const link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
  return fetch(link).then((res) => res.text());
}

function updateVersion(dependency: string) {
  return dependency.replace(/:"([a-z0-9^.@\/\-,]*)"/g, ': "latest"');
}

function toPkgJson(dependencies: string[]) {
  return JSON.stringify(JSON.parse(`{"dependencies":{${dependencies}}}`), null, 2);
}

function warn(message: string) {
  console.warn(chalk.yellow(message));
}
