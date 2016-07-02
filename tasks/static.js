const gulp = require('gulp');
const gulpwatch = require('gulp-watch');
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
    gulpwatch(paths.entry, copy);
}

module.exports = {
    copy: copy,
    watch: watch
};
