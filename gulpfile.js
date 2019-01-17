const gulp = require('gulp');
require('./tasks/gulp-compile-ts')();
require('./tasks/gulp-clean')();
require('./tasks/gulp-minify-js')();
require('./tasks/gulp-concat-javascript')();


const TASK_LIST = ['clean', 'compile-ts'];
const sugar = (...a) => gulp.series(...a.map((i) => Array.isArray(i) ? gulp.parallel(...i) : i));

gulp.task('default', sugar(...TASK_LIST));

