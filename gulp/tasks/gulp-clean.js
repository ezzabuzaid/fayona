const gulp = require("gulp");
const del = require('del');
const { configuration } = require('./gulp.config');

const NAME = 'clean';
exports.name = NAME;
exports.func = gulp.task(NAME, () => del([configuration.paths.dist.entry]));