#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const install_1 = require("./commands/install");
const [, , command] = process.argv;
switch (command) {
    case 'install':
    case undefined:
        (0, install_1.install)();
        break;
    default:
        console.error(`Unknown command: ${command}`);
        console.error('Usage: nightwire-cli install');
        process.exit(1);
}
