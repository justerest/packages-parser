import chalk from 'chalk';
import { readFile, writeFileSync } from 'fs';
import fetch from 'node-fetch';

interface IDependencies {
	[name: string]: string;
}

interface IPkgJson {
	[key: string]: any;
	dependencies?: IDependencies;
	devDependencies?: IDependencies;
}

(async function main() {
	const args = getUnique(process.argv.slice(2));

	const currentDeps = await parsePkgJson('./dist/package.json');
	const parsedDeps: IDependencies[] = await Promise.all(args.map(parsePkgJson));
	const list: IDependencies = Object.assign({}, currentDeps, ...parsedDeps);

	const parsedDepsSize = parsedDeps
		.reduce((size, deps) => getSize(deps) + size, 0);

	writeFileSync('./dist/package.json', toPkgJson(list));
	console.log(chalk.greenBright(
		`Parsed: ${parsedDepsSize};\n` +
		`New: ${getSize(list) - getSize(currentDeps)};\n` +
		`Total: ${getSize(list)};`,
	));
})();

function getUnique(array: any[]) {
	return Array.from(new Set(array));
}

async function parsePkgJson(path: string) {
	try {
		const text = path.match(/^http/i)
			? await fetchPkgJson(path)
			: await readFileAsync(path);

		return parseDeps(text);
	}
	catch (e) {
		console.warn(chalk.yellow((path + ': ' + e.message + '\n')));
		return {};
	}
}

/** Get package.json from GitHub project */
async function fetchPkgJson(path: string) {
	const link = path.replace('github', 'raw.githubusercontent') + '/master/package.json';
	try {
		const response = await fetch(link);
		return response.text();
	}
	catch (e) {
		throw new Error('Error in request. ' + e.message);
	}
}

async function readFileAsync(path: string) {
	return new Promise<string>((resolve, reject) => {
		readFile(path, (e, data) => {
			if (e) {
				reject(new Error('Error in file reading. ' + e.message));
			}
			else resolve(data.toString('utf-8'));
		});
	});
}

function parseDeps(text: string) {
	try {
		const { dependencies, devDependencies }: IPkgJson = JSON.parse(text);
		if (dependencies || devDependencies) {
			return Object.assign({}, dependencies, devDependencies);
		}
		else throw new Error('Dependencies fields not found.');
	}
	catch (e) {
		throw new Error('Error in package.json format. ' + e.message);
	}
}

function getSize(obj: {}) {
	return Object.keys(obj).length;
}

function toPkgJson(dependencies: IDependencies) {
	const sortedList = Object.keys(dependencies)
		.sort()
		.reduce((res, key) => {
			res[key] = 'latest';
			return res;
		}, {} as IDependencies);

	const result = {
		name: 'parsed-dependencies',
		dependencies: sortedList,
	};

	return JSON.stringify(result, null, 2);
}
