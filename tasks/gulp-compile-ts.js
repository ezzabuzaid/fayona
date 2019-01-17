const gulp = require("gulp");
const gutil = require('gulp-util');
const browserify = require("browserify");
const tsify = require("tsify");
const source = require('vinyl-source-stream');
const { configuration } = require('./gulp.config');
var ts = require('gulp-typescript');
const concat = require('gulp-concat');

module.exports = () => gulp.task('compile-ts', function () {
    const tsProject = ts.createProject('tsconfig.json');
    return gulp.src(configuration.paths.src.ts)
        .pipe(tsProject()).js
        // .pipe(concat('bundle.js'))
        .pipe(gulp.dest(configuration.paths.dist.entry))
});
