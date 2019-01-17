var gulp = require('gulp'),
    swaggerGenerator = require('gulp-apidoc-swagger');

require('./tasks/gulp-compile-ts')();

gulp.task('swaggerGenerator', function () {
    swaggerGenerator.exec({
        src: "src/",
        dest: "doc/"
    });
});

gulp.task('default', gulp.series('compile-ts'));