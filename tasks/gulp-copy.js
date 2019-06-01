const { argv } = require('yargs');
const { env } = argv;
const gulp = require('gulp');
const path = require('path');
const pwd = process.cwd();
exports.name = 'copy';
exports.func = gulp.task(exports.name, () => {
    return gulp.src(path.join(pwd, `src/environment/.env.${env}`))
        .pipe(gulp.dest(path.join(pwd, './dist/environment')));
});
