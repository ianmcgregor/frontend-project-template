// npm i -D async chalk crypto glob mkdirp snake-case svgo tinify yargs

const argv = require('yargs').argv;
const async = require('async');
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const snakeCase = require('snake-case');
const SVGO = require('svgo');
const tinify = require('tinify');

tinify.key = argv.k || argv.key || 'yZYhGbvnTXNRYOBWOf2cQfVGPJg8cSps';
const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;
const svgo = new SVGO();

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/img-tinify.js <path|glob> -o <path>');
}

const out = path.resolve(process.cwd(), output);
const source = getSource(input, '/**/*.{png,jpg,svg}');
let cache = {};

function optimizeSVG(item, dest, callback) {
    fs.readFile(item, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback(err);
            return;
        }
        svgo.optimize(data, result => {
            fs.writeFile(dest, result.data, 'utf8', error => {
                if (error) {
                    console.error(error);
                }
                const oldSize = fs.statSync(item).size;
                const newSize = fs.statSync(dest).size;
                log(0, item, '>', dest, sizeInfo(oldSize, newSize));
                callback();
            });
        });
    });
}

function tinifyFile(item, callback) {
    const dest = getDest(source, out, item, flatten, changeCase);

    if (path.extname(item) === '.svg') {
        optimizeSVG(item, dest, callback);
        return;
    }

    fs.readFile(item, (error, buffer) => {
        if (error) {
            throw error;
        }

        const itemHash = crypto.createHash('md5').update(buffer).digest('hex');
        const skip = cache[item] && cache[item] === itemHash;
        cache[item] = itemHash;

        if (skip) {
            log(1, 'Skipped', item, '>', dest);
            callback();
            return;
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
                const oldSize = fs.statSync(item).size;
                const newSize = fs.statSync(dest).size;
                log(0, item, '>', dest, sizeInfo(oldSize, newSize));
            }
            callback(err);
        });
    });
}

glob(source, (er, paths) => {
    const files = paths
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));

    try {
        cache = JSON.parse(fs.readFileSync('.tinifycache'));
    } catch (e) {}

    makeDirs(files.map(src => getDest(source, out, src, flatten)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, tinifyFile, () => {
            fs.writeFile('.tinifycache', JSON.stringify(cache), 'utf8');
            log(0, 'Tinified', files.length, 'images');
            if (tinify.compressionCount) {
                console.log('Account usage', tinify.compressionCount, '/ 500');
            }
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

function toCase(src) {
    const name = path.basename(src);
    const directory = path.dirname(src);
    const ext = path.extname(src);
    return `${directory}/${snakeCase(name.slice(0, 0 - ext.length))}${ext}`;
}

function toKb(bytes) {
    return `${Math.round(bytes / 1024)}kb`;
}

function sizeInfo(oldSize, newSize) {
    return `(${toKb(oldSize)} > ${toKb(newSize)})`;
}
