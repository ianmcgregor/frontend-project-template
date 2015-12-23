const gulp = require('gulp');

// connect
gulp.task('connect', require('./task/connect.js'));

// scripts
gulp.task('js', require('./task/scripts.js').bundle);
gulp.task('js:watch', require('./task/scripts.js').watch);
gulp.task('js:lint', require('./task/scripts.js').lint);
gulp.task('js:vendor', require('./task/scripts.js').vendor);

// styles
gulp.task('css', require('./task/styles.js').bundle);
gulp.task('css:watch', require('./task/styles.js').watch);
gulp.task('css:lint', require('./task/styles.js').lint);

// static
gulp.task('static', require('./task/static.js').copy);
gulp.task('static:watch', require('./task/static.js').watch);

// build
gulp.task('build', [
    'static',
    'css',
    'js',
    'js:vendor'
]);

// watch
gulp.task('watch', [
    'css:watch',
    'js:watch',
    'static:watch'
]);

// lint
gulp.task('lint', [
    'js:lint',
    'css:lint'
]);

// default
gulp.task('default', [
    'build',
    'connect',
    'watch'
]);
