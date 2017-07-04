// npm i -D async chalk fluent-ffmpeg glob mkdirp snake-case yargs

const argv = require('yargs').argv;
const async = require('async');
const chalk = require('chalk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const snakeCase = require('snake-case');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/audio.js <path|glob> -o <path>');
}

const out = path.resolve(process.cwd(), output);
const source = getSource(input, '/**/*.{wav,aiff,aif}');

function convert(type) {
    const codec = type === 'mp3' ? 'libmp3lame' : 'libvorbis';
    return function(item, callback) {
        const destPath = getDest(source, out, item, flatten, changeCase);
        const dest = `${removeExt(destPath)}.${type}`;

        ffmpeg(item)
            .audioBitrate('128k')
            .audioChannels(2)
            .audioCodec(codec)
            .format(type)
            .on('end', () => {
                log(0, item, '>', dest);
                callback();
            })
            .on('error', (err) => {
                log(2, item, '>', dest);
                console.error(err.message);
                callback(err);
            })
            .save(dest);
    };
}

glob(source, (er, paths) => {
    const files = paths
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));

    makeDirs(files.map(src => getDest(source, out, src, flatten)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, convert('mp3'), () => {
            log(0, 'Converted', files.length, 'audio files to mp3');

            async.eachSeries(files, convert('ogg'), () => {
                log(0, 'Converted', files.length, 'audio files to ogg');
            });
        });
    });
});

// helpers

function log(level, ...args) {
    const msg = args.join(' ').replace(`${process.cwd()}/`, '');
    if (level === 0) {
        return console.log(chalk.green('✓', msg));
    }
    if (level === 1) {
        return console.log(chalk.yellow('>', msg));
    }
    return console.log(chalk.red('✗', msg));
}

function makeDirs(paths, callback) {
    let error = null;

    paths
        .map(p => path.dirname(p))
        .filter((v, i, a) => a.indexOf(v) === i)
        .forEach(dirpath => mkdirp(dirpath, err => {
            if (err) {
                error = err;
            }
        }));

    callback(error);
}

function getSource(inPath, globPattern) {
    if (fs.existsSync(inPath) && fs.statSync(inPath).isDirectory()) {
        return path.normalize(`${inPath}/${globPattern}`);
    }
    return inPath;
}

function getDest(src, dest, item, flat, cased) {
    let itemDest = '';
    if (!flat && src.includes('*')) {
        itemDest = item.replace(src.slice(0, src.indexOf('*')), '');
    } else {
        itemDest = path.basename(item);
    }
    return path.normalize(`${dest}/${cased ? toCase(itemDest) : itemDest}`);
}

function removeExt(src) {
    return src.slice(0, 0 - path.extname(src).length);
}

function toCase(src) {
    const name = path.basename(src);
    const directory = path.dirname(src);
    const ext = path.extname(src);
    return `${directory}/${snakeCase(removeExt(name))}${ext}`;
}
