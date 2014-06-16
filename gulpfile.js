/* jshint strict: false */
var gulp = require('gulp'),
    browserify = require('browserify'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    strip = require('gulp-strip-debug'),
    streamify = require('gulp-streamify'),
    source = require('vinyl-source-stream'),
    jshint = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    minifyCSS = require('gulp-minify-css'),
    rework = require('gulp-rework'),
    autoprefix = require('gulp-autoprefixer'),
    chalk = require('chalk');

// paths and file names
var src = './src',
    dist = './dist',
    jsSrc = src+'/js/',
    jsIndex = 'main.js',
    jsDist = dist+'/js/',
    jsBundle = 'bundle.js',
    cssSrc = src+'/css/',
    cssIndex = 'main.css',
    cssDist = dist+'/css/',
    cssBundle = 'styles.css',
    vendors = src+'/vendor/';

// alias libs to short names
var alias = {
  lodash: vendors+'lodash/dist/lodash.js'
};

//log
function logError(msg) {
  console.log(chalk.bold.red('[ERROR]'), msg);
}

// build bundled js using browserify
function buildJS(debug) {
  var bundler = browserify(jsSrc+jsIndex);
  // alias libs to short names
  for(var key in alias) {
    bundler.require(alias[key], { expose: key });
  }
  var bundleStream = bundler.bundle({ debug: debug });
  bundleStream
    .on('error', function(err){
      logError(err);
    })
    .pipe(source(jsSrc+jsIndex))
    .pipe(gulpIf(!debug, streamify(strip())))
    .pipe(gulpIf(!debug, streamify(uglify())))
    //.pipe(rename({suffix: '.min'}))
    .pipe(rename(jsBundle))
    .pipe(gulp.dest(jsDist))
    .pipe(connect.reload());
}
gulp.task('js', function() {
  buildJS(true);
});
gulp.task('js-release', function() {
  buildJS(false);
});

// build css using minify and autoprefixer
gulp.task('css', function() {
  gulp.src(cssSrc+cssIndex)
    .on('error', function(err){
      logError(err);
    })
    .pipe(minifyCSS({ keepBreaks: true }))
    .pipe(rework(
      require('rework-suit')
    ))
    .pipe(autoprefix('last 2 version', '> 1%'))
    .on('error', function(err){
      logError(err);
    })
    //.pipe(rename({suffix: '.min'}))
    .pipe(rename(cssBundle))
    .pipe(gulp.dest(cssDist))
    .pipe(connect.reload());
});

// js hint - ignore libraries and bundled
gulp.task('jshint', function() {
  return gulp.src([
      './gulpfile.js',
      jsSrc+'/**/*.js',
      '!'+vendors+'**/*.js',
      '!'+jsSrc+'/lib/**/*.js',
      '!'+jsDist+jsBundle
    ])
    .pipe(jshint({
      'node': true,
      'browser': true,
      'es5': false,
      'esnext': true,
      'bitwise': false,
      'camelcase': false,
      'curly': true,
      'eqeqeq': true,
      'immed': true,
      'latedef': true,
      'newcap': true,
      'noarg': true,
      'quotmark': 'single',
      'regexp': true,
      'undef': true,
      'unused': true,
      'strict': true,
      'trailing': true,

      'predef': [
          'Modernizr',
          'ga'
      ]
  }))
  .pipe(jshint.reporter('jshint-stylish'));
});

// csslint - ignore bundled
gulp.task('csslint', function() {
  gulp.src([
      cssSrc+'**/*.css',
      '!'+cssSrc+cssIndex,
      '!'+cssDist+cssBundle
    ])
    .pipe(csslint({
      'adjoining-classes': false,
      'box-model': false,
      'box-sizing': false,
      'compatible-vendor-prefixes': false,
      'bulletproof-font-face': false,
      'empty-rules': false,
      'font-faces': false,
      'font-sizes': false,
      'important': false,
      'known-properties': false,
      'outline-none': false,
      'regex-selectors': false,
      'star-property-hack': false,
      'unique-headings': false,
      'universal-selector': false,
      'unqualified-attributes': false
    }))
    .pipe(csslint.reporter());
});

// connect with live reload
gulp.task('connect', function() {
  connect.server({
    root: dist,
    livereload: true
  });
});

// watch
gulp.task('watch', function() {
  gulp.watch(cssSrc+'**/*.css', ['css']);
  gulp.watch(jsSrc+'**/*.js', ['js']);
});

// default
gulp.task('default', ['connect', 'watch']);
