const gulp = require('gulp');
const logError = require('./helper/logError');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const paths = require('../package.json').paths.styles;

const processors = [
    require('postcss-import')(),
    require('postcss-nested')(),
    require('postcss-custom-media')(),
    require('postcss-custom-properties')(),
    require('postcss-calc')(),
    require('postcss-easings')(),
    require('postcss-url')({
        url: 'inline',
        maxSize: 4096
    }),
    require('autoprefixer')({
        browsers: ['last 2 version'],
        cascade: false
    }),
    require('cssnano')()
];

function bundle() {
    return gulp.src(paths.entry)
        .pipe(plumber({errorHandler: logError}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename(paths.bundle))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dest));
}

function lint() {
    return gulp.src(paths.lint)
        .pipe(plumber({
            errorHandler: logError
        }))
        .pipe(postcss([
            require('stylelint')(),
            require('postcss-reporter')({
                clearMessages: true
            })
        ]));
}

function watch() {
    gulp.watch(paths.watch, {
        interval: 500
    }, bundle);
}

module.exports = {
    bundle: bundle,
    lint: lint,
    watch: watch
};
