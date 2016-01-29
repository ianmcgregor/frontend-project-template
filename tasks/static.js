const gulp = require('gulp');
const changed = require('gulp-changed');
const debug = require('gulp-debug');

const paths = require('../package.json').paths.static;

function copy() {
    return gulp.src(paths.entry)
        .pipe(changed(paths.dest))
        .pipe(debug({title: 'static src:'}))
        .pipe(gulp.dest(paths.dest))
        .pipe(debug({title: 'static dest:'}));
}

function watch() {
    gulp.watch(paths.entry, {
        interval: 500
    }, copy);
}

module.exports = {
    copy: copy,
    watch: watch
};
