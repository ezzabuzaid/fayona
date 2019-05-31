const gulp = require('gulp');
const clean = require('./tasks/gulp-clean');
const build = require('./tasks/gulp-build');
const concat = require('./tasks/gulp-concat-javascript');
const copy = require('./tasks/gulp-copy');
const TASK_LIST = [clean.name, build.name, copy.name];
const sugar = (...a) => gulp.series(...a.map((i) => Array.isArray(i) ? gulp.parallel(...i) : i));
gulp.task('default', sugar(...TASK_LIST));
