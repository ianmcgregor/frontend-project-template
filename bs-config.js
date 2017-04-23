const historyApiFallback = require('connect-history-api-fallback');

module.exports = {
    server: 'dist',
    files: [
        'dist/js/*.js',
        'dist/css/*.css',
        'dist/*.html'
    ],
    ui: false,
    notify: false,
    middleware: [historyApiFallback()],
    reloadDelay: 500,
    reloadDebounce: 200
};
