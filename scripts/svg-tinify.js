// npm i -D async chalk glob mkdirp snake-case svgo yargs

const argv = require('yargs').argv;
const async = require('async');
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const snakeCase = require('snake-case');
const SVGO = require('svgo');

const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const flatten = argv.f || argv.flatten;
const changeCase = argv.c || argv.case;

if (!input || !output) {
    throw new Error('Missing arg(s). Usage: node scripts/svg-tinify.js <path|glob> -o <path>');
}

const svgo = new SVGO({
    plugins: [{
        removeDoctype: true
    }, {
        removeXMLProcInst: true
    }, {
        removeComments: true
    }, {
        removeMetadata: true
    }, {
        removeXMLNS: true
    }, {
        removeEditorsNSData: true
    }, {
        cleanupAttrs: true
    }, {
        minifyStyles: true
    }, {
        convertStyleToAttrs: true
    }, {
        cleanupIDs: true
    }, {
        removeRasterImages: true
    }, {
        removeUselessDefs: true
    }, {
        cleanupNumericValues: true
    }, {
        cleanupListOfValues: true
    }, {
        convertColors: true
    }, {
        removeUnknownsAndDefaults: true
    }, {
        removeNonInheritableGroupAttrs: true
    }, {
        removeUselessStrokeAndFill: true
    }, {
        cleanupEnableBackground: true
    }, {
        removeHiddenElems: true
    }, {
        removeEmptyText: true
    }, {
        convertShapeToPath: true
    }, {
        moveElemsAttrsToGroup: true
    }, {
        moveGroupAttrsToElems: true
    }, {
        collapseGroups: true
    }, {
        convertPathData: true
    }, {
        convertTransform: true
    }, {
        removeEmptyAttrs: true
    }, {
        removeEmptyContainers: true
    }, {
        mergePaths: true
    }, {
        removeUnusedNS: true
    }, {
        transformsWithOnePath: true
    }, {
        sortAttrs: true
    }, {
        removeTitle: true
    }, {
        removeDesc: true
    }, {
        removeStyleElement: true
    }, {
        removeScriptElement: true
    }, {
        removeAttrs: {
            attrs: 'class'
        }
    }]
});

const out = path.resolve(process.cwd(), output);
const source = getSource(input, '/**/*.svg');

function tinifyFile(item, callback) {
    const dest = getDest(source, out, item, flatten, changeCase);

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

glob(source, (er, paths) => {
    const files = paths
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.normalize(item));

    console.log('files', files);

    makeDirs(files.map(src => getDest(source, out, src, flatten)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, tinifyFile, () => {
            log(0, 'Tinified', files.length, 'svgs');
        });
    });
});

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
