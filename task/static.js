const gulp = require('gulp');

const paths = require('../package.json').paths.static;

function copyFiles(entry, dest) {
    return gulp.src(entry)
        .pipe(gulp.dest(dest));
}

function copy() {
    if (Array.isArray(paths.items)) {
        return paths.items.forEach(function(item) {
            copyFiles(item.entry, item.dest);
        });
    }
    return copyFiles(paths.entry, paths.dest);
}

function watch() {
    gulp.watch(paths.watch, {
        interval: 500
    }, copy);
}

module.exports = {
    copy: copy,
    watch: watch
};
