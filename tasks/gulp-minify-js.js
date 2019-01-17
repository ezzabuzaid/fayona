const gulp = require("gulp");
const minifyJS = require('gulp-minify'); // will create to file for min and unmin
const uglify = require('gulp-uglify-es').default;
const { configuration } = require('./gulp.config');

module.exports = () => gulp.task('minify-compress', () => {
    return gulp.src(configuration.paths.src.ts)
        .pipe(minifyJS())
        // .pipe(uglify())
        .pipe(gulp.dest(configuration.paths.dist.entry))
});