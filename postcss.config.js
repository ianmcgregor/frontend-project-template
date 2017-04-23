module.exports = {
    plugins: [
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-custom-media')(),
        require('postcss-custom-properties')(),
        require('postcss-calc')(),
        require('postcss-easings')(),
        require('postcss-url')({
            url: 'inline',
            maxSize: 4096
        }),
        require('autoprefixer')({
            browsers: ['last 2 version'],
            cascade: false
        }),
        require('cssnano')()
    ]
};
