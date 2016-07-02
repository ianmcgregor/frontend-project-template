const gulp = require('gulp');
const gulpwatch = require('gulp-watch');
const debug = require('gulp-debug');
const template = require('gulp-template');
const logError = require('./helpers/logError');

const paths = require('../package.json').paths.html;

const templateData = {
    data: require('../package.json')
};

function render() {
    return gulp.src(paths.entry)
        .pipe(template(templateData)
        .on('error', function(err) {
            logError(err);
        }))
        .pipe(debug({title: 'html'}))
        .pipe(gulp.dest(paths.dest));
}

function watch() {
    gulpwatch(paths.entry, render);
}

module.exports = {
    render: render,
    watch: watch
};
