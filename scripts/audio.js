// npm i -D async chalk fluent-ffmpeg glob mkdirp yargs

const argv = require('yargs').argv;
const async = require('async');
const ffmpeg = require('fluent-ffmpeg');
const glob = require('glob');
const path = require('path');
const utils = require('./utils');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/audio.js <path|glob> -o <path>');
}

const dir = path.resolve(process.cwd(), output);
const source = utils.getSource(input, '/**/*.{wav,aiff,aif}');

function convert(type) {
    const codec = type === 'mp3' ? 'libmp3lame' : 'libvorbis';
    return function(item, callback) {
        const base = utils.getDest(dir, item, flatten);
        const cased = changeCase ? utils.toCase(base) : base;
        const dest = `${utils.removeExt(cased)}.${type}`;
        ffmpeg(item)
            .audioBitrate('128k')
            .audioChannels(2)
            .audioCodec(codec)
            .format(type)
            .on('end', () => {
                utils.log(true, item, '>', dest);
                callback();
            })
            .on('error', (err) => {
                utils.log(true, item, '>', dest);
                console.error(err.message);
                callback(err);
            })
            .save(dest);
    };
}

glob(source, (er, paths) => {
    const files = utils.getFiles(paths);

    utils.makeDirs(files.map(src => utils.getDest(dir, src, flatten)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, convert('mp3'), () => {
            utils.log(true, 'Converted', files.length, 'audio files to mp3');

            async.eachSeries(files, convert('ogg'), () => {
                utils.log(true, 'Converted', files.length, 'audio files to ogg');
            });
        });
    });
});
