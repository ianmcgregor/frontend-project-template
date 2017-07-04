// npm i -D async chalk glob mkdirp sharp snake-case yargs

const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const sharp = require('sharp');
const snakeCase = require('snake-case');

const argv = require('yargs')
    .array('s')
    .array('sizes')
    .array('t')
    .array('types')
    .argv;

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const sizes = (argv.s || argv.sizes) || [];// e.g. [1536, 1280, 1024, 768, 640];
const types = (argv.t || argv.types) || ['jpg', 'webp'];
const quality = argv.q || argv.quality || 80;
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/img-convert.js <path|glob> -o <path>');
}

const out = path.resolve(process.cwd(), output);
const source = getSource(input, '/**/*.{png,jpg}');

function logInfo(src, dest, info, size) {
    log(0, src, '>', dest, sizeInfo(size, info.size));
    return info;
}

function convert({src, w, dest, size}) {
    const buffer = sharp(src, {
        quality: Number(quality)
    });

    if (w) {
        buffer.resize(Number(w));
    }

    return buffer
        .toFile(dest)
        .then(info => logInfo(src, dest, info, size));
}

function getFormats(src, size) {
    return types.map(type => {
        const name = removeExt(src);
        const dest = `${out}/${name}.${type}`;
        return {
            src,
            dest,
            size
        };
    });
}

function getBase(src) {
    if (flatten) {
        return path.basename(src);
    }
    const index = source.indexOf('*');
    const start = source.slice(0, index);
    if (index > 0 && src.indexOf(start) === 0) {
        return src.slice(start.length);
    }
    return src;
}

function getSizes(src, size) {
    return sizes.reduce((arr, w) => {
        return arr.concat(types.map(type => {
            const base = getBase(src);
            const name = changeCase ? toCase(base) : base;
            const dest = `${out}/${removeExt(name)}_${w}.${type}`;

            return {
                src,
                dest,
                size,
                w
            };
        }));
    }, []);
}

function getFileList(src) {
    const size = fs.statSync(src).size;
    return sizes.length ? getSizes(src, size) : getFormats(src, size);
}

glob(source, (err, paths) => {
    if (err) {
        console.error(err);
        return;
    }

    const files = paths
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));

    const images = files.reduce((arr, name) => arr.concat(getFileList(name)), []);

    makeDirs(images.map(i => i.dest), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        Promise.all(images.map(image => convert(image)))
            .then(info => log(0, 'Converted', info.length, 'images'))
            .catch(error => {
                throw error;
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

function removeExt(src) {
    return src.slice(0, 0 - path.extname(src).length);
}

function toCase(src) {
    const name = path.basename(src);
    const directory = path.dirname(src);
    const ext = path.extname(src);
    return `${directory}/${snakeCase(removeExt(name))}${ext}`;
}

function toKb(bytes) {
    return `${Math.round(bytes / 1024)}kb`;
}

function sizeInfo(oldSize, newSize) {
    return `(${toKb(oldSize)} > ${toKb(newSize)})`;
}
