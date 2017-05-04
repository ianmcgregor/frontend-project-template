const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const snakeCase = require('snake-case');

function getDest(dir, src, flatten) {
    const dest = flatten ? path.basename(src) : src.split(path.sep).slice(1).join(path.sep);
    return `${dir}/${dest}`;
}

function getDirs(paths) {
    return paths
    .filter(item => fs.statSync(item).isDirectory())
    .map(item => path.normalize(item));
}

function getFiles(paths) {
    return paths
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));
}

function getSource(input, glob) {
    const exists = fs.existsSync(input);
    const isDirectory = exists && fs.statSync(input).isDirectory();
    return exists && isDirectory ? `${input}/${glob}` : input;
}

function log(success, ...args) {
    if (success) {
        return console.log(chalk.green('✓', replCwd(args.join(' '))));
    }
    return console.log(chalk.red('✗', replCwd(args.join(' '))));
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

function removeExt(src) {
    return src.slice(0, 0 - path.extname(src).length);
}

function replCwd(item) {
    return item.replace(`${process.cwd()}/`, '');
}

function sizeInfo(oldSize, newSize) {
    return `(${toKb(oldSize)} > ${toKb(newSize)})`;
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

module.exports = {
    getDest,
    getDirs,
    getFiles,
    getSource,
    log,
    makeDirs,
    removeExt,
    replCwd,
    sizeInfo,
    toCase,
    toKb
};
