const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function copyFile(file, directory) {
    // get the ext
    const fileName = path.basename(file);
    const source = fs.createReadStream(file);
    // normalize directory with ext
    const dest = fs.createWriteStream(path.resolve(directory, fileName));
    source.pipe(dest);
    source.on('end', function () { console.log('Succesfully copied'); });
    source.on('error', function (err) { console.log(err); });
};

spawnSync('tsc', { shell: true });

const pwd = process.cwd();
copyFile(
    path.join(pwd, 'src/environment/.env.dev'),
    path.join(pwd, './dist/environment')
);
