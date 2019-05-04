const gulp = require("gulp");
const concat = require('gulp-concat');
const { configuration } = require('./gulp.config');

const NAME = 'concat-js';
exports.name = NAME;
exports.func = gulp.task('concat-js', function () {
    return gulp.src(configuration.paths.dist.js)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(configuration.paths.dist.entry));
});
