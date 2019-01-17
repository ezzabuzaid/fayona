const nodemon = require('gulp-nodemon');
gulp.task('nodemon', function () {
    nodemon({
        script: 'server.js',
        ext: 'ts',
        ignore: ['dist']
    })
        .on('restart', function () {
            console.log('>> node restart');
        })
});