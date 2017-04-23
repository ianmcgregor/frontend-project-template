// npm i -D async chalk glob mkdirp tinify svgo yargs

const argv = require('yargs').argv;
const async = require('async');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const utils = require('./utils');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const flatten = argv.f || argv.flatten;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/copy.js <path|glob> -o <path> [-f]');
}

const dir = path.resolve(process.cwd(), output);
const source = utils.getSource(input, '/**/*');

function copy(src, dest, callback) {
    let cbCalled = false;

    const write = fs.createWriteStream(dest)
        .on('error', done)
        .on('close', done);

    fs.createReadStream(src)
        .on('error', done)
        .pipe(write);

    function done(err) {
        if (!cbCalled) {
            cbCalled = true;
            callback(err);
            return;
        }
    }
}

function copyFile(item, callback) {
    const dest = utils.getDest(dir, item, flatten);

    mkdirp(path.dirname(dest), err => {
        if (err) {
            console.error('mkdirp', err.message);
        }
        copy(item, dest, error => {
            if (error) {
                utils.log(false, item, '>', dest);
                console.error('copy error', error.message);
                callback();
                return;
            }
            utils.log(true, item, '>', dest);
            callback();
        });
    });
}

glob(source, (er, paths) => {
    const files = utils.getFiles(paths);

    async.eachSeries(files, copyFile, () => {
        utils.log(true, 'Copied', files.length, 'files');
    });
});
