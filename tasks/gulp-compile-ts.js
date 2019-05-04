const gulp = require("gulp");
var ts = require('gulp-typescript');
const { configuration } = require('./gulp.config');

module.exports = () => gulp.task('compile-ts', function () {
    const tsProject = ts.createProject('tsconfig.json');
    return gulp.src(configuration.paths.src.ts)
        .pipe(tsProject()).js
        .pipe(gulp.dest(configuration.paths.dist.entry))
});
