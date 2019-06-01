const { spawnSync } = require('child_process');
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
spawnSync('tsc', { shell: true })
fs.copyFileSync(path.join(pwd, `src/environment/.env.${env}`), './dist/environment/.env', (err) => {
    // TODO use pipline to move files instead of sync way
    console.log('Succesfully copied');
});