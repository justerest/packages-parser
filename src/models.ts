import { CommandLineOptions } from 'command-line-args';

export interface IOptions extends CommandLineOptions {
  src: string[];
  outFile: string;
  last?: boolean;
}

export interface IDependencies {
  [name: string]: string;
}

export interface IPackageJson {
  [key: string]: any;
  dependencies?: IDependencies;
  devDependencies?: IDependencies;
}
