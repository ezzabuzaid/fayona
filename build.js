// function copyFile(file, directory) {
//     const fileName = path.basename(file);
//     const source = fs.createReadStream(file);
//     const dest = fs.createWriteStream(path.resolve(directory, fileName));
//     source.pipe(dest);
//     source.on('end', function () { console.log('Succesfully copied'); });
//     source.on('error', function (err) { console.log(err); });
// };


// const pwd = process.cwd();
// copyFile(
//     path.join(pwd, 'src/environment/.env.dev'),
//     path.join(pwd, './dist/environment')
// );

// const { Stream } = require('stream');
// const stream = new Stream();
// stream.pipe();

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

// const DATA_FOLDER_PATH = 'assets/data';
// const DATA_FOLDER_PATH_DIST = path.join(DIST, DATA_FOLDER_PATH);
// fs.mkdirSync(DATA_FOLDER_PATH_DIST);
// fs.copyFileSync(path.join(pwd, 'src/assets/data/olhc.csv'), path.join(DATA_FOLDER_PATH_DIST, 'olhc.csv'));



