const async = require('async');
const exec = require('child_process').execFile;
const glob = require('glob');
const path = require('path');
const utils = require('./utils');

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

const dir = path.resolve(process.cwd(), output);

function texturePack(item, callback) {
    const base = utils.getDest(dir, item, true);
    const dest = changeCase ? utils.toCase(base) : base;
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
            utils.log(false, `'${name}${append}' not packed`);
            return callback();
        }
        utils.log(true, `'${name}${append}' packed`);
        return callback();
    });
}

glob(input, (err, paths) => {
    const dirs = utils.getDirs(paths);

    utils.makeDirs([output], dirErr => {
        if (dirErr) {
            throw dirErr;
        }
        async.eachSeries(dirs, texturePack, () => {
            utils.log(true, 'Packed', dirs.length, 'folders');
        });
    });
});
