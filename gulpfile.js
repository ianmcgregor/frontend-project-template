const gulp = require('gulp');

// connect
gulp.task('connect', require('./task/connect'));

// scripts
gulp.task('js', require('./task/scripts').bundle);
gulp.task('js:watch', require('./task/scripts').watch);
gulp.task('js:lint', require('./task/scripts').lint);
gulp.task('js:vendor', require('./task/scripts').vendor);

// styles
gulp.task('css', require('./task/styles').bundle);
gulp.task('css:watch', require('./task/styles').watch);
gulp.task('css:lint', require('./task/styles').lint);

// html
gulp.task('html', require('./task/html').render);
gulp.task('html:watch', require('./task/html').watch);

// static
gulp.task('static', require('./task/static').copy);
gulp.task('static:watch', require('./task/static').watch);

// build
gulp.task('build', [
    'html',
    'static',
    'css',
    'js',
    'js:vendor'
]);

// watch
gulp.task('watch', [
    'css:watch',
    'js:watch',
    'static:watch',
    'html:watch'
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
