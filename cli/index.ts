#!/usr/bin/env node
import { install } from './commands/install';

const [, , command] = process.argv;

switch (command) {
  case 'install':
  case undefined:
    install();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Usage: nightwire-cli install');
    process.exit(1);
}
