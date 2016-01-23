const gulp = require('gulp');
const paths = require('../package.json').paths.static;

function copyFiles(entry, dest) {
    return gulp.src(entry)
        .pipe(gulp.dest(dest));
}

function copy() {
    if (Array.isArray(paths)) {
        return paths.forEach(function(item) {
            copyFiles(item.entry, item.dest);
        });
    }
    return copyFiles(paths.entry, paths.dest);
}

function getFiles() {
    return Array.isArray(paths) ? paths.reduce(function(arr, item) {
        if (Array.isArray(item.entry)) {
            return arr.concat(item.entry);
        }
        arr.push(item.entry);
        return arr;
    }, []) : paths.entry;
}

function watch() {
    gulp.watch(getFiles(), {
        interval: 500
    }, copy);
}

module.exports = {
    copy: copy,
    watch: watch
};
