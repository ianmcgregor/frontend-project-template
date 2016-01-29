const browserSync = require('browser-sync').create();

const paths = require('../package.json').paths.connect;

module.exports = function() {
    browserSync.init({
        // middleware: [require('connect-history-api-fallback')()], // for spa routers
        // open: false, // don't open browser
        // port: '8000', // manually set port
        server: {
            baseDir: paths.dir
        },
        files: paths.files,
        reloadDelay: 500,
        reloadDebounce: 500
    });
};
