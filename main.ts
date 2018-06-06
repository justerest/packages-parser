import chalk from 'chalk';
import { copy } from 'copy-paste';
import { readFileSync } from 'fs';

const ARGS = process.argv.slice(2);

const depStr = ARGS.length
	? ARGS.map(parseDepStr).join('\n')
	: parseDepStr('./package.json');

const rows = depStr.replace(/:/g, ';').replace(/,/g, '\n');

copy(rows);
console.log(chalk.blue(`\n${rows}\n`));
console.log('it\'s already copied to clipboard');

function parseDepStr(path: string): string {
	const dirtyList = readFileSync(path, 'utf-8')
		.replace(/(\n|\s|")/g, '')
		.match(/dependencies:{[a-z0-9:^.@\/\-,]*}/gi);

	if (dirtyList) {
		return dirtyList.map((dirtyDepStr) => dirtyDepStr.slice(14, -1)).join(',');
	}
	else {
		console.warn(chalk.yellow(`Dependencies fields not found in ${path}`));
		return '';
	}
}
