import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';

const ARGS = process.argv.slice(2);

(async function main() {
  const files = ARGS.length
    ? ARGS.map(parseDependencies)
    : [parseDependencies('./package.json')];

  const allDeps = await Promise.all(files);

  const list = allDeps.join('\n')
    .replace(/\n\n/g, '\n')
    .replace(/:(.\d*\.\d*\.\d*|\w*)/g, '')
    .replace(/,/g, '\n')
    .split('\n');

  const uniqueList = Array.from(new Set(list));

  const result = uniqueList
    .sort()
    .map((s) => s + ';Последняя версия')
    .map((s) => s + ';Сообщество разработчиков')
    .map((s) => s + ';\\\\orgName')
    .map((s) => s + ';децентрализованная')
    .map((s) => s + ';\\\\orgName')
    .map((s) => s + ';\\\\orgName')
    .map((s) => s + ';нет')
    .map((s) => s + ';нет')
    .map((s) => s + ';сегмент разработки ЛВС \\\\orgName')
    .map(addSite)
    .map((s) => s + ';Производителем не установлен')
    .map((s) => s + ';Средство для web-разработки')
    .map((s) => s + ';\\\\orgName')
    .map((s) => s + ';\\\\docNumber')
    .join('\n');

  writeFileSync('./parsed-packages.csv', result);
  console.log(chalk.greenBright(`Completed. Load ${uniqueList.length}`));
})();

async function parseDependencies(path: string): Promise<string> {
  try {
    const text = path.match(/^http/i)
      ? await getPkgJsonFromGithub(path)
      : readFileSync(path, 'utf-8');

    const dirtyList = text
      .replace(/(\n|\s|")/g, '')
      .match(/dependencies:{[a-z0-9:^.@\/\-,]*}/gi);

    if (dirtyList) {
      return dirtyList.map((dirtyDepStr) => dirtyDepStr.slice(14, -1)).join(',');
    }
    else {
      warnNotFound(path);
      return '';
    }
  }
  catch (e) {
    warnNotFound(path);
    return '';
  }
}

function getPkgJsonFromGithub(projectPath: string): Promise<string> {
  const link = projectPath.replace('github', 'raw.githubusercontent') + '/master/package.json';
  return fetch(link).then((res) => res.text());
}

function addSite(pkgInfo: string) {
  const [name] = pkgInfo.split(';');
  return pkgInfo + ';https://www.npmjs.com/package/' + name;
}

function warnNotFound(path: string) {
  console.warn(chalk.yellow(`Dependencies fields not found in ${path}`));
}
