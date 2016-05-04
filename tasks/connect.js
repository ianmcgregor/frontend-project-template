const browserSync = require('browser-sync').create();

const paths = require('../package.json').paths.connect;

module.exports = function() {
    // Optional:
    // logLevel: 'debug'
    // middleware: [require('connect-history-api-fallback')()], // for spa routers
    // open: false, // don't open browser
    // port: '8000', // manually set port
    // reloadDelay: 500,
    // reloadDebounce: 500

    const config = paths.proxy ? {
        proxy: paths.proxy,
        files: paths.files
    } : {
        server: {baseDir: paths.dir},
        files: paths.files
    };
    browserSync.init(config);
};
