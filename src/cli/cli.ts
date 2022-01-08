#!/usr/bin/env node

import { program } from 'commander';
import { BuildCommand } from './BuildCommand';
import { ServeCommand } from './ServeCommands';


program
    .configureOutput({
        writeOut: (str) => process.stdout.write(`[OUT] ${ str }`),
        writeErr: (str) => process.stdout.write(`[ERR] ${ str }`),
        outputError: (str, write) => write(`\x1b[31m${ str }\x1b[0m`)
    })
    .addCommand(new BuildCommand())
    .addCommand(new ServeCommand())
    .parse(process.argv)


