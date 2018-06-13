import { CommandLineOptions } from 'command-line-args';

export interface IOptions extends CommandLineOptions {
  src: string[];
  outFile: string;
  latest?: boolean;
  saveOrder?: boolean;
  prod?: boolean;
  only?: 'prod' | 'dev';
}

export interface IDependencies {
  [name: string]: string;
}

export interface IFormatedDependencies {
  [name: string]: {
    version: string;
    isProd: boolean;
  };
}

export interface IPackageJson {
  [key: string]: any;
  dependencies?: IDependencies;
  devDependencies?: IDependencies;
}
