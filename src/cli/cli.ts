#!/usr/bin/env node
import child_process from 'child_process';
import program, { Command } from 'commander';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

function execute(command: string) {
    return child_process.spawn(command, {
        cwd: process.cwd(),
        detached: false,
        stdio: "inherit",
        shell: true
    });
}

function tsConfig() {
    const workspaceFolder = process.cwd();
    let tsconfigFile = 'tsconfig'; // TODO get it from launchsetting.json instead 
    if (tsconfigFile.endsWith('.json')) {
        const index = tsconfigFile.indexOf('.json');
        tsconfigFile.substring(0, index);
    }
    const tsConfigPath = path.join(workspaceFolder, tsconfigFile);
    return JSON.parse(fs.readFileSync(`${ tsConfigPath }.json`, 'utf8'));
}

class BuildCommand extends Command {
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


class ServeCommand extends Command {
    constructor() {
        super('serve');
        this
            .option('-e, --ext <argument>', 'type of project to be executed: ts, js', 'ts')
            .option('-s, --source <argument>', 'source folder to serve', tsConfig().compilerOptions.baseUrl || '')
            .option('-w, --watch <argument>', '', true)
            .action(({ ext, watch, source }) => {
                this.execCommand(ext, watch, source);
            });
    }
    execCommand(ext: string, watch: boolean, source: string) {

        if (!source) {
            throw new Error('you should specify baseUrl in tsconfig.json or pass --source with serve command');
        }

        const executeCommand = this.getExecuteCommand(source, ext);
        const watchCommand = `nodemon --ext ${ ext } --watch ${ source } --exec ${ executeCommand }`;
        const command = `clear && ${ watch ? watchCommand : executeCommand }`;
        execute(command);
    }

    private getExecuteCommand(watchDirectoy: string, ext: string) {
        let entryPointFile = `main.${ ext }`; // TODO: get it from launchsettigns.json;
        const watchEntryPoint = path.join(watchDirectoy, entryPointFile);
        return `${ ext === 'ts' ? 'ts-' : '' }node -r ./tsconfig-paths/register ${ watchEntryPoint }`;
    }
}

program
    .addCommand(new BuildCommand())
    .addCommand(new ServeCommand())
    .parse(process.argv)


