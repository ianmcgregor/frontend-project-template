const args = require('yargs').argv;
const isProduction = args.prod || args.min; // eg: gulp --prod or gulp --min

module.exports = isProduction;
