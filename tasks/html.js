const gulp = require('gulp');
const debug = require('gulp-debug');
const template = require('gulp-template');
const logError = require('./helpers/logError');
const isProduction = require('./helpers/is-production');

const paths = require('../package.json').paths.html;

const templateData = {
    data: require('../package.json')
};

function render() {
    templateData.min = isProduction ? '.min' : '';

    return gulp.src(paths.entry)
        .pipe(template(templateData)
        .on('error', function(err) {
            logError(err);
        }))
        .pipe(debug({title: 'html'}))
        .pipe(gulp.dest(paths.dest));
};

function watch() {
    gulp.watch(paths.entry, {
        interval: 500
    }, render);
}

module.exports = {
    render: render,
    watch: watch
};
