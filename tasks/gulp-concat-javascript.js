const gulp = require("gulp");
const concat = require('gulp-concat');
const { configuration } = require('./gulp.config');

module.exports = () => gulp.task('concat-js', function () {
    return gulp.src(configuration.paths.dist.js)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(configuration.paths.dist.entry));
});
