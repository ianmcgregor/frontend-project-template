// npm i -D async chalk glob mkdirp sharp yargs

const argv = require('yargs').argv;
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const sharp = require('sharp');
const utils = require('./utils');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const sizes = toArray(argv.s || argv.sizes) || [];// || [1536, 1280, 1024, 768, 640];
const types = toArray(argv.t || argv.types) || ['jpg', 'webp'];
const quality = argv.q || argv.quality || 80;
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/img-convert.js <path|glob> -o <path>');
}

const dir = path.resolve(process.cwd(), output);
const source = utils.getSource(input, '/**/*.{png,jpg}');

function toArray(str) {
    return str && str.split(',').map(s => s.trim());
}

function logInfo(src, dest, info, size) {
    utils.log(true, src, '>', dest, utils.sizeInfo(size, info.size));
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
        const name = utils.removeExt(src);
        const dest = `${dir}/${name}.${type}`;
        return {
            src,
            dest,
            size
        };
    });
}

function getSizes(src, size) {
    return sizes.reduce((arr, w) => {
        return arr.concat(types.map(type => {
            const base = flatten ? path.basename(src) : src.split(path.sep).slice(1).join(path.sep);
            const name = changeCase ? utils.toCase(base) : base;
            const dest = `${dir}/${utils.removeExt(name)}_${w}.${type}`;

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
    const files = utils.getFiles(paths);

    const images = files.reduce((arr, name) => arr.concat(getFileList(name)), []);

    utils.makeDirs(images.map(i => i.dest), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        Promise.all(images.map(image => convert(image)))
            .then(info => utils.log(true, 'Converted', info.length, 'images'))
            .catch(error => {
                throw error;
            });
    });
});
