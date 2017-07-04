// npm i -D async chalk glob mkdirp snakeCase yargs

const argv = require('yargs').argv;
const async = require('async');
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const snakeCase = require('snake-case');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const flatten = argv.f || argv.flatten;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/copy.js <path|glob> -o <path> [-f]');
}

const out = path.resolve(process.cwd(), output);
const source = getSource(input, '/**/*');

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
    const dest = getDest(source, out, item, flatten);

    mkdirp(path.dirname(dest), err => {
        if (err) {
            console.error('mkdirp', err.message);
        }
        copy(item, dest, error => {
            if (error) {
                log(2, item, '>', dest);
                console.error('copy error', error.message);
                callback();
                return;
            }
            log(0, item, '>', dest);
            callback();
        });
    });
}

glob(source, (er, paths) => {
    const files = paths
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));

    async.eachSeries(files, copyFile, () => {
        log(0, 'Copied', files.length, 'files');
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
