import { Command } from 'commander';
import path from 'path';
import { execute, getSourceDirectory, tryTo } from './CliHelpers';
const packageJson = require('../../package.json');

export class ServeCommand extends Command {
    constructor() {
        super('serve');
        this
            .option('-e, --ext <argument>', 'type of project to be executed: ts, js', 'ts')
            .option('-s, --source <argument>', 'source folder to serve', tryTo(getSourceDirectory) ?? '')
            .option('-w, --watch <argument>', '', true)
            .action(({ ext, watch, source }) => {
                this.execCommand(ext, watch, source);
            })
    }

    private execCommand(ext: string, watch: boolean, source: string) {
        if (!source) {
            throw new Error('you should specify baseUrl in tsconfig.json or pass --source with serve command');
        }
        const executeCommand = this.getExecuteCommand(source, ext);
        const watchCommand = `nodemon --legacy-watch --ext ${ext} --watch ${source} --exec ${executeCommand}`;
        const command = `${watch ? watchCommand : executeCommand}`;
        execute(command);
    }

    private getExecuteCommand(watchDirectoy: string, ext: string) {
        const watchEntryPoint = path.join(watchDirectoy, this.getEntryPointFile());
        if (ext === 'ts') {
            return `ts-node ${watchEntryPoint}`;
        }
        return `node ${watchEntryPoint}`;
        // return `node -r ts-node/register ${ watchEntryPoint }`;
    }

    private getEntryPointFile() {
        return `${packageJson.main}`;
    }
}
