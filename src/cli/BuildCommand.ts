import { Command } from 'commander';
import { ensureDirSync } from 'fs-extra';
import { copyAssets, copyEnvironmentFile, execute, getBuildDirectory } from './CliHelpers';

export class BuildCommand extends Command {
    constructor() {
        super('build');

        this
            .option('-f, --files <files>', 'Comma seperated list of files to include in build operation')
            .action((cmdObj) => {
                this.build(cmdObj.files);
            })
    }


    private build(files: string) {
        ensureDirSync(getBuildDirectory());
        copyEnvironmentFile(getBuildDirectory());
        copyAssets(getBuildDirectory(), files);
        execute('tsc');
    }
}
