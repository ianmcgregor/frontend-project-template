'use strict';

var browserSync = require('browser-sync').create();
var paths = require('./paths.json').connect;

module.exports = function() {
    browserSync.init({
        // middleware: [require('connect-history-api-fallback')()], // for spa routers
        // open: false, // don't open browser
        // port: '8000', // manually set port
        server: {
            baseDir: paths.dir
        },
        files: paths.files,
        reloadDebounce: 500
    });
};
