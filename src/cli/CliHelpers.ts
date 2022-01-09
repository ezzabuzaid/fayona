import { spawn } from 'child_process';
import { copyFileSync, copySync, ensureDirSync, readFileSync } from 'fs-extra';
import { extname, join, normalize } from 'path';

export function execute(command: string) {
    return spawn(command, {
        cwd: process.cwd(),
        detached: false,
        stdio: "inherit",
        env: process.env,
        shell: true,
    });
}

function getTsConfigPath() {
    const workspaceFolder = process.cwd();
    let tsconfigFile = 'tsconfig'; // TODO get it from launchsetting.json instead
    return join(workspaceFolder, tsconfigFile, '.json');
}

export function tsConfig() {
    const workspaceFolder = process.cwd();
    let tsconfigFile = 'tsconfig'; // TODO get it from launchsetting.json instead
    if (tsconfigFile.endsWith('.json')) {
        const index = tsconfigFile.indexOf('.json');
        tsconfigFile.substring(0, index);
    }
    const tsConfigPath = join(workspaceFolder, tsconfigFile);
    return JSON.parse(readFileSync(`${ tsConfigPath }.json`, 'utf8'));
}

export function tryTo(fn: (...args: any[]) => any) {
    try {
        return fn();
    } catch (error) {
        return;
    }
}

export function getSourceDirectory() {
    const config = tsConfig();
    const baseDirectory = extname(__filename) === '.ts' ? config.compilerOptions.rootDir : config.compilerOptions.outDir;
    if (!baseDirectory) {
        throw new Error('rootDir or outDir is not specified in tsconfig file');
    }
    return baseDirectory;
}

export function getSeedDirectory(pathName: string) {
    return join(getSourceDirectory(), 'assets', 'seeds', pathName);
}

export function getBuildDirectory() {
    const config = tsConfig();
    const buildDirectory = join(process.cwd(), config.compilerOptions.outDir);
    if (!buildDirectory) {
        throw new Error('outDir is not specified in tsconfig file');
    }
    return buildDirectory;
}

export function copyEnvironmentFile(to: string) {
    const environment = process.env.ENV_FILE;
    const environmentPath = 'environment'; // use the one from launchsettings.json
    const sourceDirectory = getSourceDirectory();

    // Create env directory
    ensureDirSync(join(to, environmentPath));
    const ENV = `${ environmentPath }/.env`;
    const ENV_SRC = join(sourceDirectory, `${ ENV }${ environment ? '.' + environment : '' }`);
    const ENV_DIST = join(to, ENV);
    copyFileSync(ENV_SRC, ENV_DIST);
}

export function copyAssets(to: string, files: string) {
    const buildDirectory = to;

    // Copy additional files
    if (typeof files === 'string') {
        const filesNames = files.split(',');
        filesNames.forEach((name) => {
            const nameWithoutSrc = name.replace(normalize(getSourceDirectory()), '');
            if (isFile(name)) {
                copyFileSync(
                    name,
                    join(buildDirectory, nameWithoutSrc),
                );
            } else {
                copySync(
                    name,
                    join(buildDirectory, nameWithoutSrc),
                );
            }
        });
    }
}

function isFile(fileOrDirectoryPath: string) {
    return !!extname(fileOrDirectoryPath);
}

export function capitalizeFirstLetter(name: string) {
    return name.replace(/^\w/, c => c.toUpperCase());
}

export function dePascalString(value: string) {
    return value?.split(' ').map(name => name.replace(/^\w/, c => c.toUpperCase()).replace(/([A-Z][a-z])/g, ' $1')).join('').trim();
}

export function toCamelCase(str: string) {
    // Lower cases the string
    return str.toLowerCase()
        // Replaces any - or _ characters with a space
        .replace(/[-_]+/g, ' ')
        // Removes any non alphanumeric characters
        .replace(/[^\w\s]/g, '')
        // Uppercases the first character in each group immediately following a space
        // (delimited by spaces)
        .replace(/ (.)/g, function ($1) { return $1.toUpperCase(); })
        // Removes spaces
        .replace(/ /g, '');
}
