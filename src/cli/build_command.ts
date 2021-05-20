import path from 'path';
import fsExtra from 'fs-extra';
import { Command } from 'commander';
import { execute, tsConfig } from './cli_helpers';
import fs from 'fs';

export class BuildCommand extends Command {
    constructor() {
        super('build');

        this
            // .option('-e, --NODE_ENV <environment>', 'Application runtime environment')
            .option('-f, --files <files>', 'Comma seperated list of files to include in build operation')
            .action((cmdObj) => {
                this.build(cmdObj.files);
            })
    }

    private build(files: string) {
        const environment = process.env.NODE_ENV;
        const config = tsConfig();

        const sourceDirectory = config.compilerOptions.baseUrl;
        if (!sourceDirectory) {
            throw new Error('baseUrl is not specified in tsconfig file');
        }


        const buildDirectory = path.join(process.cwd(), config.compilerOptions.outDir);
        if (!buildDirectory) {
            throw new Error('outDir is not specified in tsconfig file');
        }
        const environmentPath = 'environments'; // use the one from launchsettings.json

        // Delete build directory
        fsExtra.removeSync(buildDirectory);

        // Create build directory
        fsExtra.ensureDirSync(buildDirectory)
        fsExtra.ensureDirSync(path.join(buildDirectory, environmentPath));

        const ENV = `${ environmentPath }/.env`;
        const ENV_SRC = path.join(sourceDirectory, `${ ENV }${ environment ? '.' + environment : '' }`);
        const ENV_DIST = path.join(buildDirectory, `${ ENV }`);
        fs.copyFileSync(ENV_SRC, ENV_DIST);

        // Copy additional files
        if (typeof files === 'string') {
            const filesNames = files.split(',');
            filesNames.forEach((folderName) => fsExtra
                .copySync(
                    path.join(sourceDirectory, folderName),
                    path.join(buildDirectory, folderName)
                )
            );
        }

        execute('tsc');
    }
}
