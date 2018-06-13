import { CommandLineOptions } from 'command-line-args';

export interface IOptions extends CommandLineOptions {
  src: string[];
  outFile: string;
  filter?: 'prod' | 'dev';
  latest?: boolean;
  save?: boolean;
  rewrite?: boolean;
  saveOrder?: boolean;
  cli?: boolean;
}

export interface INameVersion {
  [name: string]: string;
}

export interface IDependencies {
  [name: string]: {
    version: string;
    isProd: boolean;
  };
}

export interface IPackageJson {
  [key: string]: any;
  dependencies?: INameVersion;
  devDependencies?: INameVersion;
}
