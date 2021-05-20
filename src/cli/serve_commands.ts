import path from 'path';
import { Command } from 'commander';
import { execute, tsConfig } from './cli_helpers';

export class ServeCommand extends Command {
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
