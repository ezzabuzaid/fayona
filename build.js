const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const del = require('del');
const { argv: { env: envArgument, files } } = require('yargs');

const pwd = process.cwd();
const DIST = path.join(pwd, 'dist');
const SRC = path.join(pwd, 'src');
del.sync(DIST);
child_process.spawnSync('tsc', { shell: true });
fs.mkdirSync(path.join(DIST, 'environment'), { recursive: true });
const ENV = `environment/.env`;
const ENV_SRC = path.join(SRC, `${ENV}${envArgument ? '.' + envArgument : ''}`);
const ENV_DIST = path.join(DIST, `${ENV}`);
fs.copyFileSync(ENV_SRC, ENV_DIST);


if (typeof files === 'string') {
    const filesNames = files.split(',');
    filesNames.forEach((folderName) => fsExtra.copySync(path.join(SRC, folderName), path.join(DIST, folderName)));
}
