const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
spawn('npm run build', { shell: true });

function copyFile(file, directory) {
    // get the ext
    const fileName = path.basename(file);
    const source = fs.createReadStream(file);
    // normalize directory with ext
    const dest = fs.createWriteStream(path.resolve(directory, fileName));
    console.log('directory, fileName', directory, fileName, 'path.resolve(directory, fileName)', path.resolve(directory, fileName))
    source.pipe(dest);
    source.on('end', function () { console.log('Succesfully copied'); });
    source.on('error', function (err) { console.log(err); });
};

function readFileStream(file) {
    return fs.createReadStream(file);
}

function writeFileStream(file) {
    return fs.createWriteStream(file);
}

readFileStream('./src/environment/.env')
    .pipe(writeFileStream('./dist/src/environment/.env'));

// copyFile('./src/environment/.env', './dist/src/environment');
