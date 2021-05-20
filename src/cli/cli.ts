#!/usr/bin/env node

import program from 'commander';
import { BuildCommand } from './build_command';
import { ServeCommand } from './serve_commands';




program
    .addCommand(new BuildCommand())
    .addCommand(new ServeCommand())
    .parse(process.argv)


