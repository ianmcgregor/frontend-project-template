const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const logError = require('./helper/logError');
const isProduction = require('./helper/is-production');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const strip = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const paths = require('../package.json').paths.scripts;
const vendor = require('../package.json').vendor;

const bundler = browserify({
    entries: paths.entry,
    debug: !isProduction
});

// expose vendor libs as external dependencies
Object.keys(vendor).forEach(function(lib) {
    bundler.external(vendor[lib], {
        expose: lib
    });
});

function lint() {
    return gulp.src(paths.lint)
        .pipe(eslint())
        .pipe(eslint.format());
}

function createBundle(b, name, dest) {
    return b
        .bundle()
        .on('error', logError)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulpif(isProduction, strip()))
        .pipe(gulpif(isProduction, rename({
            suffix: '.min'
        })))
        .pipe(gulp.dest(dest));
}

function bundle() {
    lint();

    return createBundle(bundler, paths.bundle, paths.dest);
}

function watch() {
    const wBundler = watchify(bundler, watchify.args);
    wBundler.on('update', function() {
        createBundle(wBundler, paths.bundle, paths.dest);
    })
    .on('error', logError)
    .on('log', console.log.bind(console));
}

function bundleVendor() {
    if (!Object.keys(vendor).length) {
        return null;
    }

    const vBundler = browserify({
        debug: !isProduction
    });

    // include vendor libs in bundle
    Object.keys(vendor).forEach(function(lib) {
        vBundler.require(vendor[lib], {
            expose: lib
        });
    });

    return createBundle(vBundler, 'vendor.js', paths.dest);
}

module.exports = {
    bundle: bundle,
    lint: lint,
    watch: watch,
    vendor: bundleVendor
};
