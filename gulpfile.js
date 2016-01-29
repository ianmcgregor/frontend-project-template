const gulp = require('gulp');

gulp.task('connect', require('./tasks/connect'));

gulp.task('css', require('./tasks/styles').bundle);
gulp.task('css:watch', require('./tasks/styles').watch);
gulp.task('css:lint', require('./tasks/styles').lint);

gulp.task('js', require('./tasks/scripts').bundle);
gulp.task('js:watch', require('./tasks/scripts').watch);
gulp.task('js:lint', require('./tasks/scripts').lint);

gulp.task('modernizr', require('./tasks/scripts').modernizr);
gulp.task('vendor', require('./tasks/scripts').vendor);

gulp.task('html', require('./tasks/html').render);
gulp.task('html:watch', require('./tasks/html').watch);

gulp.task('static', require('./tasks/static').copy);
gulp.task('static:watch', require('./tasks/static').watch);

gulp.task('images', require('./tasks/images').convert);
gulp.task('images:watch', require('./tasks/images').watch);

gulp.task('audio', require('./tasks/audio').convert);
gulp.task('audio:watch', require('./tasks/audio').watch);

gulp.task('build', [
    'html',
    'static',
    'css',
    'js',
    'modernizr',
    'vendor',
    'images',
    'audio'
]);

gulp.task('watch', [
    'css:watch',
    'js:watch',
    'static:watch',
    'html:watch',
    'images:watch',
    'audio:watch'
]);

gulp.task('lint', [
    'js:lint',
    'css:lint'
]);

gulp.task('default', [
    'connect',
    'build',
    'watch'
]);
