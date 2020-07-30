const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const del = require('del');
const { argv: { env: envArgument } } = require('yargs');

const pwd = process.cwd();
const DIST = path.join(pwd, 'dist');
del.sync(DIST);
child_process.spawnSync('tsc', { shell: true });
fs.mkdirSync(path.join(DIST, 'environment'), { recursive: true });
const ENV = `environment/.env`;
const ENV_SRC = path.join(pwd, 'src', `${ENV}.${envArgument}`);
const ENV_DIST = path.join(DIST, `${ENV}`);
fs.copyFileSync(ENV_SRC, ENV_DIST);
