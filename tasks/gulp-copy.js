const { argv } = require('yargs');
const { env } = argv;
const gulp = require('gulp');
const path = require('path');
const pwd = process.cwd();
const NAME = 'copy';
exports.name = NAME;
exports.func = gulp.task(NAME, () => {
    gulp.src(path.join(pwd, `src/environment/.env.${env}`))
        .pipe(gulp.dest(path.join(pwd, './dist/environment')));
});