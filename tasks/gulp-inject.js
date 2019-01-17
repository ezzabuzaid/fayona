const gulp = require('gulp');
const inject = require('gulp-inject');
const { configuration } = require('./gulp.config');

module.exports = () => gulp.task('inject-assets', function () {

  const target = gulp.src(configuration.paths.dist.html);

  const sources = gulp.src([`dist/**/*.css`, `./${configuration.paths.dist.js}`,], { ignorePath: '/dist/', addRootSlash: false, read: false, relative: false });

  return target.pipe(inject(sources))
    .pipe(gulp.dest(configuration.paths.dist.entry));
});