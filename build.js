const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const pwd = process.cwd();
const del = require('del');
const { argv } = require('yargs');
const { env } = argv;
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

// TODO setup delete folder functions
// make sure that all of them pass in pipeline
const DIST = path.join(pwd, 'dist');
const ENV = 'environment/.env';
const ENV_DIST = path.join(DIST, ENV);
const ENV_SRC = path.join(pwd, 'src', `${ENV}.${env}`);
del.sync(DIST);
child_process.spawnSync('tsc', { shell: true });
fs.copyFileSync(ENV_SRC, ENV_DIST);
