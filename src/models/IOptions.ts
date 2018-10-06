import { CommandLineOptions } from 'command-line-args';

export interface IOptions extends CommandLineOptions {
  paths: string[];
  out: string;
}
