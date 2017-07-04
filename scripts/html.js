// npm i -D async chalk glob lodash.template mkdirp yargs

const argv = require('yargs').argv;
const async = require('async');
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const template = require('lodash.template');

const cwd = process.cwd();
const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const debug = !!argv.debug || process.env.NODE_ENV === 'development';
const dataPath = argv.d || argv.data;

const out = path.resolve(cwd, output);
const source = getSource(input, '/**/*.html');

const data = require(`${cwd}/${dataPath}`);
const tmplData = Object.assign({}, argv, data, {
    data,
    debug
});

function processHTML(item, callback) {
    fs.readFile(item, 'utf8', (err, tmpl) => {
        if (err) {
            log(2, item, '>', dest);
            callback(err);
            return;
        }
        const html = template(tmpl)(tmplData);
        const dest = getDest(source, out, item);

        fs.writeFile(dest, html, 'utf8', error => {
            if (error) {
                log(2, item, '>', dest);
                callback(error);
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

    makeDirs(files.map(src => getDest(source, out, src)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, processHTML, () => {
            log(0, 'Processed', files.length, 'html files');
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

function getDest(src, dest, item) {
    let itemDest = '';
    if (src.includes('*')) {
        itemDest = item.replace(src.slice(0, src.indexOf('*')), '');
    } else {
        itemDest = path.basename(item);
    }
    return path.normalize(`${dest}/${itemDest}`);
}
