
const gulp = require("gulp");
const gutil = require('gulp-util');
const browserify = require("browserify");
const tsify = require("tsify");
const source = require('vinyl-source-stream');
const { configuration } = require('./gulp.config');
var ts = require('gulp-typescript');

// module.exports = () => gulp.task('compile-ts', () => {
//     return browserify({
//         entries: [configuration.paths.src.ts],
//     })
//         .plugin(tsify)
//         .bundle()
//         .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest(configuration.paths.dist.entry));
// })

var tsProject = ts.createProject('tsconfig.json');
module.exports = () => gulp.task('compile-ts', function () {
    var tsResult = gulp.src(configuration.paths.src.ts) // or tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest(configuration.paths.dist.entry));
});