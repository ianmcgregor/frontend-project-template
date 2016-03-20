const notify = require('gulp-notify');

module.exports = function logError() {
    notify.onError({
        title: 'Error',
        message: '<%= error.message %>'
    })
    .apply(this, [].slice.call(arguments));

    this.emit('end');
};
