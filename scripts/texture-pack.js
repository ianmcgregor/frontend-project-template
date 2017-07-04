// npm i -D async chalk glob mkdirp snake-case yargs

const async = require('async');
const chalk = require('chalk');
const exec = require('child_process').execFile;
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const snakeCase = require('snake-case');

const argv = require('yargs')
    .array('variant')
    .array('v')
    .argv;

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const changeCase = argv.c || argv.case;
const trim = argv.t || argv.trim;
const scale = (argv.s || argv.scale) || 1;
const append = (argv.a || argv.append) || '';
const variant = (argv.v || argv.variant) || [];

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/texture-pack.js <path|glob> -o <path>');
}

const out = path.resolve(process.cwd(), output);

function texturePack(item, callback) {
    const base = getDest(input, out, item, true);
    const dest = changeCase ? toCase(base) : base;
    const name = dest.split('/').pop();
    const outputName = `${dest}{n}{v}${append}`;

    const opts = [
        item,
        '--format', 'pixijs',
        '--data', `${outputName}.json`,
        '--sheet', `${outputName}.png`,
        '--multipack',
        '--shape-padding', 2,
        '--border-padding', 2,
        '--scale', scale,
        '--replace', '$=' + append
    ];

    // --variant <scale>:<name> <scale>:<name>
    variant.forEach(v => opts.push('--variant', v));

    if (trim) {
        opts.push('--trim-sprite-names');
    }

    exec('TexturePacker', opts, error => {
        if (error) {
            log(2, `'${name}${append}' not packed`);
            return callback();
        }
        log(0, `'${name}${append}' packed`);
        return callback();
    });
}

glob(input, (err, paths) => {
    const dirs = paths
        .filter(item => fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));

    makeDirs([output], dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(dirs, texturePack, () => {
            log(0, 'Packed', dirs.length, 'folders');
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

function getDest(src, dest, item, flat, cased) {
    let destPath = '';
    if (!flat && src.includes('*')) {
        const base = src.slice(0, src.indexOf('*'));
        destPath = path.normalize(`${dest}/${item.replace(base, '')}`);
    } else {
        destPath = path.normalize(`${dest}/${path.basename(item)}`);
    }
    return cased ? toCase(destPath) : destPath;
}

function toCase(src) {
    const name = path.basename(src);
    const directory = path.dirname(src);
    const ext = path.extname(src);
    return `${directory}/${snakeCase(name.slice(0, 0 - ext.length))}${ext}`;
}
