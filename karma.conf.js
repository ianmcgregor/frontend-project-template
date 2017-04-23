module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: true,
        singleRun: false,
        logLevel: config.LOG_DISABLE,
        captureTimeout: 60000,
        files: [
            'test/**/*.spec.js'
        ],
        exclude: [],
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        frameworks: ['browserify', 'mocha'],
        preprocessors: {
            'src/**/*.js': ['browserify'],
            'test/**/*.spec.js': ['browserify']
        },
        browsers: ['Firefox', 'Chrome'],
        reporters: ['progress'],
        browserify: {
            debug: true,
            transform: [
                ['babelify', {
                    ignore: '/node_modules/'
                }]
            ]
        },
        client: {
            mocha: {
                opts: true
            }
        }
    });
};
