const gulp = require('gulp');
const logError = require('./helper/logError');
const paths = require('../package.json').paths.html;
const template = require('gulp-template');

const templateData = {
    data: require('../package.json')
};

function render() {
    return gulp.src(paths.entry)
        .pipe(template(templateData).on('error', function(err) {
            logError(err);
        }))
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
