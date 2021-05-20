import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

export function execute(command: string) {
    return child_process.spawn(command, {
        cwd: process.cwd(),
        detached: false,
        stdio: "inherit",
        shell: true
    });
}

export function tsConfig() {
    const workspaceFolder = process.cwd();
    let tsconfigFile = 'tsconfig'; // TODO get it from launchsetting.json instead 
    if (tsconfigFile.endsWith('.json')) {
        const index = tsconfigFile.indexOf('.json');
        tsconfigFile.substring(0, index);
    }
    const tsConfigPath = path.join(workspaceFolder, tsconfigFile);
    return JSON.parse(fs.readFileSync(`${ tsConfigPath }.json`, 'utf8'));
}
