'use strict';

var gulp = require('gulp');

// connect
gulp.task('connect', require('./tasks/connect.js'));

// scripts
gulp.task('js', require('./tasks/scripts.js').bundle);
gulp.task('js:watch', require('./tasks/scripts.js').watch);
gulp.task('js:lint', require('./tasks/scripts.js').lint);

// styles
gulp.task('css', require('./tasks/styles.js').bundle);
gulp.task('css:watch', require('./tasks/styles.js').watch);
gulp.task('css:lint', require('./tasks/styles.js').lint);

// build
gulp.task('build', [
    'js',
    'css'
]);

// watch
gulp.task('watch', [
    'js:watch',
    'css:watch'
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
