import { exec, execSync } from 'child_process';
import git from 'simple-git/promise';
import fs from 'fs';
import del from 'del';
import path from 'path';

const git_clone = path.join(process.cwd(), 'git_clone');
const clone = git(createDir(git_clone));
deploy(null, null);

function createDir(_path) {
    del.sync(_path, { force: true });
    fs.mkdirSync(_path);
    console.log(git_clone, ' => Deleted');
    return _path;
}

export function deploy(req, res) {
    createDir(git_clone);
    // const sender = req.body.sender;
    // const branch = req.body.ref;
    const REPO = 'https://github.com/ezzabuzaid/angular-buildozer.git';
    clone.silent(true)
        .clone(REPO)
        .then(() => {
            execSync('cd ' + git_clone + '/angular-buildozer' + ' && chmod +x ./deploy.sh');
            console.log('Finished => ', 'cd ' + git_clone + '/angular-buildozer' + ' && chmod +x ./deploy.sh');
        })
        .catch((err) => console.error('failed: ', err));
    // res.send({ success: true });
}
