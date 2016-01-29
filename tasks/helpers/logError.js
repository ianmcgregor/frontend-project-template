const chalk = require('chalk');

module.exports = function logError(msg) {
    console.log(chalk.bold.red('[ERROR] ' + msg.toString()));
};
