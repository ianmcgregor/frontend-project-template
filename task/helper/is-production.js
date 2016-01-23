const args = require('yargs').argv;
const isProduction = args.min; // eg: gulp --min

module.exports = isProduction;
