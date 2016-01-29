const gulp = require('gulp');
const changed = require('gulp-changed');
const debug = require('gulp-debug');
const imagemin = require('gulp-imagemin');
const webp = require('imagemin-webp');

const paths = require('../package.json').paths.images;

function convertWebP(quality) {
    return webp({
        quality: quality
    })();
}

function minify() {
    gulp.src(paths.entry)
        .pipe(changed(paths.dest))
        .pipe(imagemin())
        .pipe(debug({title: 'images:min'}))
        .pipe(gulp.dest(paths.dest));
}

function webpify() {
    gulp.src(paths.entry)
        .pipe(changed(paths.dest))
        .pipe(convertWebP(90))
        .pipe(debug({title: 'images:webp'}))
        .pipe(gulp.dest(paths.dest));
}

function convert() {
    minify();
    webpify();
}

function watch() {
    gulp.watch(paths.entry, {
        interval: 500
    }, convert);
}

module.exports = {
    convert: convert,
    watch: watch
};
