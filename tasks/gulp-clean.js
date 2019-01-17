const gulp = require("gulp");
const del = require('del');
const { configuration } = require('./gulp.config');

module.exports = () => gulp.task('clean', () => del([configuration.paths.dist.entry]));