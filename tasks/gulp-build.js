const gulp = require('gulp');
const shell = require('gulp-shell');

const NAME = 'build';
exports.name = NAME;
exports.func = gulp.task(NAME, () => {
    return gulp
        .src('*.js', { read: false })
        .pipe(shell('tsc'))
})