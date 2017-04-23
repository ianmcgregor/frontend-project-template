// npm i -D async chalk glob mkdirp tinify svgo yargs

const argv = require('yargs').argv;
const async = require('async');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const SVGO = require('svgo');
const svgo = new SVGO();
const tinify = require('tinify');
const utils = require('./utils');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const key = argv.k || 'yZYhGbvnTXNRYOBWOf2cQfVGPJg8cSps';
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/tinify.js <path|glob> -o <path>');
}

const dir = path.resolve(process.cwd(), output);
const source = utils.getSource(input, '/**/*.{png,jpg,svg}');

tinify.key = key;

function optimizeSVG(item, dest, callback) {
    const oldSize = fs.statSync(item).size;

    fs.readFile(item, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback();
            return;
        }
        svgo.optimize(data, result => {
            fs.writeFile(dest, result.data, 'utf8', error => {
                if (error) {
                    console.error(error);
                }
                const newSize = fs.statSync(dest).size;
                utils.log(true, item, '>', dest, utils.sizeInfo(oldSize, newSize));
                callback();
            });
        });
    });
}

function tinifyFile(item, callback) {
    const base = utils.getDest(dir, item, flatten);
    const dest = changeCase ? utils.toCase(base) : base;

    if (path.extname(item) === '.svg') {
        optimizeSVG(item, dest, callback);
        return;
    }

    const oldSize = fs.statSync(item).size;

    fs.readFile(item, (error, buffer) => {
        if (error) {
            throw error;
        }
        tinify.fromBuffer(buffer).toFile(dest, (err) => {
            if (err) {
                console.error(err);
            }
            if (err instanceof tinify.AccountError) {
                console.error('Verify your API key and account limit.');
            } else if (err instanceof tinify.ClientError) {
                console.error('Check your source image and request options.');
            } else if (err instanceof tinify.ServerError) {
                console.error('Temporary issue with the Tinify API.');
            } else if (err instanceof tinify.ConnectionError) {
                console.error('A network connection error occurred.');
            } else if (err) {
                throw err;
            } else {
                const newSize = fs.statSync(dest).size;
                utils.log(true, item, '>', dest, utils.sizeInfo(oldSize, newSize));
            }
            callback(err);
        });
    });
}

glob(source, (er, paths) => {
    const files = utils.getFiles(paths);

    utils.makeDirs(files.map(src => utils.getDest(dir, src, flatten)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, tinifyFile, () => {
            utils.log(true, 'Tinified', files.length, 'images');
            if (tinify.compressionCount) {
                console.log('Account usage', tinify.compressionCount, '/ 500');
            }
        });
    });
});
