const async = require('async');
const del = require('del');
const changeCase = require('change-case');
const ffmpeg = require('gulp-fluent-ffmpeg');
const gulp = require('gulp');
const rename = require('gulp-rename');

const paths = require('../package.json').paths.audio;

function formatName() {
    return rename(function(path) {
        path.basename = changeCase.snakeCase(path.basename);
        path.dirname = path.dirname
            .split('/')
            .map(function(dir) {
                return changeCase.snakeCase(dir);
            })
            .join('/');
    });
}

function mp3() {
    return gulp.src(paths.src)
        .pipe(ffmpeg('mp3', function(cmd) {
            return cmd
                .audioBitrate('64k')
                .audioChannels(1)
                .audioCodec('libmp3lame');
        }))
        .pipe(formatName())
        .pipe(gulp.dest(paths.dest));
}

function ogg() {
    return gulp.src(paths.src)
        .pipe(ffmpeg('ogg', function(cmd) {
            return cmd
                .audioChannels(2)
                .audioCodec('libvorbis');
        }))
        .pipe(formatName())
        .pipe(gulp.dest(paths.dest));
}

const fs = require('fs');
// const path = require('path');

function ls(cb) {

    const json = {};

    function isDirectory(root) {
        return function(path) {
            return fs.lstatSync(root + path).isDirectory();
        };
    }

    fs.readdirSync(paths.dest)
        .filter(isDirectory(paths.dest))
        .forEach(function(name) {
            json[name] = {};
            fs.readdirSync(paths.dest + name)
                .filter(isDirectory(paths.dest + name + '/'))
                .forEach(function(sub) {
                    json[name][sub] = fs.readdirSync(paths.dest + name + '/' + sub)
                        .filter(function(file) {
                            return file.slice(-3) === 'ogg';
                        })
                        .map(function(file) {
                            const filename = file.slice(0, -4);
                            return {
                                id: name + '_' + sub + '_' + filename,
                                path: 'assets/audio/' + name + '/' + sub + '/' + filename
                            };
                        });
                });
        });

    fs.writeFile('src/json/audio.json', JSON.stringify(json, null, 4), function(err) {
        if (err) {
            console.error(err);
        }
        cb();
    });
}

function convert() {
    async.series([
        function(callback) {
            del([paths.dest + '*'], function(err, deleted) {
                console.log('Deleted files/folders:\n', deleted.join('\n'));
                callback(null, 'del');
            });
        },
        function(callback) {
            ogg()
                .on('end', function() {
                    callback(null, 'ogg');
                });
        },
        function(callback) {
            mp3()
                .on('end', function() {
                    callback(null, 'mp3');
                });
        },
        function(callback) {
            ls(function() {
                callback(null, 'json');
            });
        }
    ],
    function(err, results) {
        console.log('convert audio done:', results.join(' > '));
    });
}

module.exports = {
    convert: convert
};
