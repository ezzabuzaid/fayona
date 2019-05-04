const gulp = require('gulp');
// require('./tasks/gulp-compile-ts')();
// require('./tasks/gulp-minify-js')();
const clean = require('./tasks/gulp-clean');
const concat = require('./tasks/gulp-concat-javascript');

const build = { name: 'build' }
// gulp.task('build', shell.task('tsc'))

const TASK_LIST = [clean.name, build.name, concat.name];
const sugar = (...a) => gulp.series(...a.map((i) => Array.isArray(i) ? gulp.parallel(...i) : i));

gulp.task('default', sugar(...TASK_LIST));

