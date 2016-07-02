const gulp = require('gulp');
const gulpwatch = require('gulp-watch');
const ffmpeg = require('gulp-fluent-ffmpeg');
const changed = require('gulp-changed');
const debug = require('gulp-debug');

const paths = require('../package.json').paths.audio;

// Make sure you have ffmpeg installed for audio conversion.
// I installed it using HomeBrew (http://brew.sh).
// This is the full install, probably only libvorbis is required:
// brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype
// --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis
// --with-libvpx --with-opencore-amr --with-openjpeg --with-opus
// --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools

function mp3() {
    return gulp.src(paths.entry)
        .pipe(changed(paths.dest))
        .pipe(ffmpeg('mp3', function(cmd) {
            return cmd
                .audioBitrate('128k')
                .audioChannels(2)
                .audioCodec('libmp3lame');
        }))
        .pipe(debug({title: 'audio:ogg'}))
        .pipe(gulp.dest(paths.dest));
}

function ogg() {
    return gulp.src(paths.entry)
        .pipe(changed(paths.dest))
        .pipe(ffmpeg('ogg', function(cmd) {
            return cmd
                .audioChannels(2)
                .audioCodec('libvorbis');
        }))
        .pipe(debug({title: 'audio:mp3'}))
        .pipe(gulp.dest(paths.dest));
}

function convert() {
    if (!paths) {
        return;
    }

    ogg();
    mp3();
}

function watch() {
    if (!paths) {
        return;
    }

    gulpwatch(paths.entry, convert);
}

module.exports = {
    convert: convert,
    watch: watch
};
