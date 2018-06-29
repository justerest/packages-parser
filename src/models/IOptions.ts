import { CommandLineOptions } from 'command-line-args';

export interface IOptions extends CommandLineOptions {
  paths: string[];
  outFile: string;
  rewrite?: boolean;
  filter?: 'prod' | 'dev';
  latest?: boolean;
  save?: boolean;
  saveOrder?: boolean;
}
