const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const logError = require('./helpers/logError');
const debug = require('./helpers/debug');
const logs = require('./helpers/logs');
const source = require('vinyl-source-stream');
const strip = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const paths = require('../package.json').paths.scripts;
const vendors = require('../package.json').vendor;

const mainBundler = browserify({
    entries: paths.entry,
    debug: debug
});

// expose any vendor libs as external dependencies
Object.keys(vendors).forEach(function(lib) {
    mainBundler.external(vendors[lib], {
        expose: lib
    });
});

function lint() {
    return gulp.src(paths.lint)
        .pipe(eslint())
        .pipe(eslint.format());
}

function createBundle(bundler, name, dest) {
    return bundler
        .bundle()
        .on('error', logError)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(gulpif(!debug, uglify()))
        .pipe(gulpif(!debug && !logs, strip()))
        .pipe(gulp.dest(dest));
}

function bundle() {
    lint();

    return createBundle(mainBundler, 'bundle.js', paths.dest);
}

function watch() {
    const wBundler = watchify(mainBundler, watchify.args);
    wBundler.on('update', function() {
        createBundle(wBundler, 'bundle.js', paths.dest);
    })
    .on('error', logError)
    .on('log', console.log.bind(console));
}

function vendor() {
    if (!Object.keys(vendors).length) {
        return null;
    }

    const vBundler = browserify({
        debug: debug
    });

    // include vendor libs in bundle
    Object.keys(vendors).forEach(function(lib) {
        vBundler.require(vendors[lib], {
            expose: lib
        });
    });

    return createBundle(vBundler, 'vendor.js', paths.dest);
}

function modernizr() {
    return gulp.src(paths.modernizr.entry)
        .pipe(gulpif(!debug, uglify()))
        .pipe(gulp.dest(paths.modernizr.dest));
}

module.exports = {
    bundle: bundle,
    lint: lint,
    watch: watch,
    vendor: vendor,
    modernizr: modernizr
};
