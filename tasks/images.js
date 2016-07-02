const gulp = require('gulp');
const gulpwatch = require('gulp-watch');
const changed = require('gulp-changed');
const debug = require('gulp-debug');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const paths = require('../package.json').paths.images;

function minify() {
    gulp.src(paths.entry)
        .pipe(changed(paths.dest))
        .pipe(imagemin())
        .pipe(debug({title: 'images:min in'}))
        .pipe(gulp.dest(paths.dest))
        .pipe(debug({title: 'images:min out'}));
}

function webpify() {
    gulp.src(paths.entryWebp)
        .pipe(changed(paths.dest))
        .pipe(webp({quality: 90}))
        .pipe(debug({title: 'images:webp in'}))
        .pipe(gulp.dest(paths.dest))
        .pipe(debug({title: 'images:webp out'}));
}

function convert() {
    minify();
    webpify();
}

function watch() {
    gulpwatch(paths.entry, convert);
}

module.exports = {
    convert: convert,
    watch: watch
};
