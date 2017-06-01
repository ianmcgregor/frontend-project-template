const template = require('lodash.template');
const argv = require('yargs').argv;
const async = require('async');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const utils = require('./utils');

const cwd = process.cwd();
const input = argv.i || argv.input || argv._[0];
const output = argv.o || argv.output;
const debug = !!argv.debug || process.env.NODE_ENV === 'development';
const dataPath = argv.d || argv.data;

const dir = path.resolve(cwd, output);
const source = utils.getSource(input, '/**/*.html');

const data = require(`${cwd}/${dataPath}`);
const tmplData = Object.assign({}, argv, data, {
    data,
    debug
});

function processHTML(item, callback) {
    fs.readFile(item, 'utf8', (err, tmpl) => {
        if (err) {
            utils.log(false, item, '>', dest);
            callback(err);
            return;
        }
        const html = template(tmpl)(tmplData);
        const dest = utils.getDest(dir, item);

        fs.writeFile(dest, html, 'utf8', error => {
            if (error) {
                utils.log(false, item, '>', dest);
                callback(error);
                return;
            }
            utils.log(true, item, '>', dest);
            callback();
        });
    });
}

glob(source, (er, paths) => {
    const files = utils.getFiles(paths);

    utils.makeDirs(files.map(src => utils.getDest(dir, src)), dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(files, processHTML, () => {
            utils.log(true, 'Processed', files.length, 'html files');
        });
    });
});
