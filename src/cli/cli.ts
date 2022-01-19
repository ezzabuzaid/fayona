#!/usr/bin/env node

import { program } from 'commander';
import { BuildCommand } from './BuildCommand';
import { ServeCommand } from './ServeCommands';


program
    .configureOutput({
        writeOut: (str: string) => process.stdout.write(`[OUT] ${str}`),
        writeErr: (str: string) => process.stdout.write(`[ERR] ${str}`),
        outputError: (str: string, write: (val: string) => void) => write(`\x1b[31m${str}\x1b[0m`)
    })
    .addCommand(new BuildCommand())
    .addCommand(new ServeCommand())
    .parse(process.argv)


